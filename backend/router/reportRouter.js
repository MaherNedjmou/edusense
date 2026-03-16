const express = require("express");
const router = express.Router();
const { generateExamReport, generateStudentReport } = require("../controller/ReportCon");

// GET /reports/exam/:analysisId  — Exam analysis PDF
router.get("/exam/:analysisId", generateExamReport);

// GET /reports/student/:studentId — Student history PDF (studentId = StudentClass._id)
router.get("/student/:studentId", generateStudentReport);

module.exports = router;
