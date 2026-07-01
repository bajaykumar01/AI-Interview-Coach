import { Award, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

function FeedbackCard({ score, feedback }) {
  if (!score && !feedback) return null;

  const parsedScore = parseFloat(score);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-left space-y-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Score Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">AI Evaluator</span>
          <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
            <CheckCircle size={18} className="text-emerald-400" /> Response Feedback Card
          </h3>
        </div>

        {score !== null && score !== undefined && (
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-900/60 w-fit">
            <Award size={18} className="text-indigo-400" />
            <div className="text-sm font-semibold">
              Score: <strong className="text-indigo-400 text-base">{parsedScore.toFixed(1)}</strong> <span className="text-slate-500 text-xs">/ 10</span>
            </div>
          </div>
        )}
      </div>

      {/* Review Feedback text */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Breakdown</h4>
        <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-4 leading-relaxed text-sm text-slate-350">
          {feedback}
        </div>
      </div>

      {/* Performance Summary Banner */}
      <div className="flex gap-3 items-start bg-slate-900/20 border border-slate-900/60 p-4 rounded-xl text-xs text-slate-400">
        <AlertCircle size={16} className="text-slate-500 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          Gemini score is generated dynamically. Answers are evaluated based on technical correctness, structured presentation, and communication confidence.
        </p>
      </div>
    </div>
  );
}

export default FeedbackCard;
