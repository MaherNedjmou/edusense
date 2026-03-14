const Teacher = require("../model/Teacher");


// CREATE TEACHER
const createTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.create(req.body);

    res.status(201).json({
      success: true,
      data: teacher
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// GET ALL TEACHERS
const getTeachers = async (req, res) => {
  try {

    const teachers = await Teacher.find().populate("user");

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET ONE TEACHER
const getTeacherById = async (req, res) => {
  try {

    const teacher = await Teacher
      .findById(req.params.id)
      .populate("user");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// UPDATE TEACHER
const updateTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// DELETE TEACHER
const deleteTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET TEACHER DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {
    const Teacher = require("../model/Teacher");
    const Class = require("../model/Class");
    const StudentClass = require("../model/Student_Class");
    const Exam = require("../model/Exam");

    // Find the teacher profile for this user
    let teacher = await Teacher.findOne({ user: req.user._id });
    
    // If no teacher profile but user is teacher, create one
    if (!teacher && req.user.role === "teacher") {
      teacher = await Teacher.create({ user: req.user._id });
    }

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher profile not found" });
    }

    const classes = await Class.find({ teacher: teacher._id });
    const classIds = classes.map(c => c._id);

    const studentsEnrolled = await StudentClass.countDocuments({ class: { $in: classIds } });
    const sectionsCount = await Exam.countDocuments({ class: { $in: classIds } });

    // Mock analysis count for now or fetch from StudentClassAnswer
    const StudentClassAnswer = require("../model/Student_Class_Answer");
    const analysisCount = await StudentClassAnswer.countDocuments({ 
      exam: { $in: await Exam.find({ class: { $in: classIds } }).distinct("_id") } 
    });

    res.status(200).json({
      success: true,
      data: {
        classesCount: classes.length,
        studentsCount: studentsEnrolled,
        sectionsCount: sectionsCount,
        analysisCount: analysisCount
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  getDashboardStats,
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};
