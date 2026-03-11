
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import Scanner from './components/Scanner';
import AISearch from './components/AISearch';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.USER);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar currentMode={mode} setMode={setMode} />
      
      <main className="container mx-auto px-4 max-w-6xl">
        {mode === AppMode.ADMIN && <AdminPanel />}
        {mode === AppMode.USER && <Scanner />}
        {mode === AppMode.SEARCH && <AISearch />}
      </main>

      <footer className="mt-20 py-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <i className="fa-solid fa-shield-halved"></i>
            <span>ChainTrust System v1.0.2</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Smart Contract Audit</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
