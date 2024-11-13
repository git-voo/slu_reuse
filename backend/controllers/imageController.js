
import cloudinary from '../utils/cloudinaryConfig.js';

export const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'slu_reuse', // optional folder in Cloudinary
    });

    // Send back the URL of the uploaded image
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};
