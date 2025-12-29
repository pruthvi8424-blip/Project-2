
import React from 'react';
import { ICONS } from '../constants';
import { AppMode } from '../types';

interface NavbarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentMode, setMode }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <span className="text-2xl">{ICONS.Shield}</span>
          <span>ChainTrust</span>
        </div>
        
        <div className="flex gap-1 md:gap-4">
          <button 
            onClick={() => setMode(AppMode.USER)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentMode === AppMode.USER 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {ICONS.Scanner} <span className="hidden md:inline ml-1">Verify</span>
          </button>
          
          <button 
            onClick={() => setMode(AppMode.ADMIN)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentMode === AppMode.ADMIN 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {ICONS.Plus} <span className="hidden md:inline ml-1">Register</span>
          </button>

          <button 
            onClick={() => setMode(AppMode.SEARCH)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentMode === AppMode.SEARCH 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {ICONS.Search} <span className="hidden md:inline ml-1">Insights</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
