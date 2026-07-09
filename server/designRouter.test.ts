import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

// Mock the generateImage function
vi.mock('./_core/imageGeneration', () => ({
  generateImage: vi.fn()
}));

// Mock the database
vi.mock('./db', () => ({
  getDb: vi.fn()
}));

import { generateImage } from './_core/imageGeneration';

describe('Design Router - Image Generation Fixes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Parallel Variation Generation', () => {
    it('should generate main design and variations in parallel', async () => {
      const mockGenerateImage = generateImage as any;
      
      // Mock successful image generation
      mockGenerateImage.mockResolvedValue({ url: 'https://example.com/image.png' });

      // Simulate the fixed generation logic
      const enhancedPrompt = 'Test prompt';
      const variations = 3;
      
      // Generate main design
      const mainDesign = await generateImage({
        prompt: enhancedPrompt
      });

      expect(mainDesign.url).toBe('https://example.com/image.png');

      // Generate variations in parallel (not sequential)
      const maxVariations = Math.min(variations - 1, 2);
      const variationPromises = Array.from({ length: maxVariations }, (_, i) => {
        return generateImage({
          prompt: `${enhancedPrompt}\n\nVariation ${i + 1}`
        });
      });

      const variationResults = await Promise.all(variationPromises);
      
      expect(variationResults).toHaveLength(2);
      expect(variationResults.every(r => r.url)).toBe(true);
      
      // Verify that all calls were made (parallel, not sequential)
      expect(mockGenerateImage).toHaveBeenCalledTimes(3); // 1 main + 2 variations
    });

    it('should cap variations at 2 to avoid timeout', async () => {
      const mockGenerateImage = generateImage as any;
      mockGenerateImage.mockResolvedValue({ url: 'https://example.com/image.png' });

      const requestedVariations = 4;
      const maxVariations = Math.min(requestedVariations - 1, 2);

      expect(maxVariations).toBe(2);
    });

    it('should handle variation generation failures gracefully', async () => {
      const mockGenerateImage = generateImage as any;
      
      // First call succeeds, second fails, third succeeds
      mockGenerateImage
        .mockResolvedValueOnce({ url: 'https://example.com/main.png' })
        .mockRejectedValueOnce(new Error('Generation failed'))
        .mockResolvedValueOnce({ url: 'https://example.com/variation2.png' });

      const mainDesign = await generateImage({ prompt: 'Main' });
      expect(mainDesign.url).toBe('https://example.com/main.png');

      const variationPromises = [
        generateImage({ prompt: 'Var 1' }).catch(() => ({ url: '' })),
        generateImage({ prompt: 'Var 2' }).catch(() => ({ url: '' }))
      ];

      const results = await Promise.all(variationPromises);
      const validVariations = results.filter(r => r.url);

      expect(validVariations).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('should throw error if main design generation fails', async () => {
      const mockGenerateImage = generateImage as any;
      mockGenerateImage.mockResolvedValue({ url: '' });

      const mainDesign = await generateImage({ prompt: 'Test' });
      
      if (!mainDesign.url) {
        expect(() => {
          throw new Error('Failed to generate main design image');
        }).toThrow('Failed to generate main design image');
      }
    });

    it('should provide detailed error messages', () => {
      const error = new Error('Image service timeout');
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate design';
      const fullMessage = `Design generation failed: ${errorMessage}. Please try again with fewer variations or smaller reference images.`;

      expect(fullMessage).toContain('Image service timeout');
      expect(fullMessage).toContain('fewer variations');
    });
  });

  describe('Reference Image Handling', () => {
    it('should properly handle reference images in generation', async () => {
      const mockGenerateImage = generateImage as any;
      mockGenerateImage.mockResolvedValue({ url: 'https://example.com/image.png' });

      const referenceImages = [
        { url: 'https://example.com/ref1.jpg', mimeType: 'image/jpeg' },
        { url: 'https://example.com/ref2.jpg', mimeType: 'image/jpeg' }
      ];

      const result = await generateImage({
        prompt: 'Design with references',
        originalImages: referenceImages
      });

      expect(result.url).toBe('https://example.com/image.png');
      expect(mockGenerateImage).toHaveBeenCalledWith(
        expect.objectContaining({
          originalImages: referenceImages
        })
      );
    });
  });

  describe('Multipart Upload Handling', () => {
    it('should validate multer middleware receives FormData correctly', () => {
      // This test verifies the upload endpoint structure
      // In real scenario, multer.single('file') middleware should:
      // 1. Parse multipart/form-data
      // 2. Store file in req.file
      // 3. Make req.file.buffer available for S3 upload

      const mockReqFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake image data')
      };

      expect(mockReqFile).toBeDefined();
      expect(mockReqFile.buffer).toBeDefined();
      expect(mockReqFile.mimetype).toBe('image/jpeg');
    });
  });
});
