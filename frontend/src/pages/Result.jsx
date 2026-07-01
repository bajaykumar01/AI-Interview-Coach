import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Cpu, Award, CheckCircle, AlertCircle, Sparkles, BookOpen, Compass, ChevronRight } from "lucide-react";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stateData || !stateData.session_id) {
      setError("No interview session found.");
      setLoading(false);
      return;
    }

    async function fetchReport() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/interview/report/${stateData.session_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReport(response.data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(err.response?.data?.detail || "Failed to load AI evaluation report.");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [stateData, navigate]);

  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-transparent"></div>
        <h2 className="mt-6 text-xl font-bold text-white tracking-tight animate-pulse">Generating your AI performance report...</h2>
        <p className="mt-2 text-slate-400 text-sm max-w-sm text-center leading-relaxed">
          Gemini is analyzing your technical responses, communication delivery, and compiling targeted study guides.
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Report Not Found</h2>
          <p className="text-sm leading-relaxed mb-6">{error || "We could not find the detailed evaluation for this session."}</p>
          <button 
            onClick={() => navigate("/dashboard")} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate circular gauge angle
  const fillPercentage = report.overall_score * 10;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans pb-16 relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Glow Bubbles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center text-white">
              <Cpu size={16} />
            </div>
            <span>Aura<span className="text-indigo-400">Interview</span></span>
          </div>
          <button 
            onClick={() => navigate("/dashboard")}
            className="glass-card px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all text-slate-350"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        {/* Header Title */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI Weakness Analysis Dashboard <Sparkles size={24} className="text-indigo-400" />
          </h1>
          <p className="text-slate-400 mt-1">Multi-dimensional evaluation compiled by Gemini AI.</p>
        </div>

        {/* Top Section - Score & Core Competencies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Radial score gauge */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-4">Overall Score</span>
            <div 
              className="relative w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#6366f1 ${fillPercentage}%, #1e293b 0)`
              }}
            >
              <div className="w-30 h-30 rounded-full bg-slate-950 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-indigo-400 leading-none">{report.overall_score.toFixed(1)}</span>
                <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider mt-1.5">out of 10</span>
              </div>
            </div>
          </div>

          {/* Competency Ratings */}
          <div className="glass-panel p-6 rounded-2xl md:col-span-2 text-left flex flex-col justify-between">
            <h3 className="text-lg font-bold text-white mb-4">Competency Evaluation</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-slate-400">Technical Accuracy</span>
                  <span className="text-emerald-400">{report.technical_accuracy}</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: report.technical_accuracy.includes("%") ? report.technical_accuracy : "80%" }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center py-2.5 border-t border-slate-900">
                <span className="text-sm font-semibold text-slate-400">💬 Communication Rating:</span>
                <span className="text-sm font-bold text-white">{report.communication_rating}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-t border-slate-900">
                <span className="text-sm font-semibold text-slate-400">💪 Confidence Level:</span>
                <span className="text-sm font-bold text-white">{report.confidence_rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Strengths Card */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl text-left">
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle size={18} /> Technical Strengths
            </h3>
            <ul className="space-y-3">
              {report.strengths.map((str, idx) => (
                <li key={idx} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-500 mt-1 select-none">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses Card */}
          <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-2xl text-left">
            <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
              <AlertCircle size={18} /> Weak Topics
            </h3>
            <ul className="space-y-3">
              {report.weak_topics.map((weak, idx) => (
                <li key={idx} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-500 mt-1 select-none">⚠</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations and Suggestions */}
        <div className="glass-panel p-8 rounded-2xl text-left space-y-8 mb-10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-indigo-400" /> Recommended Study Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.recommended_topics.map((topic, idx) => (
                <span 
                  key={idx} 
                  className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Compass size={20} className="text-purple-400" /> Actionable Improvement Steps
            </h3>
            <ul className="space-y-3">
              {report.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                  <ChevronRight size={16} className="text-purple-400 mt-1 shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/10 transition-all text-center cursor-pointer hover:scale-[1.01]"
          >
            Take Another Mock Interview
          </button>
          <button
            onClick={() => navigate("/history")}
            className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold py-4 rounded-xl transition-all text-center cursor-pointer hover:bg-slate-800/80"
          >
            View Interview History
          </button>
        </div>
      </main>
    </div>
  );
}

export default Result;