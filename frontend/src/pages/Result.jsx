import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

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
            <div style={{ textAlign: "center", marginTop: "100px", padding: "20px" }}>
                <div className="spinner" style={{ border: "4px solid rgba(0,0,0,0.1)", borderLeftColor: "#4f46e5", borderRadius: "50%", width: "50px", height: "50px", animation: "spin 1s linear infinite", margin: "auto" }}></div>
                <h2 style={{ marginTop: "20px" }}>Analyzing your performance...</h2>
                <p style={{ color: "#666" }}>Gemini is compiling your technical weaknesses, communication scores, and suggested improvements.</p>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
                <h2>Report Not Found</h2>
                <p style={{ color: "#ef4444" }}>{error || "We could not find the detailed evaluation for this session."}</p>
                <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", cursor: "pointer", background: "#4f46e5", color: "white", border: "none", borderRadius: "6px", marginTop: "15px" }}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eaeaea", paddingBottom: "15px", marginBottom: "25px" }}>
                <h1 style={{ margin: 0, fontSize: "28px" }}>AI Weakness Analysis Dashboard 📊</h1>
                <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", cursor: "pointer", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px" }}>
                    Dashboard
                </button>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
                {/* Score Panel */}
                <div style={{ flex: "1 1 250px", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", textAlign: "center" }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#666", fontSize: "16px" }}>Overall Score</h3>
                    <div style={{ display: "inline-flex", position: "relative", width: "120px", height: "120px", borderRadius: "50%", background: "conic-gradient(#4f46e5 " + (report.overall_score * 10) + "%, #e5e7eb 0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "10px auto" }}>
                        <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                            <span style={{ fontSize: "28px", fontWeight: "bold", color: "#4f46e5" }}>{report.overall_score.toFixed(1)}</span>
                            <span style={{ fontSize: "12px", color: "#999" }}>out of 10</span>
                        </div>
                    </div>
                </div>

                {/* Ratings Panel */}
                <div style={{ flex: "2 1 450px", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: "18px" }}>Core Competency Evaluation</h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                                <span>Technical Accuracy</span>
                                <span>{report.technical_accuracy}</span>
                            </div>
                            <div style={{ background: "#e5e7eb", height: "8px", borderRadius: "4px" }}>
                                <div style={{ background: "#10b981", height: "100%", borderRadius: "4px", width: report.technical_accuracy.includes("%") ? report.technical_accuracy : "80%" }}></div>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f3f4f6", paddingTop: "8px" }}>
                            <span style={{ fontSize: "14px", color: "#666" }}>💬 Communication Rating:</span>
                            <strong style={{ fontSize: "14px", color: "#374151" }}>{report.communication_rating}</strong>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f3f4f6", paddingTop: "8px" }}>
                            <span style={{ fontSize: "14px", color: "#666" }}>💪 Confidence Level:</span>
                            <strong style={{ fontSize: "14px", color: "#374151" }}>{report.confidence_rating}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
                {/* Strengths Card */}
                <div style={{ flex: "1 1 400px", background: "#f0fdf4", padding: "20px", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                    <h3 style={{ color: "#166534", margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>✓</span> Technical Strengths
                    </h3>
                    <ul style={{ paddingLeft: "20px", margin: 0, color: "#1e3a1e" }}>
                        {report.strengths.map((str, idx) => (
                            <li key={idx} style={{ marginBottom: "8px", fontSize: "15px" }}>{str}</li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses Card */}
                <div style={{ flex: "1 1 400px", background: "#fff5f5", padding: "20px", borderRadius: "10px", border: "1px solid #fed7d7" }}>
                    <h3 style={{ color: "#9b2c2c", margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>⚠</span> Weak Topics
                    </h3>
                    <ul style={{ paddingLeft: "20px", margin: 0, color: "#742a2a" }}>
                        {report.weak_topics.map((weak, idx) => (
                            <li key={idx} style={{ marginBottom: "8px", fontSize: "15px" }}>{weak}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recommendations Section */}
            <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "35px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#4f46e5", fontSize: "20px" }}>Recommended Learning & Improvement Plan</h3>
                
                <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "15px" }}>📚 Topics to Study:</h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {report.recommended_topics.map((topic, idx) => (
                            <span key={idx} style={{ background: "#eef2ff", color: "#4f46e5", padding: "6px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "15px" }}>💡 Actionable Suggestions:</h4>
                    <ul style={{ paddingLeft: "20px", margin: 0, color: "#4b5563" }}>
                        {report.suggestions.map((suggestion, idx) => (
                            <li key={idx} style={{ marginBottom: "8px", fontSize: "15px" }}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
                <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                        padding: "12px 24px",
                        background: "#4f46e5",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Take Another Mock Interview
                </button>
                <button
                    onClick={() => navigate("/history")}
                    style={{
                        padding: "12px 24px",
                        background: "white",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    View Interview History
                </button>
            </div>
        </div>
    );
}

export default Result;