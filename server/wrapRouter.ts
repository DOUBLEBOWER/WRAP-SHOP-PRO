import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { generateImage } from "./_core/imageGeneration";

export const wrapRouter = router({
  generateDesign: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        vehicleInfo: z.string(),
        style: z.string(),
        businessName: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        tagline: z.string().optional(),
        logoDataUrl: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      // Build a rich, detailed prompt for the best possible wrap design
      const styleDescriptions: Record<string, string> = {
        'bold-graffiti': 'bold graffiti street art style with vibrant colors, dynamic lettering, urban energy, spray paint effects',
        'clean-corporate': 'clean professional corporate design with strong brand identity, minimal layout, bold typography',
        'neon-cyber': 'dark background with glowing neon accents, cyberpunk futuristic aesthetic, electric blue and pink glow effects',
        'retro-route66': 'vintage Americana Route 66 style with warm earthy tones, retro signage typography, classic diner aesthetic',
        'flames-chrome': 'classic hot rod flames design with metallic chrome accents, racing stripes, aggressive automotive style',
        'camo-tactical': 'military camouflage pattern with tactical rugged outdoor aesthetic, earth tones, tactical badge elements',
        'carbon-fiber': 'sleek carbon fiber texture pattern, racing-inspired monochrome design, high-performance automotive look',
        'full-color-photo': 'full color photorealistic imagery with maximum visual impact, vibrant photo-quality graphics'
      };

      const styleDesc = styleDescriptions[input.style] || input.style;

      const fullPrompt = [
        `Professional vehicle wrap design mockup for a ${input.vehicleInfo}.`,
        `Design style: ${styleDesc}.`,
        input.businessName ? `Business name prominently displayed in large bold text: "${input.businessName}".` : '',
        input.tagline ? `Tagline text: "${input.tagline}".` : '',
        input.phone ? `Phone number displayed: ${input.phone}.` : '',
        input.website ? `Website URL: ${input.website}.` : '',
        `Show the complete vehicle from a dramatic 3/4 front angle perspective.`,
        `Photorealistic vehicle wrap mockup, studio lighting, high-end automotive photography.`,
        `The wrap covers the entire vehicle body with the design. Ultra-detailed, 8K resolution.`,
        `Professional print-ready quality. The design should look like it was created by a top automotive wrap design studio.`,
        `Vibrant, eye-catching, production-ready wrap design that would stand out on the road.`
      ].filter(Boolean).join(' ');

      console.log(`[Wrap Generator] Generating design for: ${input.vehicleInfo}`);
      console.log(`[Wrap Generator] Style: ${input.style}`);
      console.log(`[Wrap Generator] Prompt length: ${fullPrompt.length} chars`);

      const result = await generateImage({
        prompt: fullPrompt,
        ...(input.logoDataUrl ? {
          originalImages: [{
            url: input.logoDataUrl,
            mimeType: 'image/png' as const
          }]
        } : {})
      });

      return {
        imageUrl: result.url ?? '',
        prompt: fullPrompt
      };
    })
});
