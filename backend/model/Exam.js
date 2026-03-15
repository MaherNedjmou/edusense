const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },


    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },

    totalMarks: Number,

    // List of exam pages (images)
    examImages: [
        {
            url: String,
            public_id: String
        }
    ],

    // List of solution pages (images)
    solutionImages: [
        {
            url: String,
            public_id: String
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Exam", examSchema);    