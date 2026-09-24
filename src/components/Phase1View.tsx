import React, { useState } from 'react';
import { Phase1Data } from '../types';
import {
  Layers,
  Database,
  Lightbulb,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Smile,
  Send,
} from 'lucide-react';

interface Phase1ViewProps {
  data: Phase1Data;
  problemTitle: string;
  problemText: string;
  onProceedToQuiz: () => void;
  onAskSocratic: (query: string) => Promise<string>;
}

export const Phase1View: React.FC<Phase1ViewProps> = ({
  data,
  problemTitle,
  problemText,
  onProceedToQuiz,
  onAskSocratic,
}) => {
  const [socraticQuery, setSocraticQuery] = useState('');
  const [socraticAnswer, setSocraticAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socraticQuery.trim() || isAsking) return;
    setIsAsking(true);
    try {
      const hint = await onAskSocratic(socraticQuery);
      setSocraticAnswer(hint);
    } catch (err) {
      setSocraticAnswer('Error contacting architect. Invariant: what property remains true after each step?');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner with Problem Title & Original Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>PHASE 1 // THE PATTERN BREAKDOWN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {data.problemName || problemTitle}
          </h2>
        </div>

        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="self-start sm:self-auto text-xs font-mono font-medium px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          {showOriginal ? 'Hide Original Problem' : 'View Original Problem'}
        </button>
      </div>

      {/* Optional Original Problem Drawer */}
      {showOriginal && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap shadow-2xs">
          <div className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-[11px]">
            Original Problem Specification
          </div>
          {problemText}
        </div>
      )}

      {/* 1. Pattern Identification Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Pattern Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 mb-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>1. CORE PATTERN IDENTIFICATION</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight mb-2">
            {data.corePattern}
          </div>
          {data.secondaryPatterns && data.secondaryPatterns.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {data.secondaryPatterns.map((pat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium"
                >
                  +{pat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Required Data Structure Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 mb-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span>REQUIRED DATA STRUCTURE</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight mb-2">
            {data.requiredDataStructure}
          </div>
          <p className="text-xs text-slate-600 mt-2 font-mono">
            Key for O(1) state lookups or dynamic priority invariant maintenance.
          </p>
        </div>
      </div>

      {/* 2. The Logic: 2-3 sentences on the "aha!" moment */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>2. THE LOGIC // THE "AHA!" MOMENT</span>
        </div>
        <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
          {data.theLogic}
        </p>
        {data.coachNote && (
          <div className="mt-4 pt-3 border-t border-amber-200/80 text-xs text-amber-900 font-mono flex items-start gap-2">
            <span className="text-amber-700 font-bold">ARCHITECT NOTE:</span>
            <span>{data.coachNote}</span>
          </div>
        )}
      </div>

      {/* 3. Method Comparison: Brute Force vs. Optimized */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>3. METHOD COMPARISON // TIME & SPACE COMPLEXITY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brute Force Approach */}
          <div className="p-4 rounded-lg bg-rose-50/40 border border-rose-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-rose-800">
                  NAÏVE / BRUTE FORCE
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-semibold">
                  Suboptimal
                </span>
              </div>
              <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                {data.methodComparison.bruteForce.approach}
              </p>
            </div>

            <div className="border-t border-rose-200 pt-3 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Time Complexity:</span>
                <span className="text-rose-700 font-bold">{data.methodComparison.bruteForce.timeComplexity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Space Complexity:</span>
                <span className="text-rose-700 font-bold">{data.methodComparison.bruteForce.spaceComplexity}</span>
              </div>
              <div className="text-[11px] text-rose-800 pt-1">
                <span className="font-bold">Bottleneck: </span>
                {data.methodComparison.bruteForce.bottleneck}
              </div>
            </div>
          </div>

          {/* Optimized Approach */}
          <div className="p-4 rounded-lg bg-emerald-50/40 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-800">
                  OPTIMIZED PATTERN
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                  Optimal Target
                </span>
              </div>
              <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                {data.methodComparison.optimized.approach}
              </p>
            </div>

            <div className="border-t border-emerald-200 pt-3 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Time Complexity:</span>
                <span className="text-emerald-700 font-bold">{data.methodComparison.optimized.timeComplexity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Space Complexity:</span>
                <span className="text-emerald-700 font-bold">{data.methodComparison.optimized.spaceComplexity}</span>
              </div>
              <div className="text-[11px] text-emerald-800 pt-1">
                <span className="font-bold">Advantage: </span>
                {data.methodComparison.optimized.advantage}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ELI5 Analogy */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-700 mb-2">
          <Smile className="w-4 h-4 text-purple-600" />
          <span>4. EXPLAIN LIKE I'M 5 // INTUITIVE ANALOGY</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed italic">
          "{data.eli5}"
        </p>
      </div>

      {/* 5. External Reference & Video Resource */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">
            Curated Visual Reference
          </span>
          <p className="text-xs text-slate-700">
            Solidify the geometric or tabular walkthrough of this problem before defending it.
          </p>
        </div>

        <a
          href={data.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-medium transition-colors self-start sm:self-auto shadow-2xs"
        >
          <span>Watch Solution Video</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Socratic Clarification Drawer */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 mb-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>STUCK ON THE INVARIANT? (SOCRATIC COACH)</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Ask a clarifying question about the pattern logic. The coach will give a guided conceptual clue without spoiling the answers.
        </p>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={socraticQuery}
            onChange={(e) => setSocraticQuery(e.target.value)}
            placeholder="e.g. Why can't we use standard two-pointers if the array is unsorted?"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isAsking || !socraticQuery.trim()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {isAsking ? 'Thinking...' : 'Inquire'}
            <Send className="w-3 h-3" />
          </button>
        </form>

        {socraticAnswer && (
          <div className="p-3 mt-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs font-mono text-emerald-950 leading-relaxed">
            <span className="font-bold text-emerald-800 block mb-1">COACH ARCHITECT:</span>
            {socraticAnswer}
          </div>
        )}
      </div>

      {/* Advance to Phase 2 Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl bg-slate-900 text-white gap-4 shadow-sm">
        <div>
          <h4 className="text-base font-bold">Ready for Phase 2: The Conceptual Quiz?</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            You must defend the invariants and edge cases in plain English (≥80% passing bar). No code allowed.
          </p>
        </div>

        <button
          onClick={onProceedToQuiz}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <span>Begin Conceptual Defense</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
