
import React, { useState } from 'react';
import { verifyProduct } from '../services/blockchainService';
import { VerificationResult } from '../types';
import { ICONS } from '../constants';
import { analyzeProductImage, getQuickAdvice } from '../services/geminiService';

const Scanner: React.FC = () => {
  const [scanValue, setScanValue] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [quickTip, setQuickTip] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!scanValue) return;
    setVerifying(true);
    setResult(null);
    setAiReport(null);
    setQuickTip(null);

    const res = await verifyProduct(scanValue);
    setResult(res);
    setVerifying(false);

    // Get a quick AI tip automatically
    const tip = await getQuickAdvice(res.status === 'authentic' ? 'how to store high value products' : 'reporting counterfeit goods');
    setQuickTip(tip);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const report = await analyzeProductImage(base64, file.type);
        setAiReport(report);
      } catch (err: any) {
        console.error("Analysis failed:", err);
        setAiReport(`AI Analysis failed: ${err.message || 'Unknown error'}`);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 -z-0"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2 flex items-center gap-3">
            {ICONS.Scanner} Verify Authenticity
          </h2>
          <p className="text-slate-500 mb-8">Enter the product serial number or upload a photo of the QR code.</p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              placeholder="Scan or Type Serial Number"
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none text-lg font-mono transition-all"
            />
            <button
              onClick={handleVerify}
              disabled={verifying || !scanValue}
              className={`px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${verifying || !scanValue ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
            >
              {verifying ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : 'Verify Now'}
            </button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-400">OR ANALYZE PHOTO</span></div>
          </div>

          <div className="mt-6">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i className="fa-solid fa-camera text-3xl text-slate-400 mb-2"></i>
                <p className="mb-2 text-sm text-slate-500 font-semibold">Upload Product Image</p>
                <p className="text-xs text-slate-400">AI will detect physical anomalies</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>

      {(result || analyzing || aiReport) && (
        <div className="space-y-6">
          {result && (
            <div className={`p-8 rounded-3xl border-2 shadow-xl animate-scaleIn ${result.status === 'authentic' ? 'bg-green-50 border-green-200' :
              result.status === 'reused' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
              }`}>
              <div className="flex items-start gap-4">
                <span className={`text-4xl ${result.status === 'authentic' ? 'text-green-500' :
                  result.status === 'reused' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                  {result.status === 'authentic' ? ICONS.Check : ICONS.Alert}
                </span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {result.status === 'authentic' ? 'Authentic Product' :
                      result.status === 'reused' ? 'Warning: Duplicate Use' : 'Counterfeit Alert'}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{result.message}</p>

                  {result.product && (
                    <div className="bg-white/60 p-6 rounded-2xl space-y-3">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Product Name</span>
                        <span className="text-sm font-semibold text-slate-700">{result.product.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Manufacturer</span>
                        <span className="text-sm font-mono text-slate-500">{result.product.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Registered On</span>
                        <span className="text-sm text-slate-500">{new Date(result.product.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {quickTip && (
                    <div className="mt-6 flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <span className="text-blue-500">{ICONS.Robot}</span>
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">Quick AI Security Tip</p>
                        <p className="text-sm text-slate-600">{quickTip}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(analyzing || aiReport) && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl text-purple-600">{ICONS.Robot}</span>
                <h3 className="text-xl font-bold text-slate-800">Gemini 1.5 Pro Visual Analysis</h3>
              </div>

              {analyzing ? (
                <div className="flex flex-col items-center py-12 gap-4">
                  <i className="fa-solid fa-brain text-4xl text-purple-200 animate-pulse"></i>
                  <p className="text-slate-500 animate-pulse font-medium">Analyzing product details deeply...</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none">
                  <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 whitespace-pre-wrap text-sm leading-relaxed border border-slate-200">
                    {aiReport}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;
