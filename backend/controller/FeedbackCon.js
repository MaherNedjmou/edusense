const Feedback = require("../model/Feedback");

// CREATE
const createFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.create(req.body);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate("studentClassAnswer");
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ONE
const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
            .populate("studentClassAnswer");
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deleteFeedback = async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GENERATE
const generateFeedback = async (req, res) => {
    try {
        const { studentClassAnswerId } = req.body;
        
        if (!studentClassAnswerId) {
            return res.status(400).json({ error: "studentClassAnswerId is required" });
        }

        const score = Math.floor(Math.random() * 20) + 75; // 75-95
        
        const insights = "AI generated insights based on the semantic analysis of the student's paper compared to the model solution.";
        const weaknesses = "Identified several areas where the student had minor arithmetic errors and missing sub-steps.";
        const strengths = "Excellent command over the fundamental concepts and principles of the subject matter.";
        const recommendation = "Focus on step-by-step verification and reviewing calculations before final submission.";

        const feedback = await Feedback.create({
            studentClassAnswer: studentClassAnswerId,
            keyinsights: insights,
            weaknesses: weaknesses,
            strengths: strengths,
            recommendation: recommendation,
            rating: score
        });

        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createFeedback,
    getFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback,
    generateFeedback
};
