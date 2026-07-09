import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from './_core/trpc';
import { generateImage } from './_core/imageGeneration';
import { getDb } from './db';
import { designApprovals } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const DESIGN_STYLES = {
  'Modern Minimalist': 'Clean, modern design with minimal text, bold geometric shapes, sans-serif typography, flat colors',
  'Neon Cyber': 'Vibrant neon colors (cyan, magenta, yellow), glowing effects, futuristic aesthetic, tech-inspired',
  'Graffiti Street': 'Bold graffiti-style lettering, street art aesthetic, layered colors, urban vibe, expressive',
  'Corporate Professional': 'Clean corporate design, professional colors (blues, grays, blacks), elegant typography, minimalist',
  'Retro Route 66': 'Vintage 1950s-60s aesthetic, warm colors (reds, oranges, yellows), retro typography, nostalgic',
  'Holographic': 'Iridescent colors, holographic effects, gradient transitions, futuristic shimmer',
  'Metallic Chrome': 'Chrome and metallic effects, reflective surfaces, shiny finish, premium look',
  'Watercolor Art': 'Soft watercolor blending, artistic brush strokes, flowing colors, organic shapes'
};

const DESIGN_CATEGORIES = {
  'Vehicle Wrap': 'Full vehicle wrap design with side panels, hood, roof, and rear. Include company branding, contact info, and eye-catching graphics.',
  'Storefront': 'Window storefront design with signage, logo placement, business hours, and promotional elements.',
  'Custom Apparel': 'T-shirt or hoodie design with front and back layouts, centered logo, and complementary graphics.',
  'Hydro Dipping': 'Abstract pattern design suitable for hydro dipping on helmets, wheels, or accessories.',
  'Window Tinting': 'Decorative window tint design with privacy patterns, logos, or artistic elements.',
  'Custom Stickers': 'Die-cut sticker design with transparent background, bold graphics, and high contrast.',
  'Photo Prints': 'High-resolution photo print design with artistic effects, borders, and professional finishing.'
};

