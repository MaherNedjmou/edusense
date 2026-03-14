const express = require("express");
const router = express.Router();

const scController = require("../controller/Student_ClassCon");

router.post("/", scController.createStudentClass);

router.get("/", scController.getStudentClasses);

router.get("/:id", scController.getStudentClassById);

router.put("/:id", scController.updateStudentClass);

router.delete("/:id", scController.deleteStudentClass);

module.exports = router;
