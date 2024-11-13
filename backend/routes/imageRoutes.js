import express from 'express';
import upload from '../utils/cloudinaryConfig/multerConfig.js';




const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    // Send back the Cloudinary URL of the uploaded image
    res.status(200).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
