import { useState, useEffect } from "react";
import { Mic, MicOff, Send, MessageSquare } from "lucide-react";

function AnswerBox({ answer, setAnswer, submitAnswer }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Set text input, adding spaces appropriately
        if (finalTranscript) {
          setAnswer((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + finalTranscript);
        }
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [setAnswer]);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-left">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={16} /> Write or Speak Your Response
        </h4>
        {recognition && (
          <button
            onClick={toggleListening}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isListening
                ? "bg-red-500/10 border border-red-500/30 text-red-400 animate-pulse"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {isListening ? (
              <>
                <MicOff size={14} /> Stop Listening
              </>
            ) : (
              <>
                <Mic size={14} /> Answer with Voice
              </>
            )}
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <textarea
          rows="6"
          placeholder="Type your comprehensive response here, or click the mic button to transcribe..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-850 focus:border-indigo-500/50 focus:outline-none rounded-xl p-4 text-slate-200 placeholder-slate-650 transition-colors text-sm leading-relaxed resize-none"
        />
        {isListening && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Listening</span>
          </div>
        )}
      </div>

      <button
        onClick={submitAnswer}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
      >
        Submit Response <Send size={16} />
      </button>
    </div>
  );
}

export default AnswerBox;
