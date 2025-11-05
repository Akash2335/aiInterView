import React from 'react';

export default function InterviewAssistantFooter() {
  return (
    <footer className="w-full bg-gradient-to-r from-yellow-500 via-slate-800 to-blue-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/6 p-3 shadow-lg backdrop-blur-md">
            {/* subtle logo */}
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="2" y="3" width="20" height="18" rx="4" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />
              <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <div className="text-lg font-semibold">AI Interview Assistant</div>
            <div className="mt-0.5 text-sm text-slate-300">Voice-driven interview simulation — built for screening & practice</div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <button
              aria-label="Start voice interview"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-2 text-sm font-medium text-slate-900 shadow-md transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 3v10" stroke="#042A2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 11a7 7 0 01-14 0" stroke="#042A2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Start Voice Interview
            </button>

            <button
              aria-label="Toggle mic"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 p-2 text-sm text-slate-200 shadow-sm hover:bg-white/6 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 1v11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 11a7 7 0 01-14 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav className="flex items-center gap-3">
            <a href="#features" className="text-sm text-slate-300 hover:text-white">Features</a>
            <a href="#pricing" className="text-sm text-slate-300 hover:text-white">Pricing</a>
            <a href="#docs" className="text-sm text-slate-300 hover:text-white">Docs</a>
            <a href="#support" className="text-sm text-slate-300 hover:text-white">Support</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-4 border-t border-white/6 text-sky-400">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm">© {new Date().getFullYear()} AI Interview Assistant — Owner: <span className="font-medium text-slate-200">Akash Bhrati</span></div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300">Built with • Voice • NLP • Simulation</div>
            <div className="flex items-center gap-3">
              <a href="#privacy" className="text-xs text-slate-400 hover:text-white">Privacy</a>
              <a href="#terms" className="text-xs text-slate-400 hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
