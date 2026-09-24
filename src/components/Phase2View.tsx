import React, { useState } from 'react';
import { Phase1Data, Phase2Evaluation, Phase2Question } from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Send,
  HelpCircle,
  Unlock,
  AlertTriangle,
} from 'lucide-react';

interface Phase2ViewProps {
  phase1Data: Phase1Data;
  evaluation: Phase2Evaluation | null;
  onSubmitAnswers: (answers: Array<{ questionId: string; question: string; answer: string }>) => Promise<void>;
  onProceedToChallenge: () => void;
  onAskSocratic: (query: string, questionContext?: string) => Promise<string>;
  isEvaluating: boolean;
}

export const Phase2View: React.FC<Phase2ViewProps> = ({
  phase1Data,
  evaluation,
  onSubmitAnswers,
  onProceedToChallenge,
  onAskSocratic,
  isEvaluating,
}) => {
  const questions: Phase2Question[] = phase1Data.phase2Questions || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [socraticQuery, setSocraticQuery] = useState('');
  const [socraticResponse, setSocraticResponse] = useState<string | null>(null);
  const [isAskingSocratic, setIsAskingSocratic] = useState(false);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
    if (validationWarning) setValidationWarning(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user has answered all questions with substantive content
    const unAnswered = questions.some((q) => !answers[q.id] || answers[q.id].trim().length < 5);
    const hasTrivialAnswer = questions.some((q) => {
      const clean = (answers[q.id] || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      return ['idontknow', 'dontknow', 'noidea', 'idk', 'pass', 'na'].includes(clean);
    });

    if (unAnswered || hasTrivialAnswer) {
      setValidationWarning('Warning: The coach will reject non-substantive or "I don\'t know" responses with a failing score (0%). Please formulate genuine architectural defenses.');
    }

    const formatted = questions.map((q) => ({
      questionId: q.id,
      question: q.question,
      answer: answers[q.id] || '',
    }));
    onSubmitAnswers(formatted);
  };

  const handleSocraticAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socraticQuery.trim() || isAskingSocratic) return;
    setIsAskingSocratic(true);
    try {
      const response = await onAskSocratic(socraticQuery);
      setSocraticResponse(response);
    } catch (err) {
      setSocraticResponse('Consider the state transitions: does your invariant hold when boundaries are empty or duplicated?');
    } finally {
      setIsAskingSocratic(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>PHASE 2 // THE CONCEPTUAL QUIZ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Defend the Architecture
          </h2>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 shadow-2xs">
          Target Pattern: <span className="text-emerald-700 font-bold">{phase1Data.corePattern}</span>
        </div>
      </div>

      {/* Strict Guardrail Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-950 flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-800">STRICT COACHING GUARDRAIL:</span>
          <p className="text-slate-700 leading-relaxed">
            DO NOT write code. Defend the architectural "Why", invariant guarantees, and edge case behaviors in plain English.
            You must score <strong>≥80%</strong> to unlock Phase 3. Submissions with evasive answers, hand-waving, or "I don't know" are strictly failed.
          </p>
        </div>
      </div>

      {/* Validation Warning Alert */}
      {validationWarning && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800 flex items-center gap-2 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationWarning}</span>
        </div>
      )}

      {/* Evaluation Results (If Available) */}
      {evaluation && (
        <div
          className={`p-6 rounded-xl border shadow-sm transition-all ${
            evaluation.passed
              ? 'bg-emerald-50/60 border-emerald-300'
              : 'bg-rose-50/60 border-rose-300'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-lg border ${
                  evaluation.passed
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                {evaluation.overallScore}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      evaluation.passed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {evaluation.passed ? 'PASSED — PHASE 3 UNLOCKED' : 'DEFICIENT — REVISION REQUIRED'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {evaluation.bluntVerdict}
                </p>
              </div>
            </div>

            {evaluation.passed ? (
              <button
                onClick={onProceedToChallenge}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Advance to Phase 3: The Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-mono text-rose-700 font-medium">
                Score must reach 80% to proceed. Review critiques below and revise your answers.
              </div>
            )}
          </div>

          {/* Question-by-Question Review Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-slate-600 uppercase tracking-wider font-bold">
              Detailed Architectural Scrutiny:
            </h4>

            {evaluation.reviews?.map((rev, index) => {
              const originalQ = questions.find((q) => q.id === rev.questionId);
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white border border-slate-200 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      Question {index + 1}: {originalQ?.focus || 'Core Invariant'}
                    </span>
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                        rev.score >= 80
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {rev.score}% // {rev.verdict}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">
                    {originalQ?.question}
                  </p>

                  <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                    <span className="text-slate-500 font-bold block mb-0.5">Your Response:</span>
                    {answers[rev.questionId] || '[Blank]'}
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed pt-1">
                    <span className="font-bold text-slate-900">Coach Critique: </span>
                    {rev.critique}
                  </div>

                  {rev.socraticHint && rev.score < 80 && (
                    <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900 mt-2">
                      <span className="font-bold text-amber-800">Socratic Nudge: </span>
                      {rev.socraticHint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quiz Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-700">
                  QUESTION {index + 1} // {q.focus}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  No Code Allowed
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {q.question}
              </h3>

              <p className="text-xs text-slate-500 italic">
                Why this matters: {q.whyItMatters}
              </p>

              <div>
                <textarea
                  rows={3}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Defend your architectural reasoning: explain invariants, constraints, and why alternative structures fail..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors leading-relaxed"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-slate-500">
            Target Bar: 80% passing accuracy required to unlock Phase 3.
          </div>

          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Invariant Defense...</span>
              </>
            ) : (
              <>
                <span>Submit Defense for Grading</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Socratic Helper Box in Phase 2 */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-700 mb-2 font-bold">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>NEED A SOCRATIC HINT FOR A QUESTION?</span>
        </div>
        <p className="text-slate-600 mb-3">
          If you are unsure how to articulate an invariant or edge case, ask the coach for a conceptual nudge.
        </p>

        <form onSubmit={handleSocraticAsk} className="flex gap-2">
          <input
            type="text"
            value={socraticQuery}
            onChange={(e) => setSocraticQuery(e.target.value)}
            placeholder="e.g. What goes wrong if we don't offset the prefix sum dictionary index?"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isAskingSocratic || !socraticQuery.trim()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {isAskingSocratic ? 'Thinking...' : 'Ask Hint'}
          </button>
        </form>

        {socraticResponse && (
          <div className="p-3 mt-3 rounded bg-amber-50 border border-amber-200 text-amber-950 leading-relaxed">
            <span className="text-amber-800 font-bold block mb-1">SOCRATIC ARCHITECT:</span>
            {socraticResponse}
          </div>
        )}
      </div>
    </div>
  );
};
