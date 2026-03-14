const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1️⃣ Upload multiple files
const uploadFiles = async (paths = []) => {
  const results = [];

  for (const path of paths) {
    try {
      const res = await cloudinary.uploader.upload(path, {
        folder: "uploads", // optional folder
      });
      results.push(res);
    } catch (err) {
      console.error("Upload error:", err);
    }
  }

  return results; // array of Cloudinary responses
};

// 2️⃣ Delete multiple files
const deleteFiles = async (publicIds = []) => {
  const results = [];

  for (const id of publicIds) {
    try {
      const res = await cloudinary.uploader.destroy(id);
      results.push(res);
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return results;
};

// 3️⃣ Get file info (one or many)
const getFiles = async (publicIds = []) => {
  const results = [];

  for (const id of publicIds) {
    try {
      const res = await cloudinary.api.resource(id);
      results.push(res);
    } catch (err) {
      console.error("Get file error:", err);
    }
  }

  return results;
};

module.exports = { uploadFiles, deleteFiles, getFiles };
