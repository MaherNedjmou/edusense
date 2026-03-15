const StudentClassAnswer = require("../model/Student_Class_Answer");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

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

// UPLOAD STUDENT ANSWER
const uploadStudentAnswer = async (req, res) => {
    const { examId, studentClassId } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    try {
        const results = [];
        for (const file of files) {
            const resCloud = await cloudinary.uploader.upload(file.path, {
                folder: "student_answers",
            });
            results.push({
                url: resCloud.secure_url,
                public_id: resCloud.public_id,
            });
            fs.unlinkSync(file.path);
        }

        const answer = await StudentClassAnswer.create({
            exam: examId,
            studentClass: studentClassId,
            answers: results,
            submittedAt: new Date()
        });

        res.json(answer);
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createAnswer,
    getAnswers,
    getAnswerById,
    updateAnswer,
    deleteAnswer,
    uploadStudentAnswer
};
