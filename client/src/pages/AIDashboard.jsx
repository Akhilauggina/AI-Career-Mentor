import { useState, useEffect, useRef } from "react";
import {
  analyzeResume,
  getInterviewQuestions,
  careerMentor,
  skillGapAnalysis,
  getLearningRoadmap,
} from "../services/aiService";
import { getResumes } from "../services/resumeService";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../components/Loading";
import {
  Bot, Send, User, FileText, Loader2, Lightbulb, ChevronDown,
  MessageSquare, Target, TrendingUp, BookOpen, Map, CheckCircle2,
  AlertCircle, Zap, ArrowRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Career Mentor Chat Tab
// ---------------------------------------------------------------------------
const ChatMessage = ({ role, content }) => (
  <div className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
      role === "user" ? "bg-indigo-600" : "bg-slate-200"
    }`}>
      {role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-slate-600" />}
    </div>
    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
      role === "user"
        ? "bg-indigo-600 text-white rounded-tr-sm"
        : "bg-slate-100 text-slate-800 rounded-tl-sm"
    }`}>
      {content}
    </div>
  </div>
);

const ChatTab = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI Career Mentor. Ask me anything about your career, resume, interview prep, or job search strategy. 🚀" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const updatedMessages = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);
    setLoading(true);
    try {
      // Pass conversation history for context
      const history = updatedMessages.slice(-10).map(({ role, content }) => ({ role, content }));
      const res = await careerMentor({ message: text, history: history.slice(0, -1) });
      const reply = res?.reply || res?.message || res?.response || "I'm here to help! Could you rephrase that?";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const errMsg = err.userMessage || "AI service is currently unavailable. Try again in a moment.";
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${errMsg}` }]);
      addToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "How can I improve my resume?",
    "Tips for salary negotiation",
    "How to prepare for behavioral interviews",
    "What skills are in demand for software engineers?",
  ];

  return (
    <div className="flex flex-col h-[580px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => <ChatMessage key={i} role={m.role} content={m.content} />)}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Bot size={16} className="text-slate-600" />
            </div>
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => setInput(s)}
              className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors font-medium">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask your career mentor..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Resume Analysis Tab
// ---------------------------------------------------------------------------
const AnalysisTab = () => {
  const { addToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getResumes();
        setResumes(res.resumes || res || []);
      } catch { } finally {
        setFetching(false);
      }
    })();
  }, []);

  const analyze = async () => {
    if (!selectedResume) { addToast("Select a resume first", "error"); return; }
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await analyzeResume(selectedResume);
      setAnalysis(res?.analysis || res);
    } catch (err) {
      addToast(err.userMessage || "Analysis failed. Check your AI service connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  const atsScore = analysis?.atsScore ?? analysis?.score ?? null;
  const scoreColor = atsScore >= 80 ? "text-emerald-600" : atsScore >= 60 ? "text-amber-600" : "text-red-600";
  const scoreBg = atsScore >= 80 ? "bg-emerald-50" : atsScore >= 60 ? "bg-amber-50" : "bg-red-50";

  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Resume to Analyze</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
              <option value="">Choose a resume…</option>
              {resumes.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button onClick={analyze} disabled={loading || !selectedResume}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center gap-2">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <TrendingUp size={15} />}
            Analyze
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-10">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p className="text-slate-500 text-sm">Analyzing your resume with AI…</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          {atsScore !== null && (
            <div className={`${scoreBg} rounded-2xl p-5 flex items-center justify-between`}>
              <div>
                <p className="text-sm font-semibold text-slate-600">ATS Score</p>
                <p className={`text-5xl font-bold ${scoreColor} mt-1`}>{atsScore}<span className="text-2xl">/100</span></p>
              </div>
              <div className="w-20 h-20 rounded-full border-4 border-current flex items-center justify-center"
                style={{ color: atsScore >= 80 ? "#059669" : atsScore >= 60 ? "#d97706" : "#dc2626" }}>
                <TrendingUp size={28} />
              </div>
            </div>
          )}
          {analysis.strengths?.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-5">
              <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2"><Target size={16} /> Strengths</h4>
              <ul className="space-y-1">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {analysis.improvements?.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-5">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2"><Lightbulb size={16} /> Areas to Improve</h4>
              <ul className="space-y-1">
                {analysis.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {analysis.skills?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h4 className="font-semibold text-slate-800 mb-3">Detected Skills</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-lg font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.summary && (
            <div className="bg-slate-50 rounded-2xl p-5">
              <h4 className="font-semibold text-slate-800 mb-2">Summary</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.summary}</p>
            </div>
          )}
        </div>
      )}

      {!loading && !analysis && (
        <div className="text-center py-12 text-slate-400">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Select a resume and click Analyze to get AI-powered insights</p>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Interview Prep Tab
// ---------------------------------------------------------------------------
const InterviewTab = () => {
  const { addToast } = useToast();
  const [form, setForm] = useState({ role: "", skills: "", type: "Technical" });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!form.role) { addToast("Enter a job role", "error"); return; }
    setLoading(true);
    setQuestions([]);
    try {
      const res = await getInterviewQuestions({ role: form.role, skills: form.skills, type: form.type });
      const qs = res?.questions || res || [];
      setQuestions(Array.isArray(qs) ? qs : []);
    } catch (err) {
      addToast(err.userMessage || "Failed to generate questions. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Job Role</label>
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Software Engineer"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Skills (optional)</label>
          <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="React, Node.js"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Interview Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
            {["Technical", "Behavioral", "HR", "System Design", "Mixed"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-md shadow-indigo-500/30">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
        Generate Questions
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p className="text-slate-500 text-sm">Generating personalized interview questions…</p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">{questions.length} Questions Generated</h4>
          {questions.map((q, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{typeof q === "string" ? q : q.question}</p>
              </div>
              {q.tip && (
                <div className="mt-2 ml-10 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-1.5">
                  <Lightbulb size={12} /> {q.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !questions.length && (
        <div className="text-center py-10 text-slate-400">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Enter a role and generate your personalized interview questions</p>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Skill Gap Analysis Tab
// ---------------------------------------------------------------------------
const SkillGapTab = () => {
  const { addToast } = useToast();
  const [targetRole, setTargetRole] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!targetRole.trim()) { addToast("Enter a target role", "error"); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await skillGapAnalysis({ targetRole, currentSkills });
      setResult(res?.analysis || res);
    } catch (err) {
      addToast(err.userMessage || "Skill gap analysis failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Target Role *</label>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Full Stack Developer"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Your Current Skills</label>
          <input
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
            placeholder="e.g. HTML, CSS, basic JavaScript"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      <button onClick={handleAnalyze} disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-md shadow-indigo-500/30">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Target size={16} />}
        Analyze Skill Gap
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p className="text-slate-500 text-sm">Analyzing skill gaps with AI…</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Missing Skills */}
          {result.missingSkills?.length > 0 && (
            <div className="bg-red-50 rounded-2xl p-5">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle size={16} /> Skills to Acquire
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Strong Skills */}
          {result.strongSkills?.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-5">
              <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} /> Your Relevant Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.strongSkills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-lg font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {result.requiredSkills?.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-5">
              <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Zap size={16} /> All Required Skills for {targetRole}
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.requiredSkills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-sm rounded-lg">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Priority Actions */}
          {result.priorityActions?.length > 0 && (
            <div className="bg-indigo-50 rounded-2xl p-5">
              <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                <ArrowRight size={16} /> Priority Actions
              </h4>
              <ol className="space-y-2">
                {result.priorityActions.map((a, i) => (
                  <li key={i} className="text-sm text-indigo-700 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Market Demand */}
          {result.marketDemand && (
            <div className="bg-amber-50 rounded-2xl p-4">
              <p className="text-sm text-amber-700 flex items-start gap-2">
                <TrendingUp size={15} className="shrink-0 mt-0.5" />
                {result.marketDemand}
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && !result && (
        <div className="text-center py-10 text-slate-400">
          <Target size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Enter your target role and current skills to see the gap</p>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Learning Roadmap Tab
// ---------------------------------------------------------------------------
const RoadmapTab = () => {
  const { addToast } = useToast();
  const [form, setForm] = useState({ targetRole: "", timeframe: "3 months", currentSkills: "" });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openPhase, setOpenPhase] = useState(0);

  const handleGenerate = async () => {
    if (!form.targetRole.trim()) { addToast("Enter a target role", "error"); return; }
    setLoading(true);
    setRoadmap(null);
    setOpenPhase(0);
    try {
      const res = await getLearningRoadmap(form);
      setRoadmap(res?.roadmap || res);
    } catch (err) {
      addToast(err.userMessage || "Failed to generate roadmap. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Target Role *</label>
          <input
            value={form.targetRole}
            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
            placeholder="e.g. Backend Developer"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Timeframe</label>
          <select value={form.timeframe} onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
            {["1 month", "3 months", "6 months", "1 year"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Current Skills</label>
          <input
            value={form.currentSkills}
            onChange={(e) => setForm({ ...form, currentSkills: e.target.value })}
            placeholder="e.g. Python basics"
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 shadow-md shadow-indigo-500/30">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Map size={16} />}
        Generate Roadmap
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p className="text-slate-500 text-sm">Building your personalized learning roadmap…</p>
        </div>
      )}

      {roadmap && (
        <div className="space-y-4">
          {/* Overview */}
          {roadmap.overview && (
            <div className="bg-indigo-50 rounded-2xl p-5">
              <h4 className="font-semibold text-indigo-800 mb-1 flex items-center gap-2"><BookOpen size={16} /> Overview</h4>
              <p className="text-sm text-indigo-700 leading-relaxed">{roadmap.overview}</p>
            </div>
          )}

          {/* Phases — accordion */}
          {roadmap.phases?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Learning Phases</h4>
              {roadmap.phases.map((phase, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenPhase(openPhase === i ? -1 : i)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{phase.title}</p>
                        {phase.duration && <p className="text-xs text-slate-400">{phase.duration}</p>}
                      </div>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${openPhase === i ? "rotate-180" : ""}`} />
                  </button>
                  {openPhase === i && (
                    <div className="px-5 pb-4 space-y-3 border-t border-slate-50">
                      {phase.goals?.length > 0 && (
                        <div className="pt-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Goals</p>
                          <ul className="space-y-1">
                            {phase.goals.map((g, j) => (
                              <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {phase.resources?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Resources</p>
                          <ul className="space-y-1">
                            {phase.resources.map((r, j) => (
                              <li key={j} className="text-sm text-indigo-600 flex items-start gap-2">
                                <BookOpen size={13} className="shrink-0 mt-0.5" /> {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Milestones */}
          {roadmap.milestones?.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-5">
              <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} /> Progress Milestones
              </h4>
              <ol className="space-y-2">
                {roadmap.milestones.map((m, i) => (
                  <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {m}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips */}
          {roadmap.tips?.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-5">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2"><Lightbulb size={16} /> Success Tips</h4>
              <ul className="space-y-2">
                {roadmap.tips.map((t, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✦</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!loading && !roadmap && (
        <div className="text-center py-10 text-slate-400">
          <Map size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Enter your target role to generate a step-by-step learning roadmap</p>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main AI Dashboard
// ---------------------------------------------------------------------------
const TABS = [
  { id: "chat", label: "Career Mentor", icon: Bot },
  { id: "analysis", label: "Resume Analysis", icon: FileText },
  { id: "interview", label: "Interview Prep", icon: MessageSquare },
  { id: "skillgap", label: "Skill Gap", icon: Target },
  { id: "roadmap", label: "Roadmap", icon: Map },
];

const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Bot size={24} className="text-indigo-600" /> AI Mentor
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">Your personal AI-powered career assistant</p>
      </div>

      {/* Tab Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs — scrollable on small screens */}
        <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                  active
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "chat" && <ChatTab />}
        {activeTab === "analysis" && <AnalysisTab />}
        {activeTab === "interview" && <InterviewTab />}
        {activeTab === "skillgap" && <SkillGapTab />}
        {activeTab === "roadmap" && <RoadmapTab />}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { icon: <Bot size={18} className="text-indigo-600" />, bg: "bg-indigo-50", title: "Career Chat", desc: "Personalized career advice" },
          { icon: <FileText size={18} className="text-purple-600" />, bg: "bg-purple-50", title: "Resume Analysis", desc: "ATS score & improvements" },
          { icon: <MessageSquare size={18} className="text-emerald-600" />, bg: "bg-emerald-50", title: "Interview Prep", desc: "AI-generated questions" },
          { icon: <Target size={18} className="text-red-500" />, bg: "bg-red-50", title: "Skill Gap", desc: "Know what to learn next" },
          { icon: <Map size={18} className="text-amber-600" />, bg: "bg-amber-50", title: "Roadmap", desc: "Step-by-step learning plan" },
        ].map((card) => (
          <div key={card.title} className={`${card.bg} rounded-2xl p-3`}>
            <div className="mb-1.5">{card.icon}</div>
            <h4 className="font-semibold text-slate-800 text-xs mb-0.5">{card.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIDashboard;
