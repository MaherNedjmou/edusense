const express = require("express");
const router = express.Router();

const {
  createExam,
  getExams,
  getExamById,
  getExamsByClass,
  updateExam,
  deleteExam,
  deleteExamImage,
  deleteSolutionImage
} = require("../controller/ExamCon");

router.post("/", createExam);
router.get("/", getExams);
router.get("/:id", getExamById);
router.get("/class/:classId", getExamsByClass);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

// Individual Image deletion
router.delete("/:id/exam-image", deleteExamImage);
router.delete("/:id/solution-image", deleteSolutionImage);

module.exports = router; 
