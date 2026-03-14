const express = require("express");
const multer = require("multer");
const { uploadFilesController } = require("../controller/cloudinary");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /cloudinary/upload
router.post("/upload", upload.array("files"), uploadFilesController);

module.exports = router;
