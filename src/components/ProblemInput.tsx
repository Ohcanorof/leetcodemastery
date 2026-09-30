import React, { useState } from 'react';
import { PRESET_PROBLEMS } from '../data/presets';
import { PresetProblem } from '../types';
import {
  BookOpen,
  Cpu,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle,
  Code2,
} from 'lucide-react';

interface ProblemInputProps {
  onSubmit: (title: string, description: string) => void;
  isLoading: boolean;
  onNavigateToDataStructures: () => void;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({
  onSubmit,
  isLoading,
  onNavigateToDataStructures,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('two-sum');
  const [problemTitle, setProblemTitle] = useState<string>(PRESET_PROBLEMS[0].title);
  const [problemText, setProblemText] = useState<string>(PRESET_PROBLEMS[0].description);
  const [customMode, setCustomMode] = useState<boolean>(false);

  const handleSelectPreset = (preset: PresetProblem) => {
    setSelectedPresetId(preset.id);
    setProblemTitle(preset.title);
    setProblemText(preset.description);
    setCustomMode(false);
  };

  const handleCustomMode = () => {
    setSelectedPresetId('');
    setProblemTitle('');
    setProblemText('');
    setCustomMode(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim()) return;
    onSubmit(problemTitle.trim() || 'Custom LeetCode Problem', problemText.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Banner with requested title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono mb-4 shadow-2xs">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>OHMASTERYLAB.IO // THE COMPLETE INTERVIEW CURRICULUM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
          Master Everything Around{' '}
          <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-8">
            Data Structures & Patterns
          </span>
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
          From hardware RAM layouts and real-world system architecture, to the 3-phase LeetCode
          pattern gauntlet. Pick your starting point below based on your current readiness.
        </p>
      </div>

      {/* Two-Track Learning Pathway (Data Structures vs LeetCode Patterns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Track 1: Data Structures (The Basics) */}
        <div className="bg-white border-2 border-emerald-500/30 hover:border-emerald-500 rounded-2xl p-6 shadow-xs transition-all relative flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300 uppercase">
                Stage 1 • Foundations
              </span>
              <span className="text-xs font-mono text-slate-400">10 Core Structures</span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Master the Data Structures (The Basics)
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              New to data structures or need to refresh the fundamentals? Learn how arrays, linked lists,
              heaps, trees, and graphs work under the hood. Includes real-world engineering analogies,
              scratch code, and interactive quizzes.
            </p>

            <div className="space-y-1.5 pt-2 text-xs font-mono text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Physical RAM layout & CPU cache locality</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Industrial production engineering use-cases</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-lock self-evaluation quizzes with explanations</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onNavigateToDataStructures}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-mono font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore Data Structure Academy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Track 2: LeetCode Patterns (Skip ahead) */}
        <div className="bg-white border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-6 shadow-xs transition-all relative flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-slate-100 text-slate-700 rounded-md border border-slate-300 uppercase">
                Stage 2 • Advanced Gauntlet
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">Skip Ahead</span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Master Algorithmic Patterns (The Gauntlet)
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Already know your data structures? Skip the basics and jump directly into the
              rigorous 3-phase interview loop: identify the core pattern, pass the conceptual
              defense quiz (≥80%), and survive blunt L6 code review.
            </p>

            <div className="space-y-1.5 pt-2 text-xs font-mono text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-[9px] font-bold">1</span>
                <span>Phase 1: Invariant & logic breakdown + ELI5</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-[9px] font-bold">2</span>
                <span>Phase 2: Conceptual logic quiz (no code allowed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center justify-center text-[9px] font-bold">3</span>
                <span>Phase 3: Similar problem with blunt code critique</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <a
              href="#leetcode-box"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-mono font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Skip to LeetCode Pattern Practice ↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Preset Problem Selection / LeetCode Input Box */}
      <div id="leetcode-box" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Select Benchmark Pattern or Paste Problem
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Curated easy, medium, and hard patterns — or input any custom question
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCustomMode}
              className={`text-xs font-mono px-3 py-1.5 rounded-md border transition-colors ${
                customMode
                  ? 'bg-slate-900 border-slate-900 text-white font-bold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              + Custom Problem
            </button>
          </div>
        </div>

        {/* Preset Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-5">
          {PRESET_PROBLEMS.map((preset) => {
            const isSelected = !customMode && selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left text-xs p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/60 text-slate-900 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="font-bold text-slate-900">{preset.title}</div>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-500">
                  <span
                    className={`font-semibold ${
                      preset.difficulty === 'Hard'
                        ? 'text-rose-600'
                        : preset.difficulty === 'Medium'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {preset.difficulty}
                  </span>
                  <span>•</span>
                  <span className="truncate">{preset.category}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Problem Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              Problem Title
            </label>
            <input
              type="text"
              value={problemTitle}
              onChange={(e) => {
                setProblemTitle(e.target.value);
                setCustomMode(true);
              }}
              placeholder="e.g. Two Sum, 3Sum, Valid Palindrome..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono font-semibold text-slate-700">
                Problem Description & Constraints
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                Paste LeetCode prompt or custom text
              </span>
            </div>
            <textarea
              rows={6}
              value={problemText}
              onChange={(e) => {
                setProblemText(e.target.value);
                setCustomMode(true);
              }}
              placeholder="Paste complete problem statement, constraints, and test examples here..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !problemText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs sm:text-sm rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deconstructing Pattern Invariants...</span>
                </>
              ) : (
                <>
                  <span>Begin Pattern Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
