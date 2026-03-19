const Class = require("../model/Class");
const Teacher = require("../model/Teacher");
const StudentClass = require("../model/Student_Class");
const Exam = require("../model/Exam");
const crypto = require("crypto");

// Helper: generate a unique 6-char alphanumeric class code
const generateClassCode = () =>
  crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. "A3F9C2"

// CREATE CLASS
const createClass = async (req, res) => {
  try {
    // Find the teacher profile for this user
    let teacher = await Teacher.findOne({ user: req.user._id });

    // If no teacher profile but user is teacher, create one
    if (!teacher && req.user.role === "teacher") {
      teacher = await Teacher.create({ user: req.user._id });
    }

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher profile not found" });
    }

    // Auto-generate a unique code if not provided
    let code = req.body.code;
    if (!code) {
      let attempts = 0;
      do {
        code = generateClassCode();
        const existing = await Class.findOne({ code });
        if (!existing) break;
        attempts++;
      } while (attempts < 10);
    }

    const newClass = await Class.create({ ...req.body, code, teacher: teacher._id });
    res.status(201).json({
      success: true,
      data: newClass
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET MY CLASSES (Teacher's own classes)
const getClassesByTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher profile not found" });
    }

    const classes = await Class.find({ teacher: teacher._id }).sort({ createdAt: -1 }).lean();

    const enhancedClasses = await Promise.all(classes.map(async (cls) => {
      const studentCount = await StudentClass.countDocuments({ class: cls._id });
      const sectionCount = await Exam.countDocuments({ class: cls._id });
      return { ...cls, studentCount, sectionCount };
    }));

    res.status(200).json({
      success: true,
      count: enhancedClasses.length,
      data: enhancedClasses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// GET ALL CLASSES
const getClasses = async (req, res) => {
  try {

    const classes = await Class.find().populate("teacher").lean();

    const enhancedClasses = await Promise.all(classes.map(async (cls) => {
      const studentCount = await StudentClass.countDocuments({ class: cls._id });
      const sectionCount = await Exam.countDocuments({ class: cls._id });
      return { ...cls, studentCount, sectionCount };
    }));

    res.status(200).json({
      success: true,
      count: enhancedClasses.length,
      data: enhancedClasses
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET ONE CLASS
const getClassById = async (req, res) => {
  try {

    const classItem = await Class
      .findById(req.params.id)
      .populate("teacher")
      .lean();

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    const studentCount = await StudentClass.countDocuments({ class: classItem._id });
    const sectionCount = await Exam.countDocuments({ class: classItem._id });

    res.status(200).json({
      success: true,
      data: { ...classItem, studentCount, sectionCount }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// UPDATE CLASS
const updateClass = async (req, res) => {
  try {

    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    res.status(200).json({
      success: true,
      data: classItem
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// DELETE CLASS
const deleteClass = async (req, res) => {
  try {

    const classItem = await Class.findByIdAndDelete(req.params.id);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


module.exports = {
  createClass,
  getClasses,
  getClassesByTeacher,
  getClassById,
  updateClass,
  deleteClass
};
