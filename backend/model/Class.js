const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: String,

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Class", classSchema);