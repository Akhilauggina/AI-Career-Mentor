const OpenAI = require("openai");
const Resume = require("../models/Resume");

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not configured");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const parseJSON = (text, fallback) => {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
};

const aiError = (err) => {
  if (err.message?.includes("OPENAI_API_KEY")) {
    return { status: 503, message: "AI service not configured. Ask your admin to set OPENAI_API_KEY." };
  }
  if (err.status === 429) {
    return { status: 429, message: "AI rate limit reached. Please wait a moment and try again." };
  }
  return { status: 500, message: "AI service temporarily unavailable. Try again in a moment." };
};

// POST /api/ai/chat
const careerMentorChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    const openai = getOpenAI();
    const systemPrompt =
      "You are an expert AI Career Mentor. Help users with job searching, resume building, interview prep, salary negotiation, and career growth. Be concise (under 200 words), actionable, and encouraging.";

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10).map(({ role, content }) => ({ role, content })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 400,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I'm here to help! Could you rephrase that?";
    res.json({ success: true, reply });
  } catch (err) {
    const { status, message } = aiError(err);
    res.status(status).json({ success: false, message });
  }
};

// POST /api/ai/analyze
const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    if (!resumeId) return res.status(400).json({ success: false, message: "Resume ID is required" });

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });
    if (!resume.extractedText) {
      return res.status(400).json({
        success: false,
        message: "This resume has no extracted text. Try re-uploading the PDF.",
      });
    }

    const openai = getOpenAI();
    const prompt = `Analyze the following resume and return a single JSON object with exactly these keys:
- "atsScore": integer 0-100
- "strengths": array of up to 5 short strings
- "improvements": array of up to 5 short strings
- "skills": array of detected skill strings
- "summary": a 1-2 sentence overview string

Resume text (first 3000 chars):
${resume.extractedText.slice(0, 3000)}

Return ONLY valid JSON. No markdown fences, no explanation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.3,
    });

    const analysis = parseJSON(completion.choices[0]?.message?.content || "{}", {
      atsScore: 70,
      strengths: [],
      improvements: ["Could not parse AI response — try again."],
      skills: [],
      summary: "",
    });

    // Persist updated ATS score
    if (typeof analysis.atsScore === "number") {
      await Resume.findByIdAndUpdate(resumeId, { atsScore: analysis.atsScore });
    }

    res.json({ success: true, analysis });
  } catch (err) {
    const { status, message } = aiError(err);
    res.status(status).json({ success: false, message });
  }
};

// POST /api/ai/interview
const getInterviewQuestions = async (req, res) => {
  try {
    const { role, skills, type = "Technical" } = req.body;
    if (!role) return res.status(400).json({ success: false, message: "Role is required" });

    const openai = getOpenAI();
    const prompt = `Generate 8 ${type} interview questions for a ${role} position${skills ? ` requiring: ${skills}` : ""}.
Return a JSON array of objects, each with:
- "question": string
- "tip": string (a concise answering tip, max 20 words)

Return ONLY a valid JSON array. No markdown fences.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const questions = parseJSON(completion.choices[0]?.message?.content || "[]", []);
    res.json({ success: true, questions: Array.isArray(questions) ? questions : [] });
  } catch (err) {
    const { status, message } = aiError(err);
    res.status(status).json({ success: false, message });
  }
};

// POST /api/ai/skill-gap
const skillGapAnalysis = async (req, res) => {
  try {
    const { targetRole, currentSkills } = req.body;
    if (!targetRole) return res.status(400).json({ success: false, message: "Target role is required" });

    const openai = getOpenAI();
    const prompt = `Perform a skill gap analysis for someone targeting the role: "${targetRole}".
Their current skills: ${currentSkills || "not specified"}.

Return a single JSON object with:
- "requiredSkills": array of strings (top 8 skills needed for this role)
- "missingSkills": array of strings (skills they likely lack)
- "strongSkills": array of strings (relevant skills they likely have based on current skills)
- "priorityActions": array of 3-4 strings (concrete next steps to close the gap)
- "marketDemand": string (1 sentence about job market demand)

Return ONLY valid JSON. No markdown fences.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.4,
    });

    const analysis = parseJSON(completion.choices[0]?.message?.content || "{}", {
      requiredSkills: [],
      missingSkills: [],
      strongSkills: [],
      priorityActions: ["Could not parse AI response — try again."],
      marketDemand: "",
    });

    res.json({ success: true, analysis });
  } catch (err) {
    const { status, message } = aiError(err);
    res.status(status).json({ success: false, message });
  }
};

// POST /api/ai/roadmap
const getLearningRoadmap = async (req, res) => {
  try {
    const { targetRole, timeframe = "3 months", currentSkills } = req.body;
    if (!targetRole) return res.status(400).json({ success: false, message: "Target role is required" });

    const openai = getOpenAI();
    const prompt = `Create a learning roadmap for someone targeting: "${targetRole}" within ${timeframe}.
Current skill level: ${currentSkills || "beginner"}.

Return a single JSON object with:
- "overview": string (1-2 sentence summary)
- "phases": array of objects, each with:
  - "title": string (e.g. "Week 1-2: Foundations")
  - "duration": string
  - "goals": array of 3-4 strings
  - "resources": array of 2-3 strings (specific free/paid resources)
- "milestones": array of 3-4 strings (progress checkpoints)
- "tips": array of 2-3 strings (success tips)

Return ONLY valid JSON. No markdown fences.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
      temperature: 0.5,
    });

    const roadmap = parseJSON(completion.choices[0]?.message?.content || "{}", {
      overview: "Could not generate roadmap. Please try again.",
      phases: [],
      milestones: [],
      tips: [],
    });

    res.json({ success: true, roadmap });
  } catch (err) {
    const { status, message } = aiError(err);
    res.status(status).json({ success: false, message });
  }
};

module.exports = {
  careerMentorChat,
  analyzeResume,
  getInterviewQuestions,
  skillGapAnalysis,
  getLearningRoadmap,
};
