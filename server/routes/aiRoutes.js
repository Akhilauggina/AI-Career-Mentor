const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  careerMentorChat,
  analyzeResume,
  getInterviewQuestions,
  skillGapAnalysis,
  getLearningRoadmap,
} = require("../controllers/aiController");

router.post("/chat", authMiddleware, careerMentorChat);
router.post("/analyze", authMiddleware, analyzeResume);
router.post("/interview", authMiddleware, getInterviewQuestions);
router.post("/skill-gap", authMiddleware, skillGapAnalysis);
router.post("/roadmap", authMiddleware, getLearningRoadmap);

module.exports = router;
