import { useLocation, useNavigate } from "react-router-dom";

function Result() {

    const location = useLocation();
    const navigate = useNavigate();

    const result = location.state;

    if (!result) {

        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>No Result Found</h2>

                <button onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        );

    }

    return (

        <div
            style={{
                width: "70%",
                margin: "40px auto",
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0px 2px 10px rgba(0,0,0,0.2)"
            }}
        >

            <h1>Interview Completed 🎉</h1>

            <hr />

            <h2>Overall Score</h2>

            <h1>{result.overall_score} / 5</h1>

            <h3>Total Questions</h3>

            <h2>{result.total_questions}</h2>

            <hr />

            <h2>Performance</h2>

            {
                result.overall_score >= 4
                    ? <p>✅ Excellent Performance</p>
                    : result.overall_score >= 3
                        ? <p>👍 Good Performance</p>
                        : <p>⚠ Needs Improvement</p>
            }

            <br />

            <button
                onClick={() => navigate("/dashboard")}
            >
                Take Another Interview
            </button>

        </div>

    );

}

export default Result;