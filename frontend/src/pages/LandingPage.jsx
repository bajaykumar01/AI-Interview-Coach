import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Settings, 
  Award, 
  Sparkles, 
  Mic, 
  LineChart, 
  ShieldCheck, 
  Cpu, 
  BookmarkCheck
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Decorative Glow Bubbles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="border-b border-slate-900/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Cpu size={18} />
            </div>
            <span>Aura<span className="text-indigo-400">Interview</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold mb-8 tracking-wider uppercase"
        >
          <Sparkles size={14} /> Next-Generation AI Interview Coaching
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 max-w-4xl mx-auto leading-none mb-8"
        >
          AI Interview Coach
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Practice AI-powered interviews tailored to your skills, resume, and career goals. Get evaluated in real-time by advanced LLMs.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-bounce-short"
        >
          <button 
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-indigo-500/10 transition-all hover:-translate-y-1 hover:shadow-indigo-500/25 cursor-pointer"
          >
            Practice Mock Interview
          </button>
          <button 
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold px-8 py-4 rounded-xl transition-all hover:bg-slate-800/80 cursor-pointer"
          >
            Create Account
          </button>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-t border-slate-900/50 bg-slate-900/10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">How It Works</h2>
            <p className="text-slate-400 mt-2 max-w-xl mx-auto">Three simple steps to level up your technical interview game.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {/* Step 1 */}
            <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-850 p-8 rounded-2xl backdrop-blur-sm">
              <div className="bg-indigo-500/10 text-indigo-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Resume Based Interview</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Upload your PDF resume. Aura extracts your skills, projects, certifications, and experience to model custom questions.
              </p>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block">Automatic High Difficulty</span>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-850 p-8 rounded-2xl backdrop-blur-sm">
              <div className="bg-purple-500/10 text-purple-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <Settings size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Configure Interview</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Choose between Resume-based mode or select specific topics like Java, SQL, React, ML, CN, OS, OOPS, and DBMS manually.
              </p>
              <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider block">Custom Role & Difficulty</span>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-850 p-8 rounded-2xl backdrop-blur-sm">
              <div className="bg-emerald-500/10 text-emerald-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. AI Feedback</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Answer using text or voice. Gemini evaluates your response, awarding scores, pinpointing strengths, and outlining improvement areas.
              </p>
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">Real-time Performance Report</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Cards Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Platform Features</h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">Engineered to simulate actual technical evaluation pipelines.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* F1 */}
          <div className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="text-indigo-400 mb-4"><FileText size={20} /></div>
            <h4 className="text-lg font-bold text-white mb-2">✓ Resume Analysis</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Pure PDF text analysis mapping your key background directly into interview models.</p>
          </div>
          {/* F2 */}
          <div className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="text-purple-400 mb-4"><Cpu size={20} /></div>
            <h4 className="text-lg font-bold text-white mb-2">✓ Adaptive Questions</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Generative question pipelines that scale difficulty dynamically based on prior responses.</p>
          </div>
          {/* F3 */}
          <div className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="text-cyan-400 mb-4"><Mic size={20} /></div>
            <h4 className="text-lg font-bold text-white mb-2">✓ Speech-to-Text</h4>
            <p className="text-slate-400 text-sm leading-relaxed">State-of-the-art Web Speech API integration translating voice answers into text editor streams.</p>
          </div>
          {/* F4 */}
          <div className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="text-emerald-400 mb-4"><ShieldCheck size={20} /></div>
            <h4 className="text-lg font-bold text-white mb-2">✓ Real-Time Feedback</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Instant evaluation showing score, explanation, and sample ideal answers for every query.</p>
          </div>
          {/* F5 */}
          <div className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="text-amber-400 mb-4"><BookmarkCheck size={20} /></div>
            <h4 className="text-lg font-bold text-white mb-2">✓ Interview History</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Secure MySQL session logging enabling you to review previous logs and trace progress.</p>
          </div>
          {/* F6 */}
          <div className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="text-pink-400 mb-4"><LineChart size={20} /></div>
            <h4 className="text-lg font-bold text-white mb-2">✓ Performance Dashboard</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Comprehensive visual diagnostics featuring core competencies, study grids, and weakness charts.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-900 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around gap-12 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">1000+</div>
            <div className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Questions</div>
          </div>
          <div className="h-px w-12 md:h-12 md:w-px bg-slate-800 hidden md:block" />
          <div>
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">50+</div>
            <div className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Technologies</div>
          </div>
          <div className="h-px w-12 md:h-12 md:w-px bg-slate-800 hidden md:block" />
          <div>
            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">AI Powered</div>
            <div className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Resume Based</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Ready to Ace Your Next Interview?</h2>
        <p className="text-slate-400 mb-10 max-w-lg mx-auto">Start simulating real technical evaluations today and receive instant AI feedback cards.</p>
        <button 
          onClick={() => navigate("/register")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          Create Your Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-slate-500 text-sm">
            © 2026 AuraInterview. All rights reserved.
          </div>
          
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-indigo-400 transition-colors">About</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
