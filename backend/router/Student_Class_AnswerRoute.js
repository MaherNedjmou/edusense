const express = require("express");
const router = express.Router();

const answerController = require("../controller/Student_Class_AnswerCon");

router.post("/", answerController.createAnswer);

router.get("/", answerController.getAnswers);

router.get("/:id", answerController.getAnswerById);

router.put("/:id", answerController.updateAnswer);

router.delete("/:id", answerController.deleteAnswer);

module.exports = router;
