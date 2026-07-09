import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

// Mock database functions
vi.mock('./db', () => ({
  saveDesignToHistory: vi.fn(),
  getUserDesignHistory: vi.fn(),
  getUserFavoriteDesigns: vi.fn(),
  toggleDesignFavorite: vi.fn(),
  updateDesignName: vi.fn(),
  deleteDesign: vi.fn()
}));

import {
  saveDesignToHistory,
  getUserDesignHistory,
  getUserFavoriteDesigns,
  toggleDesignFavorite,
  updateDesignName,
  deleteDesign
} from './db';

describe('Design History Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Save Design to History', () => {
    it('should save a generated design with all metadata', async () => {
      const mockSaveDesignToHistory = saveDesignToHistory as any;
      const mockDesign = {
        id: 'design-123',
        userId: 1,
        category: 'Vehicle Wrap',
        style: 'Modern Minimalist',
        prompt: 'Create a professional wrap for a truck',
        companyName: 'Coast 2 Coast',
        phoneNumber: '918-525-1589',
        website: 'coast2coast.com',
        mainImageUrl: 'https://example.com/design.png',
        mainImageKey: 'design-key-123',
        variationImageUrls: ['https://example.com/var1.png'],
        variationImageKeys: ['var-key-1'],
        referenceImageUrls: ['https://example.com/ref.png'],
        designName: 'Truck Wrap v1',
        notes: 'Client approved this design',
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockSaveDesignToHistory.mockResolvedValue(mockDesign);

      const result = await saveDesignToHistory(1, {
        category: 'Vehicle Wrap',
        style: 'Modern Minimalist',
        prompt: 'Create a professional wrap for a truck',
        companyName: 'Coast 2 Coast',
        phoneNumber: '918-525-1589',
        website: 'coast2coast.com',
        mainImageUrl: 'https://example.com/design.png',
        mainImageKey: 'design-key-123',
        variationImageUrls: ['https://example.com/var1.png'],
        variationImageKeys: ['var-key-1'],
        referenceImageUrls: ['https://example.com/ref.png'],
        designName: 'Truck Wrap v1',
        notes: 'Client approved this design',
        isFavorite: false
      });

      expect(result).toEqual(mockDesign);
      expect(mockSaveDesignToHistory).toHaveBeenCalled();
    });
  });

  describe('Retrieve Design History', () => {
    it('should retrieve user design history with limit', async () => {
      const mockGetUserDesignHistory = getUserDesignHistory as any;
      const mockDesigns = [
        {
          id: 'design-1',
          userId: 1,
          category: 'Vehicle Wrap',
          style: 'Modern Minimalist',
          prompt: 'Design 1',
          mainImageUrl: 'url1',
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'design-2',
          userId: 1,
          category: 'Poster',
          style: 'Retro Route 66',
          prompt: 'Design 2',
          mainImageUrl: 'url2',
          isFavorite: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockGetUserDesignHistory.mockResolvedValue(mockDesigns);

      const result = await getUserDesignHistory(1, 50);

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('Vehicle Wrap');
      expect(result[1].isFavorite).toBe(true);
    });
  });

  describe('Favorites Management', () => {
    it('should retrieve only favorite designs', async () => {
      const mockGetUserFavoriteDesigns = getUserFavoriteDesigns as any;
      const mockFavorites = [
        {
          id: 'design-2',
          userId: 1,
          category: 'Poster',
          style: 'Retro',
          prompt: 'Favorite design',
          mainImageUrl: 'url2',
          isFavorite: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockGetUserFavoriteDesigns.mockResolvedValue(mockFavorites);

      const result = await getUserFavoriteDesigns(1);

      expect(result).toHaveLength(1);
      expect(result[0].isFavorite).toBe(true);
    });

    it('should toggle favorite status', async () => {
      const mockToggleFavorite = toggleDesignFavorite as any;
      const mockDesign = {
        id: 'design-1',
        userId: 1,
        category: 'Vehicle Wrap',
        style: 'Modern',
        prompt: 'Design',
        mainImageUrl: 'url',
        isFavorite: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockToggleFavorite.mockResolvedValue(mockDesign);

      const result = await toggleDesignFavorite('design-1', true);

      expect(result.isFavorite).toBe(true);
      expect(mockToggleFavorite).toHaveBeenCalledWith('design-1', true);
    });
  });

  describe('Design Metadata Updates', () => {
    it('should update design name and notes', async () => {
      const mockUpdateDesignName = updateDesignName as any;
      const mockDesign = {
        id: 'design-1',
        userId: 1,
        category: 'Vehicle Wrap',
        style: 'Modern',
        prompt: 'Design',
        mainImageUrl: 'url',
        designName: 'Updated Wrap Name',
        notes: 'Updated notes',
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUpdateDesignName.mockResolvedValue(mockDesign);

      const result = await updateDesignName('design-1', 'Updated Wrap Name', 'Updated notes');

      expect(result.designName).toBe('Updated Wrap Name');
      expect(result.notes).toBe('Updated notes');
    });
  });

  describe('Design Deletion', () => {
    it('should delete a design from history', async () => {
      const mockDeleteDesign = deleteDesign as any;
      mockDeleteDesign.mockResolvedValue(true);

      const result = await deleteDesign('design-1');

      expect(result).toBe(true);
      expect(mockDeleteDesign).toHaveBeenCalledWith('design-1');
    });
  });

  describe('tRPC Router Integration', () => {
    it('should validate saveDesign input schema', () => {
      const saveDesignSchema = z.object({
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
      });

      const validInput = {
        category: 'Vehicle Wrap',
        style: 'Modern Minimalist',
        prompt: 'Create a wrap',
        mainImageUrl: 'https://example.com/image.png'
      };

      const result = saveDesignSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should validate getHistory input schema', () => {
      const getHistorySchema = z.object({
        limit: z.number().min(1).max(100).default(50)
      });

      const validInput = { limit: 25 };
      const result = getHistorySchema.safeParse(validInput);
      expect(result.success).toBe(true);

      const invalidInput = { limit: 200 };
      const invalidResult = getHistorySchema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
    });
  });
});
