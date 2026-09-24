import React from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { PhaseNumber } from '../types';

interface HeaderProps {
  currentPhase: PhaseNumber;
  unlockedPhase: PhaseNumber;
  onSelectPhase: (phase: PhaseNumber) => void;
  onReset: () => void;
  onExport: () => void;
  hasActiveProblem: boolean;
  phase2Score: number | null;
  phase3Verdict: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentPhase,
  unlockedPhase,
  onSelectPhase,
  onReset,
  onExport,
  hasActiveProblem,
  phase2Score,
  phase3Verdict,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Persona - Green theme requested */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-600/20 text-white font-mono font-bold text-xl transition-all">
              Ω
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-700 uppercase">
                  ohmasterylab.io
                </span>
                <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono">
                  v3.8
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                The Pattern Architect
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-emerald-300 text-emerald-800 bg-emerald-50 hidden sm:inline-block font-semibold">
                  ELITE COACH
                </span>
              </h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {hasActiveProblem && (
              <>
                <button
                  onClick={onExport}
                  title="Export Architectural Session Summary"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 rounded-md border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden md:inline">Export Notes</span>
                </button>
                <button
                  onClick={onReset}
                  title="New Problem Session"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md border border-slate-300 hover:border-rose-200 shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Problem</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Phase navigation bar */}
        {hasActiveProblem && (
          <div className="grid grid-cols-3 border-t border-slate-200 py-2.5 gap-2 text-xs sm:text-sm font-mono">
            {/* Phase 1 */}
            <button
              onClick={() => onSelectPhase(1)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left ${
                currentPhase === 1
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  1
                </span>
                <span className="font-semibold truncate">Pattern Breakdown</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase hidden sm:inline-block">Complete</span>
            </button>

            {/* Phase 2 */}
            <button
              onClick={() => {
                if (unlockedPhase >= 2) onSelectPhase(2);
              }}
              disabled={unlockedPhase < 2}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left ${
                currentPhase === 2
                  ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-semibold shadow-xs'
                  : unlockedPhase >= 2
                  ? 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    phase2Score !== null && phase2Score >= 80
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : unlockedPhase >= 2
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-200 text-slate-500 border border-slate-300'
                  }`}
                >
                  2
                </span>
                <span className="font-semibold truncate">Conceptual Quiz</span>
              </div>
              {phase2Score !== null ? (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    phase2Score >= 80
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {phase2Score}% {phase2Score >= 80 ? 'PASS' : 'RETRY'}
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 hidden sm:inline-block">Min 80% req</span>
              )}
            </button>

            {/* Phase 3 */}
            <button
              onClick={() => {
                if (unlockedPhase >= 3) onSelectPhase(3);
              }}
              disabled={unlockedPhase < 3}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left ${
                currentPhase === 3
                  ? 'border-rose-500 bg-rose-50/80 text-rose-950 font-semibold shadow-xs'
                  : unlockedPhase >= 3
                  ? 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    phase3Verdict === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : phase3Verdict
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : unlockedPhase >= 3
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-slate-200 text-slate-500 border border-slate-300'
                  }`}
                >
                  3
                </span>
                <span className="font-semibold truncate">Blunt Critique</span>
              </div>
              {phase3Verdict ? (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    phase3Verdict === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : phase3Verdict === 'REVISE'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {phase3Verdict}
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 hidden sm:inline-block">Code + Comments</span>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
