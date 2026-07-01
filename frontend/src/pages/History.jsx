import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Cpu, ArrowLeft, History as HistoryIcon, Calendar, Briefcase, BarChart } from "lucide-react";

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [navigate]);

  async function fetchHistory() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await api.get("/interview/history", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHistory(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load interview history.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-transparent"></div>
        <p className="mt-4 text-slate-400 font-medium">Loading history logs...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans pb-16 relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Decorative Glow Bubbles */}
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
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        {/* Title */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HistoryIcon size={28} className="text-indigo-400" /> Interview History
          </h1>
          <p className="text-slate-400 mt-1">Review all your previous AI sessions, scores, and evaluation reports.</p>
        </div>

        {/* History Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-850 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Difficulty</th>
                  <th className="py-4 px-6">Overall Score</th>
                  <th className="py-4 px-6">Date Taken</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-sm">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-slate-500 italic">
                      No interviews taken yet. Complete your first session to view reports here!
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.session_id} className="hover:bg-slate-900/20 transition-colors">
                      {/* Role column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg"><Briefcase size={16} /></div>
                          <span className="font-bold text-white">{item.role}</span>
                        </div>
                      </td>
                      {/* Difficulty column */}
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.difficulty === "Easy" 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : item.difficulty === "Medium"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-red-500/10 text-red-400"
                        }`}>
                          {item.difficulty}
                        </span>
                      </td>
                      {/* Score column */}
                      <td className="py-4 px-6">
                        {item.overall_score !== null && item.overall_score !== undefined ? (
                          <span className="flex items-center gap-1.5 font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded-lg w-fit">
                            <BarChart size={14} />
                            {item.overall_score.toFixed(1)} / 10
                          </span>
                        ) : (
                          <span className="text-slate-500 italic text-xs">In Progress</span>
                        )}
                      </td>
                      {/* Date column */}
                      <td className="py-4 px-6 text-slate-400">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar size={14} className="text-slate-500" />
                          <span>{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                      </td>
                      {/* Actions column */}
                      <td className="py-4 px-6 text-right">
                        {item.overall_score !== null && item.overall_score !== undefined ? (
                          <button
                            onClick={() => navigate("/result", { state: { session_id: item.session_id } })}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer inline-flex items-center gap-1 hover:scale-105"
                          >
                            View AI Report 📊
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              localStorage.setItem("interview", JSON.stringify({
                                session_id: item.session_id,
                                role: item.role,
                                difficulty: item.difficulty,
                                question: "Resume session questions..."
                              }));
                              navigate("/interview");
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-1 hover:scale-105"
                          >
                            Resume ➜
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default History;
