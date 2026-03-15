const express = require("express");
const router = express.Router();

const answerController = require("../controller/Student_Class_AnswerCon");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", answerController.createAnswer);
router.post("/upload", upload.array("files"), answerController.uploadStudentAnswer);
router.get("/ping", (req, res) => res.json({ message: "pong" }));

router.get("/", answerController.getAnswers);

router.get("/:id", answerController.getAnswerById);

router.put("/:id", answerController.updateAnswer);

router.delete("/:id", answerController.deleteAnswer);

module.exports = router;
