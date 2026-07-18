const express = require("express");
const router = express.Router();

const { uploadResume } = require("../controllers/resumeController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Upload Resume
router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);

module.exports = router;