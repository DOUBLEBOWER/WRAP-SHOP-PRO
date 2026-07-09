import express, { Router } from 'express';
import { storagePut } from './storage';
import { toast } from 'sonner';

const router = Router();

export function registerUploadRoutes(app: express.Application) {
  // Upload reference image for design generator
  app.post('/api/upload-reference-image', express.raw({ type: 'image/*', limit: '10mb' }), async (req, res) => {
    try {
      if (!req.body || req.body.length === 0) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const contentType = req.headers['content-type'] || 'image/jpeg';
      const filename = `reference-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Upload to S3
      const { url } = await storagePut(
        `design-references/${filename}`,
        req.body,
        contentType
      );

      res.json({ url, success: true });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Handle multipart form data uploads
  app.post('/api/upload-reference-image-form', express.json(), async (req, res) => {
    try {
      const { file, fileName } = req.body;
      
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(file.split(',')[1] || file, 'base64');
      const filename = `reference-${Date.now()}-${fileName || 'image'}`;
      
      // Upload to S3
      const { url } = await storagePut(
        `design-references/${filename}`,
        buffer,
        'image/jpeg'
      );

      res.json({ url, success: true });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
}

export default router;
