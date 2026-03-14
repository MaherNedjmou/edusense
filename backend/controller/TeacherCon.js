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



module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
};
