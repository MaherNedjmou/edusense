const express = require("express");
const router = express.Router();

const feedbackController = require("../controller/FeedbackCon");

router.post("/", feedbackController.createFeedback);

router.get("/", feedbackController.getFeedbacks);

router.get("/:id", feedbackController.getFeedbackById);

router.put("/:id", feedbackController.updateFeedback);

router.delete("/:id", feedbackController.deleteFeedback);

router.post("/generate", feedbackController.generateFeedback);

router.post("/bulk-analyze", feedbackController.bulkAnalyzeSection);

module.exports = router;
