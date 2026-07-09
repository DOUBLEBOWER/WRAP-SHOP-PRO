import express, { Router } from 'express';
import multer from 'multer';
import { storagePut } from './storage';
import { toast } from 'sonner';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export function registerUploadRoutes(app: express.Application) {
  // Upload reference image for design generator - handles both multipart FormData and raw bytes
  app.post('/api/upload-reference-image', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const contentType = req.file.mimetype || 'image/jpeg';
      const filename = `reference-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Upload to S3
      const { url } = await storagePut(
        `design-references/${filename}`,
        req.file.buffer,
        contentType
      );

      res.json({ url, success: true });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Legacy: Handle base64 uploads
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
