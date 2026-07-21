---
name: AI routes
description: All five AI endpoints live in server/; require two secrets to work
---

Routes: POST /api/ai/chat, /api/ai/analyze, /api/ai/interview, /api/ai/skill-gap, /api/ai/roadmap
Controller: server/controllers/aiController.js
Route file: server/routes/aiRoutes.js — all protected by authMiddleware

Required secrets:
- OPENAI_API_KEY — without it, endpoints return 503 "AI service not configured"
- MONGO_URI — without it, /api/ai/analyze fails (can't find resume doc)

Client services: client/src/services/aiService.js exports analyzeResume, getInterviewQuestions, careerMentor, skillGapAnalysis, getLearningRoadmap

AIDashboard now has 5 tabs: Career Mentor, Resume Analysis, Interview Prep, Skill Gap, Roadmap.
