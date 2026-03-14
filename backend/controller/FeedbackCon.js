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

module.exports = {
    createFeedback,
    getFeedbacks,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
};
