const Exam = require("../model/Exam");

// CREATE
const createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getExams = async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate("class");
        res.json(exams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ONE
const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate("class");

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.json({ message: "Exam deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createExam,
    getExams,
    getExamById,
    updateExam,
    deleteExam
};
