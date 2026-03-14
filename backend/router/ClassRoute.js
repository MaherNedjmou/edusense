const express = require("express");
const router = express.Router();

const {
  createClass,
  getClasses,
  getClassesByTeacher,
  getClassById,
  updateClass,
  deleteClass
} = require("../controller/ClassCon");

router.post("/", createClass);

router.get("/", getClasses);

router.get("/my", getClassesByTeacher);

router.get("/:id", getClassById);

router.put("/:id", updateClass);

router.delete("/:id", deleteClass);

module.exports = router;
