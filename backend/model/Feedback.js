const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({

    studentClassAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentClassAnswer",
        required: true
    },

    comment: String,

    rating: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Feedback", feedbackSchema);