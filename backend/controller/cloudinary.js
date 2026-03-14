const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadFilesController = async (req, res) => {
  const files = req.files;
  console.log("Received files:", files);

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const results = [];

  for (const file of files) {
    try {
      const resCloud = await cloudinary.uploader.upload(file.path, {
        folder: "uploads",
      });

      console.log("Uploaded file URL:", resCloud.secure_url);

      results.push({
        originalName: file.originalname,
        cloudinaryUrl: resCloud.secure_url,
      });

      fs.unlinkSync(file.path);

    } catch (err) {
      console.error("Upload error:", err);
      results.push({
        originalName: file.originalname,
        error: err.message,
      });
    }
  }

  return res.json({
    message: "Files processed",
    results,
  });
};

module.exports = { uploadFilesController };
