const express = require("express");
const router = express.Router();

const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam
} = require("../controller/ExamCon");

router.post("/", createExam);
router.get("/", getExams);
router.get("/:id", getExamById);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

module.exports = router; 
