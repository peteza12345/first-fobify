import multer from 'multer';
import DataParser from 'datauri/parser.js';
import path from 'path';

const storage = multer.memoryStorage();

const upload = multer({ storage }); // สร้าง multer middleware

const parser = new DataParser();

// สร้าง middleware สําหรับอัพโหลดไฟล์
export const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString(); // หานามสกุลไฟล์ จากชื่อไฟล์
  return parser.format(fileExtension, file.buffer).content; // แปลงไฟล์เป็น base64
};

export default upload;