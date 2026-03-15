const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherAnalytics
} = require("../controller/TeacherCon");

// Specific routes first
router.get("/stats", getDashboardStats);
router.get("/analytics", getTeacherAnalytics);

// General routes
router.post("/", createTeacher);
router.get("/", getTeachers);

// Parameterized routes last
router.get("/:id", getTeacherById);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;
