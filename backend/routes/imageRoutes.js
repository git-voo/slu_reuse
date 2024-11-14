import express from 'express';
import { drive } from '../utils/googleDriveConfig.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['1p1w12_CRC1stpsQaw9eMX-KDSz1e93se'], //  actual folder ID in Google Drive
    };

    const media = {
      mimeType: req.file.mimetype,
      body: Buffer.from(req.file.buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    res.status(200).json({ url: response.data.webViewLink });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
