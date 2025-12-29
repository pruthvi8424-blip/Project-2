
import React, { useState } from 'react';
import { searchCounterfeitNews } from '../services/geminiService';
import { GroundingChunk } from '../types';
import { ICONS } from '../constants';

const AISearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{ text: string; links: GroundingChunk[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setSearching(true);
    try {
      const data = await searchCounterfeitNews(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white shadow-2xl shadow-blue-200 mb-12 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 leading-tight">Anti-Counterfeit <br/>Market Intelligence</h2>
          <p className="text-blue-100 mb-8 max-w-md">Search the web with Gemini to discover the latest counterfeit trends and secure your supply chain.</p>
          
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. 'Counterfeit Rolex 2024 trends'"
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-5 text-lg outline-none focus:ring-4 focus:ring-white/20 transition-all text-white placeholder:text-blue-200/50"
            />
            <button 
              type="submit"
              disabled={searching}
              className="absolute right-3 top-3 bottom-3 px-6 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              {searching ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 animate-fadeIn">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xl mb-6">
            <span className="text-blue-600">{ICONS.Search}</span>
            <span>Intelligence Report</span>
          </div>
          
          <div className="prose prose-slate max-w-none text-slate-600 mb-8 leading-relaxed">
            {results.text.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>

          {results.links.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Sources & Verified Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.links.map((chunk, i) => chunk.web && (
                  <a 
                    key={i} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all group"
                  >
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-800 truncate">{chunk.web.title}</p>
                      <p className="text-xs text-slate-400 truncate">{chunk.web.uri}</p>
                    </div>
                    <i className="fa-solid fa-arrow-up-right-from-square text-slate-300 group-hover:text-blue-500 transition-colors ml-2"></i>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearch;
