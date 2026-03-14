const StudentClass = require("../model/Student_Class");

// CREATE
const createStudentClass = async (req, res) => {
    try {
        const sc = await StudentClass.create(req.body);
        res.json(sc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ALL
const getStudentClasses = async (req, res) => {
    try {
        const scList = await StudentClass.find()
            .populate("student")
            .populate("class");
        res.json(scList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ONE
const getStudentClassById = async (req, res) => {
    try {
        const sc = await StudentClass.findById(req.params.id)
            .populate("student")
            .populate("class");
        res.json(sc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateStudentClass = async (req, res) => {
    try {
        const sc = await StudentClass.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(sc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deleteStudentClass = async (req, res) => {
    try {
        await StudentClass.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createStudentClass,
    getStudentClasses,
    getStudentClassById,
    updateStudentClass,
    deleteStudentClass
};
