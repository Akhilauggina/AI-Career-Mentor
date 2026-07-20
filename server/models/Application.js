const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Interview Scheduled",
                "Interview Completed",
                "Rejected",
                "Offer",
                "Accepted"
            ],
            default: "Applied"
        },

        atsScore: {
            type: Number,
            default: 0
        },

        interviewDate: {
            type: Date
        },

        feedback: {
            type: String,
            default: ""
        },

        notes: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Application", ApplicationSchema);