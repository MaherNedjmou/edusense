const mongoose = require("mongoose");

const subscribePlanSchema = new mongoose.Schema({

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    planName: String,

    price: Number,

    startDate: Date,

    endDate: Date,

    status: {
        type: String,
        enum: ["active", "expired", "cancelled"]
    }

});


module.exports = mongoose.model(
    "SubscribePlan",
    subscribePlanSchema
);