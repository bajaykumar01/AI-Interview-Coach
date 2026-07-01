import { HelpCircle } from "lucide-react";

function QuestionCard({ question }) {
  return (
    <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/10 border border-indigo-500/10 p-6 rounded-2xl text-left relative overflow-hidden backdrop-blur-sm shadow-xl">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="flex gap-4 items-start">
        <div className="bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 p-2.5 rounded-xl mt-1">
          <HelpCircle size={20} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">AI Prompt</span>
          <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
            {question || "Loading question details..."}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;