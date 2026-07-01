import { useState, useRef, useEffect } from "react";

function AnswerBox({
    answer,
    setAnswer,
    submitAnswer
}) {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);
    const startTextRef = useRef('');

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = "en-US";

            rec.onresult = (event) => {
                let speechToText = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    speechToText += event.results[i][0].transcript;
                }
                const base = startTextRef.current;
                setAnswer(base + (base && !base.endsWith(' ') ? ' ' : '') + speechToText);
            };

            rec.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsRecording(false);
            };

            rec.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = rec;
        } else {
            console.warn("Web Speech API is not supported in this browser.");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [setAnswer]);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            startTextRef.current = answer;
            setIsRecording(true);
            recognitionRef.current.start();
        }
    };

    return (
        <div className="answer-card">
            <h2>Your Answer</h2>
            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type or click the microphone to speak your answer..."
                rows="8"
            />
            <br />
            <div className="button-group">
                <button
                    className={`mic-btn ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                    type="button"
                    title={isRecording ? "Stop voice recording" : "Start voice recording"}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" className="mic-icon">
                        <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                    {isRecording ? "Listening..." : "Speak Answer"}
                </button>

                <button
                    className="submit-btn"
                    onClick={submitAnswer}
                >
                    Submit Answer
                </button>
            </div>
        </div>
    );
}

export default AnswerBox;

