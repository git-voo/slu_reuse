import express from 'express';
import { drive } from '../utils/googleDriveConfig.js';
import multer from 'multer';
import { Readable } from 'stream';
const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['1p1w12_CRC1stpsQaw9eMX-KDSz1e93se'], //  folder ID
    };

    const media = {
      mimeType: req.file.mimetype,
      body: Readable.from(req.file.buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    res.status(200).json({ url: response.data.webViewLink });
  } catch (error) {
    console.error('Error uploading image:', error);
    //res.status(500).json({ error: 'Failed to upload image' });
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

export default router;
