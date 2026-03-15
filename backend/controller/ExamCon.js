const Exam = require("../model/Exam");
const { deleteFileFromCloudinary } = require("../controller/cloudinary");

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

// GET EXAMS BY CLASS
const getExamsByClass = async (req, res) => {
    try {
        const exams = await Exam.find({ class: req.params.classId })
            .populate("class");

        res.json(exams);
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
            { returnDocument: "after" }
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
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Delete all images from Cloudinary
        const allImages = [...exam.examImages, ...exam.solutionImages];
        for (const img of allImages) {
            if (img.public_id) {
                await deleteFileFromCloudinary(img.public_id);
            }
        }

        await Exam.findByIdAndDelete(req.params.id);
        res.json({ message: "Exam deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE INDIVIDUAL EXAM IMAGE
const deleteExamImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { public_id } = req.query;
        if (!public_id) return res.status(400).json({ message: "public_id is required" });

        const exam = await Exam.findById(id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        // Remove from Cloudinary
        await deleteFileFromCloudinary(public_id);

        // Remove from DB
        exam.examImages = exam.examImages.filter(img => img.public_id !== public_id);
        await exam.save();

        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE INDIVIDUAL SOLUTION IMAGE
const deleteSolutionImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { public_id } = req.query;
        if (!public_id) return res.status(400).json({ message: "public_id is required" });

        const exam = await Exam.findById(id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        // Remove from Cloudinary
        await deleteFileFromCloudinary(public_id);

        // Remove from DB
        exam.solutionImages = exam.solutionImages.filter(img => img.public_id !== public_id);
        await exam.save();

        res.json(exam);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createExam,
    getExams,
    getExamById,
    getExamsByClass,
    updateExam,
    deleteExam,
    deleteExamImage,
    deleteSolutionImage
};
