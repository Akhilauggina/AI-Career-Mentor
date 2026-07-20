const express = require("express");

const router = express.Router();

const {

    uploadResume,

    getResumes,

    deleteResume

} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    uploadResume
);

router.get(
    "/",
    authMiddleware,
    getResumes
);

router.delete(
    "/:id",
    authMiddleware,
    deleteResume
);

module.exports = router;