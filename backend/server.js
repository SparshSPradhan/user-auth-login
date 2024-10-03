const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const cors = require('cors');
const path = require('path');

// Load env variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use('/auth', authRoute);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Image Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  // Check file type and use Cloudinary API for image manipulation
  cloudinary.uploader.upload(filePath, { transformation: { width: 500, height: 500, crop: "limit" } })
    .then(result => res.json({ message: 'File uploaded successfully', url: result.url }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
