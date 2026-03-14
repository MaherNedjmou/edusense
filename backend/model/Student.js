const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    age: Number,
    level: String

});

module.exports = mongoose.model("Student", studentSchema);