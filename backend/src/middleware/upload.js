import ImageKit from 'imagekit';
import multer from 'multer';
import 'dotenv/config';

let imagekit = null;

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  console.log("✅ ImageKit initialized successfully");
} else {
  console.warn("⚠️ ImageKit keys missing. Using placeholder images.");
}

const storage = multer.memoryStorage();
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).array('images', 4);

export const uploadToImageKit = async (file) => {
  if (!imagekit) {
    return { 
      url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
      fileId: 'mock_id_' + Date.now() 
    };
  }

  return new Promise((resolve, reject) => {
    imagekit.upload({
      file: file.buffer,
      fileName: `prop_${Date.now()}_${file.originalname}`,
      folder: '/real-estate',
    }, (error, result) => {
      if (error) reject(error);
      else resolve({ url: result.url, fileId: result.fileId });
    });
  });
};