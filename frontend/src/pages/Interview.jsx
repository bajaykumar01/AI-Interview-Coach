import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import AnswerBox from "../components/AnswerBox";
import QuestionCard from "../components/QuestionCard";
import FeedbackCard from "../components/FeedbackCard";
import { Cpu, ArrowRight, Timer, AlertCircle, Sparkles } from "lucide-react";

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
  const [questionNumber, setQuestionNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  // Timer state (90 seconds per question)
  const [timeLeft, setTimeLeft] = useState(90);
  const timerRef = useRef(null);

  useEffect(() => {
    const interview = JSON.parse(localStorage.getItem("interview"));
    if (interview) {
      setQuestion(interview.question);
      setQuestionId(interview.question_id);
      setSessionId(interview.session_id);
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Timer countdown hook
  useEffect(() => {
    if (loading || showNextButton) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(90);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-submit when time expires
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questionId, loading, showNextButton]);

  const handleAutoSubmit = () => {
    alert("Time is up! Submitting your current response automatically.");
    submitAnswer();
  };

  async function submitAnswer() {
    setLoading(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/interview/answer",
        {
          session_id: sessionId,
          question_id: questionId,
          answer_text: answer || "(Candidate did not provide an answer in the allotted time)"
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
            total_questions: 5,
            session_id: sessionId
          }
        });
        return;
      }

      setScore(response.data.ai_score);
      setFeedback(response.data.ai_feedback);
      setNextQuestion(response.data.next_question);
      setNextQuestionId(response.data.next_question_id);
      setShowNextButton(true);
    } catch (err) {
      console.error(err);
      alert("Unable to submit answer. Please try again.");
    } finally {
      setLoading(false);
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

  // Calculate progress percentage
  const progressPercent = (questionNumber / 5) * 100;
  const questionsRemaining = 5 - questionNumber;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans pb-16 relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Decorative Glow Bubbles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 backdrop-blur-md z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center text-white">
              <Cpu size={16} />
            </div>
            <span>Aura<span className="text-indigo-400">Interview</span></span>
          </div>
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to exit? Your progress in this session will be lost.")) {
                navigate("/dashboard");
              }
            }}
            className="text-slate-400 hover:text-white text-sm font-semibold transition-colors"
          >
            Exit Session
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-8">
        {/* Progress Bar & Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm mb-2 text-slate-400">
            <span className="font-semibold text-white">Question {questionNumber} of 5</span>
            <span className="text-xs">{questionsRemaining} question{questionsRemaining !== 1 ? "s" : ""} remaining</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-900">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer Panel */}
        {!showNextButton && !loading && (
          <div className={`flex items-center justify-between p-4 rounded-xl mb-6 border transition-all ${
            timeLeft <= 15 
              ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" 
              : "bg-slate-900/40 border-slate-900/80 text-slate-300"
          }`}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Timer size={18} className={timeLeft <= 15 ? "text-red-400" : "text-slate-400"} />
              <span>Time Remaining</span>
            </div>
            <div className="text-lg font-bold tracking-wider">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          </div>
        )}

        {/* Question Panel */}
        <div className="mb-6">
          {loading ? (
            <div className="glass-panel p-6 rounded-2xl animate-pulse flex flex-col gap-3">
              <div className="h-4 bg-slate-800 rounded w-1/4"></div>
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            </div>
          ) : (
            <QuestionCard question={question} />
          )}
        </div>

        {/* Answer Submission & Loaders */}
        <div className="mb-6">
          {loading ? (
            <div className="glass-panel p-8 rounded-2xl text-center border border-indigo-500/20 relative overflow-hidden">
              {/* Soundwaves Loading Visual */}
              <div className="flex items-center justify-center gap-1.5 h-8 mb-4">
                <div className="w-1.5 bg-indigo-500 rounded-full wave-bar" style={{ animationDelay: "0.1s" }} />
                <div className="w-1.5 bg-purple-500 rounded-full wave-bar" style={{ animationDelay: "0.3s" }} />
                <div className="w-1.5 bg-indigo-500 rounded-full wave-bar" style={{ animationDelay: "0.5s" }} />
                <div className="w-1.5 bg-purple-500 rounded-full wave-bar" style={{ animationDelay: "0.2s" }} />
                <div className="w-1.5 bg-indigo-500 rounded-full wave-bar" style={{ animationDelay: "0.4s" }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-1">
                <Sparkles className="text-indigo-400 animate-spin" size={16} /> Evaluating your answer...
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                Our AI recruiter is assessing technical accuracy, communication clarity, and compiling detailed recommendations.
              </p>
            </div>
          ) : !showNextButton ? (
            <AnswerBox
              answer={answer}
              setAnswer={setAnswer}
              submitAnswer={submitAnswer}
            />
          ) : null}
        </div>

        {/* Feedback Display */}
        {showNextButton && (
          <div className="space-y-6">
            <FeedbackCard score={score} feedback={feedback} />

            <button
              onClick={loadNextQuestion}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Next Question
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Interview;