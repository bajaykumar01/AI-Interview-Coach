import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Cpu, 
  LogOut, 
  History, 
  Upload, 
  FileText, 
  Settings, 
  Award, 
  CheckCircle,
  HelpCircle,
  Play,
  Briefcase
} from "lucide-react";

const COLORS = ["#6366f1", "#a855f7"];

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("Java");
  const [difficulty, setDifficulty] = useState("Easy");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  async function fetchDashboardData() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      // Fetch user profile info
      const userResponse = await api.get("/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserFullName(userResponse.data.full_name);

      // Fetch interview statistics
      const statsResponse = await api.get("/interview/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      localStorage.removeItem("token");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  async function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setUploadError("Only PDF resumes are supported.");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await api.post("/interview/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      alert("Resume uploaded and parsed successfully!");
      fetchDashboardData(); // Reload stats to capture new resume skills
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.detail || "Failed to parse resume.");
    } finally {
      setIsUploading(false);
    }
  }

  async function startResumeInterview() {
    if (!stats?.resume_uploaded) {
      alert("Please upload your resume first to launch a resume-based interview.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/interview/start",
        {
          role: stats.resume_role || "Developer",
          difficulty: "Hard",
          is_resume_based: true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("interview", JSON.stringify(response.data));
      navigate("/interview");
    } catch (err) {
      console.error(err);
      alert("Unable to start personalized interview.");
    }
  }

  async function startConfiguredInterview() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/interview/start",
        {
          role,
          difficulty,
          is_resume_based: false
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("interview", JSON.stringify(response.data));
      navigate("/interview");
    } catch (err) {
      console.error(err);
      alert("Unable to start configured interview.");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("interview");
    navigate("/");
  };

  if (loading || !stats) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 border-r-2 border-transparent"></div>
        <p className="mt-4 text-slate-400 font-medium">Loading Aura dashboard...</p>
      </div>
    );
  }

  // Parse skills list if present
  let skillsList = [];
  if (stats.resume_skills) {
    try {
      skillsList = JSON.parse(stats.resume_skills);
    } catch (e) {
      skillsList = [stats.resume_skills];
    }
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans pb-16 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Glow Bubbles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center text-white">
              <Cpu size={16} />
            </div>
            <span>Aura<span className="text-indigo-400">Interview</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/history")}
              className="glass-card flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all text-slate-300"
            >
              <History size={16} /> History
            </button>
            <button 
              onClick={handleLogout}
              className="glass-card flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/10 hover:border-red-500/30 transition-all text-red-400 border border-slate-800"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        {/* Welcome */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, <strong className="text-white">{userFullName}</strong>!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">Total Interviews</span>
              <span className="text-3xl font-black text-white">{stats.total_interviews}</span>
            </div>
            <div className="bg-indigo-500/10 text-indigo-400 p-3.5 rounded-xl"><Play size={24} /></div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">Average Score</span>
              <span className="text-3xl font-black text-white">{stats.average_score.toFixed(1)} <span className="text-lg font-bold text-slate-550">/ 10</span></span>
            </div>
            <div className="bg-purple-500/10 text-purple-400 p-3.5 rounded-xl"><Settings size={24} /></div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">Best Score</span>
              <span className="text-3xl font-black text-white">{stats.best_score.toFixed(1)} <span className="text-lg font-bold text-slate-550">/ 10</span></span>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 p-3.5 rounded-xl"><Award size={24} /></div>
          </div>
        </div>

        {/* Charts & Analytics */}
        {stats.total_interviews > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Score History Chart */}
            <div className="glass-panel p-6 rounded-2xl lg:col-span-2 text-left">
              <h3 className="text-lg font-bold text-white mb-4">Performance Timeline</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.score_history}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <ChartTooltip 
                      contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                      labelStyle={{ color: "#94a3b8" }}
                    />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mode Distribution Chart */}
            <div className="glass-panel p-6 rounded-2xl text-left">
              <h3 className="text-lg font-bold text-white mb-4">Interview Modes</h3>
              <div className="h-64 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={stats.mode_distribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.mode_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="flex gap-4 mt-2 justify-center text-xs">
                  {stats.mode_distribution.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: COLORS[index] }} />
                      <span className="text-slate-400">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Separate Interview Modes Section */}
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Choose Interview Mode</h2>
          <p className="text-slate-400 mt-1">Select between automated resume personalization or manually configured topics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* OPTION 1: Resume Based Interview */}
          <div className="glass-panel p-8 rounded-2xl text-left flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl"><FileText size={20} /></div>
                <h3 className="text-xl font-bold text-white">Resume-Based Interview</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Gemini automatically parses your resume to construct 5 challenging questions targeting your specific projects, experience, skills, and certifications.
              </p>
              
              <div className="border border-slate-900 bg-slate-900/10 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Resume Profile</span>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleResumeUpload} 
                    id="resume-file-input" 
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label htmlFor="resume-file-input" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors">
                    <Upload size={12} /> {isUploading ? "Uploading..." : "Upload New PDF"}
                  </label>
                </div>

                {stats.resume_uploaded ? (
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-sm mb-2">
                      <CheckCircle size={16} /> <span>Active: {stats.resume_filename}</span>
                    </div>
                    {stats.resume_role && (
                      <div className="text-xs text-slate-300 font-semibold mb-2 flex items-center gap-1">
                        <Briefcase size={12} /> Suggested Target Role: {stats.resume_role}
                      </div>
                    )}
                    {skillsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {skillsList.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="bg-slate-900 text-slate-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-800">
                            {skill}
                          </span>
                        ))}
                        {skillsList.length > 5 && <span className="text-slate-500 text-[10px] font-semibold">+{skillsList.length - 5} more</span>}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">
                    No active resume. Please upload a PDF resume to enable this mode.
                  </div>
                )}
                {uploadError && <p className="text-red-400 text-xs mt-2 text-center">{uploadError}</p>}
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Questions count:</span>
                  <span className="font-bold text-white">5 questions</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Target difficulty:</span>
                  <span className="font-bold text-indigo-400 uppercase tracking-widest">HIGH</span>
                </div>
              </div>
            </div>

            <button
              onClick={startResumeInterview}
              disabled={!stats.resume_uploaded || isUploading}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                stats.resume_uploaded && !isUploading
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 cursor-pointer"
                  : "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Play size={16} /> Start Resume Interview
            </button>
          </div>

          {/* OPTION 2: Configure Interview */}
          <div className="glass-panel p-8 rounded-2xl text-left flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-500/10 text-purple-400 p-2.5 rounded-xl"><Settings size={20} /></div>
                <h3 className="text-xl font-bold text-white">Configure Interview</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Configure your mock interview manually. Choose your target role and difficulty. This mode ignores resume details.
              </p>

              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 px-4 py-3 focus:outline-none focus:border-purple-500/50 rounded-xl text-sm"
                  >
                    <option>Java</option>
                    <option>Python</option>
                    <option>React</option>
                    <option>Machine Learning</option>
                    <option>OOPS</option>
                    <option>SQL</option>
                    <option>Computer Networks</option>
                    <option>Operating System</option>
                    <option>DBMS</option>
                    <option>HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 px-4 py-3 focus:outline-none focus:border-purple-500/50 rounded-xl text-sm"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={startConfiguredInterview}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <Play size={16} /> Start Configured Session
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;