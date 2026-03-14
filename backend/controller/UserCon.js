const User = require("../model/User");


// CREATE USER
const createUser = async (req, res) => {
  try {

    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


// GET USERS
const getUsers = async (req, res) => {
  try {

    const users = await User.find();

    res.json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// GET ONE USER BY ID
const getUserById = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


// UPDATE USER
const updateUser = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};


// DELETE USER
const deleteUser = async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
