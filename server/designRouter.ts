import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { generateImage } from './_core/imageGeneration';

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
        // Generate the main design
        const mainDesign = await generateImage({
          prompt: enhancedPrompt
        });

        // Generate variations if requested
        const variations: string[] = [];
        if (input.variations > 1) {
          for (let i = 1; i < input.variations; i++) {
            const variationPrompt = `${enhancedPrompt}\n\nCreate a DIFFERENT variation with an alternative layout, color scheme, or composition while keeping the same style and information.`;
            const variation = await generateImage({
              prompt: variationPrompt
            });
            if (variation.url) variations.push(variation.url);
          }
        }

        return {
          success: true,
          mainDesign: mainDesign.url || '',
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
        throw new Error('Failed to generate design. Please try again.');
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
  getCategories: publicProcedure.query(() => DESIGN_CATEGORIES)
});
