import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  //cloudinary: cloudinary.v2,
  params: {
    folder: 'slu_reuse_images',  //  folder name in Cloudinary
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

export default upload;
