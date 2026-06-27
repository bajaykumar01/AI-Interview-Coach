import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const navigate = useNavigate();
    const [role, setRole] = useState("Java");

    const [difficulty, setDifficulty] = useState("Easy");

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
        }

        catch (err) {

            console.log(err);

            alert("Unable to start interview");

        }

    }

    return (

        <div>

            <h1>Dashboard</h1>

            <h3>Select Role</h3>

            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
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

            <br /><br />

            <h3>Select Difficulty</h3>

            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            >

                <option>Easy</option>

                <option>Medium</option>

                <option>Hard</option>

            </select>

            <br /><br />
            <button
                onClick={() => navigate("/history")}
            >
                Interview History
            </button>
            
            <button
                onClick={startInterview}
            >

                Start Interview

            </button>

        </div>

    );

}

export default Dashboard;