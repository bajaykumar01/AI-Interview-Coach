import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function History() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            const response = await api.get(
                "/interview/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setHistory(response.data);
        } catch (error) {
            console.log(error);
            alert("Unable to load interview history.");
        }
    }

    return (
        <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eaeaea", paddingBottom: "15px", marginBottom: "25px" }}>
                <h1 style={{ margin: 0, fontSize: "28px" }}>Interview History</h1>
                <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", cursor: "pointer", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px" }}>
                    Dashboard
                </button>
            </div>

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid #eee",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
            >
                <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                        <th style={{ padding: "12px" }}>Role</th>
                        <th style={{ padding: "12px" }}>Difficulty</th>
                        <th style={{ padding: "12px" }}>Overall Score</th>
                        <th style={{ padding: "12px" }}>Date</th>
                        <th style={{ padding: "12px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                No interviews taken yet.
                            </td>
                        </tr>
                    ) : (
                        history.map((item) => (
                            <tr key={item.session_id} style={{ borderTop: "1px solid #eee" }}>
                                <td style={{ padding: "12px", fontWeight: "600" }}>{item.role}</td>
                                <td style={{ padding: "12px" }}>{item.difficulty}</td>
                                <td style={{ padding: "12px" }}>
                                    {item.overall_score !== null && item.overall_score !== undefined ? (
                                        <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                                            {item.overall_score.toFixed(1)} / 10
                                        </span>
                                    ) : (
                                        <span style={{ color: "#9ca3af", fontStyle: "italic" }}>In Progress</span>
                                    )}
                                </td>
                                <td style={{ padding: "12px", color: "#666" }}>
                                    {new Date(item.created_at).toLocaleString()}
                                </td>
                                <td style={{ padding: "12px" }}>
                                    {item.overall_score !== null && item.overall_score !== undefined ? (
                                        <button
                                            onClick={() => navigate("/result", { state: { session_id: item.session_id } })}
                                            style={{
                                                padding: "6px 12px",
                                                background: "#4f46e5",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: "600"
                                            }}
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
                                            style={{
                                                padding: "6px 12px",
                                                background: "#10b981",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: "600"
                                            }}
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
    );
}

export default History;
