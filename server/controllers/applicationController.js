const Application = require("../models/Application");
const Job = require("../models/Job");
const Resume = require("../models/Resume");

// Apply to Job
const applyToJob = async (req, res) => {
    try {

        const { jobId, resumeId, notes } = req.body;

        if (!jobId || !resumeId) {
            return res.status(400).json({
                success: false,
                message: "Job ID and Resume ID are required"
            });
        }

        // Check Job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check Resume
        const resume = await Resume.findOne({
            _id: resumeId,
            user: req.user.id
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        // Prevent duplicate application
        const existingApplication = await Application.findOne({
            user: req.user.id,
            job: jobId
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: "Already applied to this job"
            });
        }

        const application = await Application.create({
            user: req.user.id,
            job: jobId,
            resume: resumeId,
            notes
        });

        return res.status(201).json({
            success: true,
            message: "Applied successfully",
            data: application
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// Get All Applications
const getMyApplications = async (req, res) => {

    try {

        const applications = await Application.find({
            user: req.user.id
        })
        .populate("job")
        .populate("resume")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Get One Application
const getApplicationById = async (req, res) => {

    try {

        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user.id
        })
        .populate("job")
        .populate("resume");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// Update Application
const updateApplication = async (req, res) => {
    try {

        const allowedStatus = [
            "Applied",
            "Interview Scheduled",
            "Interview Completed",
            "Rejected",
            "Offer",
            "Accepted"
        ];

        if (req.body.status && !allowedStatus.includes(req.body.status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Status"
            });
        }

        const application = await Application.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Application updated successfully",
            data: application
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// Delete Application
const deleteApplication = async (req, res) => {

    try {

        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!application) {

            return res.status(404).json({
                success: false,
                message: "Application not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

module.exports = {
    applyToJob,
    getMyApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
};