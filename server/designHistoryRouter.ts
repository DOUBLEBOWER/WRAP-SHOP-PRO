import { z } from 'zod';
import { protectedProcedure, router } from './_core/trpc';
import {
  saveDesignToHistory,
  getUserDesignHistory,
  getUserFavoriteDesigns,
  toggleDesignFavorite,
  updateDesignName,
  deleteDesign
} from './db';

export const designHistoryRouter = router({
  // Save a generated design to history
  saveDesign: protectedProcedure
    .input(
      z.object({
        category: z.string(),
        style: z.string(),
        prompt: z.string(),
        companyName: z.string().optional(),
        phoneNumber: z.string().optional(),
        website: z.string().optional(),
        mainImageUrl: z.string(),
        mainImageKey: z.string().optional(),
        variationImageUrls: z.array(z.string()).optional(),
        variationImageKeys: z.array(z.string()).optional(),
        referenceImageUrls: z.array(z.string()).optional(),
        designName: z.string().optional(),
        notes: z.string().optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const design = await saveDesignToHistory(ctx.user.id, {
          category: input.category,
          style: input.style,
          prompt: input.prompt,
          companyName: input.companyName || undefined,
          phoneNumber: input.phoneNumber || undefined,
          website: input.website || undefined,
          mainImageUrl: input.mainImageUrl,
          mainImageKey: input.mainImageKey || undefined,
          variationImageUrls: input.variationImageUrls || undefined,
          variationImageKeys: input.variationImageKeys || undefined,
          referenceImageUrls: input.referenceImageUrls || undefined,
          designName: input.designName || `Design - ${new Date().toLocaleDateString()}`,
          notes: input.notes || undefined,
          isFavorite: false
        });

        return {
          success: true,
          design
        };
      } catch (error) {
        console.error('[Design History] Failed to save design:', error);
        throw new Error('Failed to save design to history');
      }
    }),

  // Get user's design history
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50)
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const designs = await getUserDesignHistory(ctx.user.id, input.limit);
        return {
          success: true,
          designs,
          count: designs.length
        };
      } catch (error) {
        console.error('[Design History] Failed to get history:', error);
        throw new Error('Failed to retrieve design history');
      }
    }),

  // Get user's favorite designs
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    try {
      const designs = await getUserFavoriteDesigns(ctx.user.id);
      return {
        success: true,
        designs,
        count: designs.length
      };
    } catch (error) {
      console.error('[Design History] Failed to get favorites:', error);
      throw new Error('Failed to retrieve favorite designs');
    }
  }),

  // Toggle favorite status
  toggleFavorite: protectedProcedure
    .input(
      z.object({
        designId: z.string(),
        isFavorite: z.boolean()
      })
    )
    .mutation(async ({ input }) => {
      try {
        const design = await toggleDesignFavorite(input.designId, input.isFavorite);
        return {
          success: true,
          design
        };
      } catch (error) {
        console.error('[Design History] Failed to toggle favorite:', error);
        throw new Error('Failed to update favorite status');
      }
    }),

  // Update design name and notes
  updateDesign: protectedProcedure
    .input(
      z.object({
        designId: z.string(),
        designName: z.string().optional(),
        notes: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      try {
        const design = await updateDesignName(input.designId, input.designName, input.notes);
        return {
          success: true,
          design
        };
      } catch (error) {
        console.error('[Design History] Failed to update design:', error);
        throw new Error('Failed to update design');
      }
    }),

  // Delete a design from history
  deleteDesign: protectedProcedure
    .input(z.object({ designId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const success = await deleteDesign(input.designId);
        return { success };
      } catch (error) {
        console.error('[Design History] Failed to delete design:', error);
        throw new Error('Failed to delete design');
      }
    })
});
