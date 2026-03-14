const Student = require("../model/Student");


// CREATE STUDENT
const createStudent = async (req, res) => {
  try {

    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      data: student
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// GET ALL STUDENTS
const getStudents = async (req, res) => {
  try {

    const students = await Student.find().populate("user");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET ONE STUDENT
const getStudentById = async (req, res) => {
  try {

    const student = await Student
      .findById(req.params.id)
      .populate("user");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};



// DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
