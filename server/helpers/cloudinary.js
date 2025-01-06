const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split('@')[1],
  api_key: process.env.CLOUDINARY_URL.split(':')[1].replace('//', ''),
  api_secret: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0],
});

console.log('Cloudinary Configured Successfully!');


const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
