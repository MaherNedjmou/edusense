const express = require("express");
const router = express.Router();

const scController = require("../controller/Student_ClassCon");

// Student-specific routes (must come before param routes)
router.get("/my", scController.getMyClasses);
router.get("/my-stats", scController.getMyDashboardStats);
router.get("/my-enrollment/:classId", scController.getMyEnrollment);
router.post("/join", scController.joinClass);

router.post("/", scController.createStudentClass);

router.get("/stats/:classId", scController.getStudentClassesStats);

router.get("/", scController.getStudentClasses);

router.get("/:id", scController.getStudentClassById);

router.put("/:id", scController.updateStudentClass);

router.delete("/:id", scController.deleteStudentClass);

module.exports = router;
