import React, { useState } from 'react';
import { PRESET_PROBLEMS } from '../data/presets';
import { PresetProblem } from '../types';
import { BookOpen, Cpu, ArrowRight, Sparkles } from 'lucide-react';

interface ProblemInputProps {
  onSubmit: (title: string, description: string) => void;
  isLoading: boolean;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ onSubmit, isLoading }) => {
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono mb-4 shadow-2xs">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>OHMASTERYLAB.IO // PATTERN ARCHITECT COACH</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          Stop Memorizing Solutions.{' '}
          <span className="text-emerald-700">
            Master Algorithmic Patterns.
          </span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Elite technical interview coaching using a structured 3-phase loop. Deconstruct the
          underlying invariant, defend it conceptually against edge cases, and face blunt L6 code & commentary review.
        </p>
      </div>

      {/* The 3-Phase Progression Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold mb-1">
            <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[10px]">1</span>
            PATTERN BREAKDOWN
          </div>
          <p className="text-xs text-slate-600">
            Core pattern & data structure identified. The "aha!" logic, Big O comparisons, and ELI5 analogy.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 font-mono text-xs font-bold mb-1">
            <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px]">2</span>
            CONCEPTUAL QUIZ
          </div>
          <p className="text-xs text-slate-600">
            3-4 deep logic questions on invariants & edge cases. No code allowed. Must score ≥80% to proceed.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 font-mono text-xs font-bold mb-1">
            <span className="w-4 h-4 rounded bg-rose-100 border border-rose-300 flex items-center justify-center text-[10px]">3</span>
            BLUNT CRITIQUE
          </div>
          <p className="text-xs text-slate-600">
            Solve a higher-order similar problem. Code + inline interview comments every 3-5 lines. Zero sugar-coating.
          </p>
        </div>
      </div>

      {/* Preset Problem Selection */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Select Benchmark Pattern or Paste Problem
            </h3>
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
