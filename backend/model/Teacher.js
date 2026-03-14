const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    bio: String,
    specialization: String,
    yearsExperience: Number



});

module.exports = mongoose.model("Teacher", teacherSchema);