const express = require("express");
const router = express.Router();

const userController = require("../controller/UserCon");

// CREATE
router.post("/", userController.createUser);

// GET ALL
router.get("/", userController.getUsers);

// GET ONE BY ID
router.get("/:id", userController.getUserById);

// UPDATE
router.put("/:id", userController.updateUser);

// DELETE
router.delete("/:id", userController.deleteUser);

module.exports = router;
