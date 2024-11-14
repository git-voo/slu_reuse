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
      parents: ['1p1w12_CRC1stpsQaw9eMX-KDSz1e93se'], // Replace with your actual folder ID
    };

    const media = {
      mimeType: req.file.mimetype,
      body: Readable.from(req.file.buffer),
    };

    // Step 1: Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id', // Only request the 'id' field, which is the file ID
    });

    const fileId = response.data.id;

    // Step 2: Manually construct the URL in the required format
    const viewURL = `https://drive.google.com/uc?export=view&id=${fileId}`;

    // Step 3: Send back the constructed URL as the response
    res.status(200).json({ url: viewURL });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

export default router;
