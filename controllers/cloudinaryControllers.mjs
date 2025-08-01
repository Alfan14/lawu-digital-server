import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from "url";

dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.ALFAN_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:  process.env.ALFAN_PUBLIC_CLOUDINARY_API_KEY,
  api_secret:  process.env.ALFAN_PUBLIC_CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error uploading to Cloudinary' });
    }
    res.json({ public_id: result.public_id, url: result.secure_url });
  }).end(req.file.buffer);
});

export default router;