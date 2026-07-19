const Job = require("../models/Job");

const createJob = async (req, res) => {
    try {
        const {
            company,
            title,
            description,
            requirements,
            skills,
            location,
            salary,
            jobType,
            experienceLevel,
            applicationUrl,
            deadline,
            notes
        } = req.body;

        if (!company || !title || !description) {
            return res.status(400).json({
                success: false,
                message: "Company, Title and Description are required"
            });
        }

        const existingJob = await Job.findOne({
            user: req.user.id,
            company: company.trim(),
            title: title.trim()
        });

        if (existingJob) {
            return res.status(409).json({
                success: false,
                message: "Job already exists"
            });
        }

        const job = await Job.create({
            user: req.user.id,
            company: company.trim(),
            title: title.trim(),
            description,
            requirements,
            skills,
            location,
            salary,
            jobType,
            experienceLevel,
            applicationUrl,
            deadline,
            notes
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job
        });
    } catch (error) {
        console.error("Create Job Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const updateJob = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};
