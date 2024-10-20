import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, 'public/uploads'); // เก็บไฟล์ที่อัพโหลดไว้ที่ public/uploads
  },
  filename: (req, file, cd) => {
    const fileName = file.originalname; // เก็บชื่อไฟล์ที่อัพโหลด
    cd(null, fileName);
  }
});

const upload = multer({ storage }); // สร้าง multer middleware

export default upload;