const StudentClassAnswer = require("../model/Student_Class_Answer");

// CREATE
const createAnswer = async (req, res) => {
    try {
        const answer = await StudentClassAnswer.create(req.body);
        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getAnswers = async (req, res) => {
    try {
        const answers = await StudentClassAnswer.find()
            .populate("exam")
            .populate("studentClass");
        res.json(answers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ONE
const getAnswerById = async (req, res) => {
    try {
        const answer = await StudentClassAnswer.findById(req.params.id)
            .populate("exam")
            .populate("studentClass");
        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateAnswer = async (req, res) => {
    try {
        const answer = await StudentClassAnswer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deleteAnswer = async (req, res) => {
    try {
        await StudentClassAnswer.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createAnswer,
    getAnswers,
    getAnswerById,
    updateAnswer,
    deleteAnswer
};
