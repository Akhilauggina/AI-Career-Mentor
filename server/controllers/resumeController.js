const Resume = require("../models/Resume");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const extractResumeText =
require("../utils/extractResumeText");

const uploadResume = async (req, res) => {
    try {

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file"
            });
        }

        // Get title from request body
        const { title } = req.body;
        const extractedText = await extractResumeText(req.file.path);
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Resume title is required"
            });
        }

        // Upload PDF to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "raw",
            folder: "AI-Career-Mentor/Resumes"
        });

        // Make previous resumes inactive
        await Resume.updateMany(
            {
                user: req.user.id,
                isActive: true
            },
            {
                isActive: false
            }
        );

        // Save resume details in MongoDB
        const resume = await Resume.create({
            user: req.user.id,
            title: title.trim(),
            pdfUrl: result.secure_url,
            cloudinaryId: result.public_id,
            extractedText,
            atsScore: 0,
            isActive: true
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        // Success response
        return res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            data: resume
        });

    } catch (error) {

        console.error("Resume Upload Error:", error);

        // Delete temporary file if it still exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, resumes });
    } catch (error) {
        console.error("Get Resumes Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }
        // Remove from Cloudinary
        await cloudinary.uploader.destroy(resume.cloudinaryId, { resource_type: "raw" });
        await Resume.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: "Resume deleted successfully" });
    } catch (error) {
        console.error("Delete Resume Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    uploadResume,
    getResumes,
    deleteResume,
};