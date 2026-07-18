const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    pdfUrl: {
        type: String,
        required: true
    },

    cloudinaryId: {
        type: String,
        required: true
    },

    extractedText: {
        type: String,
        default: ""
    },

    atsScore: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Resume", ResumeSchema);