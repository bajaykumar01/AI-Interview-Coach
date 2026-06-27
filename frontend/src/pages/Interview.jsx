
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/interview.css";
import QuestionCard from "../components/QuestionCard";
import AnswerBox from "../components/AnswerBox";
import FeedbackCard from "../components/FeedbackCard";
import { useNavigate } from "react-router-dom";
function Interview() {
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [questionId, setQuestionId] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    const [answer, setAnswer] = useState("");

    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");

    const [nextQuestion, setNextQuestion] = useState("");
    const [nextQuestionId, setNextQuestionId] = useState(null);

    const [showNextButton, setShowNextButton] = useState(false);

    const [completed, setCompleted] = useState(false);
    const [overallScore, setOverallScore] = useState("");

    const [questionNumber, setQuestionNumber] = useState(1);

    useEffect(() => {

        const interview = JSON.parse(
            localStorage.getItem("interview")
        );

        if (interview) {

            setQuestion(interview.question);
            setQuestionId(interview.question_id);
            setSessionId(interview.session_id);

        }

    }, []);

    async function submitAnswer() {

        try {

            const token = localStorage.getItem("token");

            const response = await api.post(

                "/interview/answer",

                {

                    session_id: sessionId,
                    question_id: questionId,
                    answer_text: answer

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            console.log(response.data);

            if (response.data.completed) {

                    navigate("/result", {

                        state: {

                            overall_score: response.data.overall_score,

                            total_questions: 3

                        }

                    });

                    return;

                }

            setScore(response.data.ai_score);

            setFeedback(response.data.ai_feedback);

            setNextQuestion(response.data.next_question);

            setNextQuestionId(response.data.next_question_id);

            setShowNextButton(true);

        }

        catch (err) {

            console.log(err);

            alert("Unable to submit answer");

        }

    }

    function loadNextQuestion() {

        setQuestion(nextQuestion);

        setQuestionId(nextQuestionId);

        setAnswer("");

        setScore("");

        setFeedback("");

        setShowNextButton(false);

        setQuestionNumber(questionNumber + 1);

    }

    if (completed) {

        return (

            <div>

                <h1>Interview Completed 🎉</h1>

                <h2>Overall Score</h2>

                <h1>{overallScore}</h1>

            </div>

        );

    }

    return (

        <div style={{ width: "80%", margin: "auto", marginTop: "40px" }}>

            <h1>AI Interview Coach</h1>

            <h3>Question {questionNumber} of 3</h3>

            <QuestionCard question={question} />

            <AnswerBox

                answer={answer}

                setAnswer={setAnswer}

                submitAnswer={submitAnswer}

            />

            <FeedbackCard

                score={score}

                feedback={feedback}

            />

            {

                showNextButton && (

                    <button

                        onClick={loadNextQuestion}

                        style={{

                            marginTop: "20px",
                            padding: "10px 25px",
                            cursor: "pointer"

                        }}

                    >

                        Next Question →

                    </button>

                )

            }

        </div>

    );

}

export default Interview;