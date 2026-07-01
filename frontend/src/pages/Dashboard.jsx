import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const [role, setRole] = useState("Java");
    const [difficulty, setDifficulty] = useState("Easy");
    const [resumeFilename, setResumeFilename] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [userFullName, setUserFullName] = useState("");

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/");
                    return;
                }
                const response = await api.get("/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserFullName(response.data.full_name);
                setResumeFilename(response.data.resume_filename || "");
            } catch (err) {
                console.error("Error fetching user profile:", err);
                localStorage.removeItem("token");
                navigate("/");
            }
        }
        fetchUserProfile();
    }, [navigate]);

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
            const response = await api.post("/interview/upload-resume", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            setResumeFilename(response.data.filename);
            alert("Resume uploaded and parsed successfully!");
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.detail || "Failed to upload resume";
            setUploadError(errorMsg);
            alert(errorMsg);
        } finally {
            setIsUploading(false);
        }
    }

    async function startInterview() {
        try {
            const token = localStorage.getItem("token");
            const response = await api.post(
                "/interview/start",
                {
                    role,
                    difficulty
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);
            localStorage.setItem(
                "interview",
                JSON.stringify(response.data)
            );
            alert("Interview Started");
            navigate("/interview");
        } catch (err) {
            console.log(err);
            alert("Unable to start interview");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("interview");
        navigate("/");
    };

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                <div style={{ textAlign: "left" }}>
                    <h1 style={{ margin: 0, fontSize: "32px" }}>Dashboard</h1>
                    {userFullName && <p style={{ margin: "5px 0 0", color: "#666" }}>Welcome back, <strong>{userFullName}</strong>!</p>}
                </div>
                <div>
                    <button onClick={() => navigate("/history")} style={{ marginRight: "10px", padding: "8px 16px", cursor: "pointer" }}>
                        History
                    </button>
                    <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer", background: "#f3f4f6", border: "1px solid #d1d5db" }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Resume Upload Module */}
            <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", marginBottom: "30px", textAlign: "left" }}>
                <h2 style={{ marginTop: 0, fontSize: "20px" }}>1. Personalized Resume Analysis</h2>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}>
                    Upload your PDF resume to customize interview questions specifically for your skills, projects, and work experience.
                </p>

                <div style={{ border: "2px dashed #ccc", padding: "20px", borderRadius: "8px", textAlign: "center", background: "#fafafa" }}>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleResumeUpload} 
                        style={{ display: "none" }} 
                        id="resume-upload-input" 
                        disabled={isUploading}
                    />
                    <label htmlFor="resume-upload-input" style={{ cursor: isUploading ? "not-allowed" : "pointer", padding: "10px 20px", background: "#4f46e5", color: "white", borderRadius: "6px", display: "inline-block", fontWeight: "bold" }}>
                        {isUploading ? "Uploading & Extracting..." : "Choose Resume PDF"}
                    </label>
                    
                    {resumeFilename ? (
                        <div style={{ marginTop: "15px", color: "#059669", fontWeight: "600" }}>
                            ✓ Active Resume: {resumeFilename}
                        </div>
                    ) : (
                        <div style={{ marginTop: "15px", color: "#6b7280" }}>
                            No resume uploaded yet (standard questions will be generated)
                        </div>
                    )}
                </div>
                {uploadError && <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "10px", textAlign: "center" }}>{uploadError}</p>}
            </div>

            {/* Setup Interview Module */}
            <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", textAlign: "left" }}>
                <h2 style={{ marginTop: 0, fontSize: "20px" }}>2. Configure Interview</h2>
                
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Select Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
                        >
                            <option>Java</option>
                            <option>Python</option>
                            <option>OOPS</option>
                            <option>DBMS</option>
                            <option>SQL</option>
                            <option>Operating System</option>
                            <option>Computer Networks</option>
                            <option>Machine Learning</option>
                            <option>Artificial Intelli</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Select Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={startInterview}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
                    }}
                >
                    Start Personalized Interview →
                </button>
            </div>
        </div>
    );
}

export default Dashboard;