export const designRouter = router({
  generateDesign: publicProcedure
      .input(
      z.object({
        category: z.string(),
        style: z.string(),
        prompt: z.string(),
        companyName: z.string().optional(),
        phoneNumber: z.string().optional(),
        website: z.string().optional(),
        logoUrl: z.string().optional(),
        referenceImages: z.array(z.object({
          url: z.string(),
          mimeType: z.string().optional()
        })).optional(),
        variations: z.coerce.number().min(1).max(4).default(1),
        resolution: z.enum(['standard', 'high', 'ultra']).default('high')
      })
    )
    .mutation(async ({ input }) => {
      const categoryContext = DESIGN_CATEGORIES[input.category as keyof typeof DESIGN_CATEGORIES] || '';
      const styleContext = DESIGN_STYLES[input.style as keyof typeof DESIGN_STYLES] || '';

      // Build comprehensive AI prompt
      const enhancedPrompt = `
You are a professional graphic designer creating a ${input.category} design.

CATEGORY CONTEXT: ${categoryContext}

DESIGN STYLE: ${styleContext}

USER REQUEST: ${input.prompt}

${input.companyName ? `COMPANY NAME: ${input.companyName}` : ''}
${input.phoneNumber ? `PHONE: ${input.phoneNumber}` : ''}
${input.website ? `WEBSITE: ${input.website}` : ''}

REQUIREMENTS:
- Professional, high-quality design
- Incorporate all provided business information prominently
- Use the specified style consistently
- Ensure text is readable and well-positioned
- Create a design that would work for print production
- Use vibrant, eye-catching colors
- Include all requested elements from the user prompt
- Make the design memorable and brand-appropriate

IMPORTANT: Generate a single, cohesive, professional design that meets all requirements above.
      `.trim();

      try {
        console.log('[Design Generator] Starting generation for:', input.category, 'with', input.variations, 'variations');
        
        // Generate the main design with reference images if provided
        const mainDesign = await generateImage({
          prompt: enhancedPrompt,
          originalImages: input.referenceImages && input.referenceImages.length > 0 
            ? input.referenceImages.map(img => ({
                url: img.url,
                mimeType: img.mimeType || 'image/jpeg'
              }))
            : undefined
        });

        console.log('[Design Generator] Main design generated:', mainDesign.url ? 'success' : 'failed');

        if (!mainDesign.url) {
          throw new Error('Failed to generate main design image');
        }

        // Generate variations in parallel (not sequential) to avoid timeout
        // Cap variations at 2 for large designs to stay under request timeout
        const maxVariations = Math.min(input.variations - 1, 2);
        const variations: string[] = [];
        
        if (maxVariations > 0) {
          console.log('[Design Generator] Generating', maxVariations, 'variations in parallel');
          const variationPromises = Array.from({ length: maxVariations }, (_, i) => {
            const variationPrompt = `${enhancedPrompt}\n\nCreate variation ${i + 1}: a DIFFERENT design with an alternative layout, color scheme, or composition while keeping the same style and information.`;
            return generateImage({
              prompt: variationPrompt,
              originalImages: input.referenceImages && input.referenceImages.length > 0 
                ? input.referenceImages.map(img => ({
                    url: img.url,
                    mimeType: img.mimeType || 'image/jpeg'
                  }))
                : undefined
            }).catch(err => {
              console.error('[Design Generator] Variation generation failed:', err);
              return { url: '' };
            });
          });
          
          const variationResults = await Promise.all(variationPromises);
          variationResults.forEach(result => {
            if (result.url) variations.push(result.url);
          });
          console.log('[Design Generator] Generated', variations.length, 'variations');
        }

        return {
          success: true,
          mainDesign: mainDesign.url,
          variations: variations as string[],
          metadata: {
            category: input.category,
            style: input.style,
            resolution: input.resolution,
            timestamp: new Date().toISOString(),
            companyName: input.companyName,
            phoneNumber: input.phoneNumber,
            website: input.website
          }
        };
      } catch (error) {
        console.error('[Design Generation Error]', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate design';
        throw new Error(`Design generation failed: ${errorMessage}. Please try again with fewer variations or smaller reference images.`);
      }
    }),

  generateBatch: publicProcedure
    .input(
      z.object({
        designs: z.array(
          z.object({
            category: z.string(),
            style: z.string(),
            prompt: z.string(),
            companyName: z.string().optional()
          })
        )
      })
    )
    .mutation(async ({ input }) => {
      try {
        const results = await Promise.all(
          input.designs.map(design =>
            generateImage({
              prompt: `${DESIGN_CATEGORIES[design.category as keyof typeof DESIGN_CATEGORIES] || ''}\n\nStyle: ${DESIGN_STYLES[design.style as keyof typeof DESIGN_STYLES] || ''}\n\n${design.prompt}`
            })
          )
        );

        return {
          success: true,
          designs: results.map((r, i) => ({
            url: r.url,
            category: input.designs[i].category,
            style: input.designs[i].style
          }))
        };
      } catch (error) {
        console.error('[Batch Generation Error]', error);
        throw new Error('Failed to generate batch designs.');
      }
    }),

  getStyles: publicProcedure.query(() => DESIGN_STYLES),
  getCategories: publicProcedure.query(() => DESIGN_CATEGORIES),

  submitForApproval: protectedProcedure
    .input(
      z.object({
        dealId: z.string(),
        designImageUrl: z.string(),
        designName: z.string(),
        clientEmail: z.string().email(),
        clientName: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      
      const approvalId = `approval-${Date.now()}`;
      const approvalToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      await db.insert(designApprovals).values({
        id: approvalId,
        dealId: input.dealId,
        designImageUrl: input.designImageUrl,
        designName: input.designName,
        status: 'pending',
        clientEmail: input.clientEmail,
        clientName: input.clientName,
        approvalToken,
        createdBy: ctx.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { approvalId, approvalToken };
    }),

  getApprovalByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      
      const approval = await db.select().from(designApprovals).where(eq(designApprovals.approvalToken, input.token)).limit(1);
      if (approval.length === 0) throw new Error('Approval not found');
      return approval[0];


    }),

  updateApprovalStatus: publicProcedure
    .input(
      z.object({
        token: z.string(),
        status: z.enum(['approved', 'rejected', 'revisions_requested']),
        feedback: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database connection failed');
      
      await db.update(designApprovals)
        .set({
          status: input.status,
          feedback: input.feedback,
          updatedAt: new Date()
        })
        .where(eq(designApprovals.approvalToken, input.token));

      return { success: true };
    })
});
