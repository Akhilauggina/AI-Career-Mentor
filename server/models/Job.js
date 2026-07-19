const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    location: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"],
      default: "Full-Time",
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid", "Senior"],
      default: "Fresher",
    },

    applicationUrl: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Saved", "Applied", "Interview", "Rejected", "Offer"],
      default: "Saved",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);