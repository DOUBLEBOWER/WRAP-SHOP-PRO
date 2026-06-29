import express from 'express';
import multer from 'multer';
import { storagePut } from './storage';

const upload = multer({ storage: multer.memoryStorage() });

export function registerPortfolioRoutes(app: express.Application) {
  // Portfolio image upload endpoint
  app.post('/api/portfolio/upload', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Upload to S3
      const { key, url } = await storagePut(
        `portfolio/${Date.now()}_${file.originalname}`,
        file.buffer,
        file.mimetype
      );

      res.json({
        imageUrl: url,
        imageKey: key,
        success: true
      });
    } catch (error) {
      console.error('Portfolio upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
}
