const mongoose = require("mongoose");

const studentClassAnswerSchema = new mongoose.Schema({

    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },

    studentClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentClass",
        required: true
    },

    answers: [
        {
            answer: String
        }
    ],

    score: Number,

    submittedAt: Date

});


module.exports = mongoose.model(
    "StudentClassAnswer",
    studentClassAnswerSchema
);