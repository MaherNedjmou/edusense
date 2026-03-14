const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require("../controller/TeacherCon");

router.get("/stats", getDashboardStats);
router.post("/", createTeacher);
router.get("/", getTeachers);
router.get("/:id", getTeacherById);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;
