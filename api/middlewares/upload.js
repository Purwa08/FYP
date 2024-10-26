import multer from 'multer';
import path from 'path';

// Define storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files saved temporarily in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
  }
});

// Configure multer with file type validation
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /xlsx|xls/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed!'));
    }
  }
});

export default upload;
