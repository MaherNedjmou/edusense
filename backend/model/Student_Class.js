const mongoose = require("mongoose");

const studentClassSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },

    joinedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("StudentClass", studentClassSchema);