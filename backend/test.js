// const connectDB = require("./config/db");
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");



// dotenv.config();

// const app = express();

// // connect to database
// connectDB();

// // middleware
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







// const token = localStorage.getItem("token"); // or wherever you store it

// fetch("http://localhost:5000/users", {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${token}` // <-- add token here
//   }
// })
// .then(res => res.json())
// .then(data => console.log(data))
// .catch(err => console.error(err));
const { uploadFiles, deleteFiles, getFiles } = require("./cloudinary/func");

(async () => {
  // Upload images
  const uploads = await uploadFiles(["Gemini_Generated_Image_2zlsnl2zlsnl2zls.png"]);
  console.log("Uploaded:", uploads);

  // Get publicIds
  const ids = uploads.map(f => f.public_id);

  // Get info
  const infos = await getFiles(ids);
  console.log("File info:", infos);

  // Delete files
//   const deletes = await deleteFiles(ids);
//   console.log("Deleted:", deletes);
})();


