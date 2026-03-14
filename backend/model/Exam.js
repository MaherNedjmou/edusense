const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },

    totalMarks: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Exam", examSchema);    