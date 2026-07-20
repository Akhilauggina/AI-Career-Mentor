const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    applyToJob,
    getMyApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
} = require("../controllers/applicationController");

router.post("/", authMiddleware, applyToJob);

router.get("/", authMiddleware, getMyApplications);

router.get("/:id", authMiddleware, getApplicationById);

router.put("/:id", authMiddleware, updateApplication);

router.delete("/:id", authMiddleware, deleteApplication);

module.exports = router;