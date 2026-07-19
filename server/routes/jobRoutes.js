const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobController");

// Create Job
router.post("/", authMiddleware, createJob);

// Get All Jobs
router.get("/", authMiddleware, getAllJobs);

// Get Single Job
router.get("/:id", authMiddleware, getJobById);

// Update Job
router.put("/:id", authMiddleware, updateJob);

// Delete Job
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;