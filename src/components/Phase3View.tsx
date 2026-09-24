import React, { useState, useMemo } from 'react';
import { SimilarProblem, Phase3Critique } from '../types';
import {
  Code2,
  Cpu,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Zap,
  Send,
} from 'lucide-react';

interface Phase3ViewProps {
  similarProblem: SimilarProblem;
  critique: Phase3Critique | null;
  onSubmitSolution: (code: string, language: string) => Promise<void>;
  isCritiquing: boolean;
  onAskSocratic: (query: string) => Promise<string>;
}

export const Phase3View: React.FC<Phase3ViewProps> = ({
  similarProblem,
  critique,
  onSubmitSolution,
  isCritiquing,
  onAskSocratic,
}) => {
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>(
    similarProblem.startingBoilerplate ||
      `class Solution:
    def solve(self, nums: list[int]) -> int:
        # INTERVIEW COMMENT: Validate empty input edge case
        if not nums:
            return 0
            
        # INTERVIEW COMMENT: Initialize hash map to track prefix frequencies
        # Key: prefix sum, Value: frequency of occurrence
        prefix_counts = {0: 1}
        current_sum = 0
        total_valid = 0
        
        # INTERVIEW COMMENT: Iterate through array maintaining running invariant
        for num in nums:
            current_sum += num
            
            # INTERVIEW COMMENT: Check if (current_sum - k) exists in history
            # This confirms a continuous subarray ending at current index sums to k
            
        return total_valid`
  );

  const [socraticQuery, setSocraticQuery] = useState('');
  const [socraticReply, setSocraticReply] = useState<string | null>(null);
  const [isAskingSocratic, setIsAskingSocratic] = useState(false);

  // Live comment density calculation
  const commentStats = useMemo(() => {
    const lines = code.split('\n');
    const totalLines = lines.filter((l) => l.trim().length > 0).length;
    const commentLines = lines.filter((l) => {
      const trimmed = l.trim();
      return (
        trimmed.startsWith('//') ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*')
      );
    }).length;

    const ratio = totalLines > 0 ? (commentLines / totalLines) * 100 : 0;
    const frequency = commentLines > 0 ? Math.round(totalLines / commentLines) : 999;
    const isAdequate = frequency >= 2 && frequency <= 5;

    return { totalLines, commentLines, ratio: Math.round(ratio), frequency, isAdequate };
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isCritiquing) return;
    onSubmitSolution(code, language);
  };

  const insertCommentAnchor = () => {
    const prefix = language === 'python' ? '# INTERVIEW COMMENT: ' : '// INTERVIEW COMMENT: ';
    setCode((prev) => `${prev}\n        ${prefix}Explain architectural invariant and why this operation is required...`);
  };

  const handleAskSocratic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socraticQuery.trim() || isAskingSocratic) return;
    setIsAskingSocratic(true);
    try {
      const reply = await onAskSocratic(socraticQuery);
      setSocraticReply(reply);
    } catch (err) {
      setSocraticReply('What invariant must be maintained when duplicate elements or boundary zeros appear?');
    } finally {
      setIsAskingSocratic(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Phase Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-700 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>PHASE 3 // THE INTERVIEW CHALLENGE & BLUNT CRITIQUE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Code + Interview Commentary
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 shadow-2xs">
            Target: <span className="text-emerald-700 font-bold">{similarProblem.title}</span>
          </span>
          <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold">
            {similarProblem.difficulty}
          </span>
        </div>
      </div>

      {/* Challenge Description Card */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>Challenge Problem: {similarProblem.title}</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Similar Pattern Progression
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
          {similarProblem.description}
        </div>

        <div className="text-xs font-mono text-emerald-900 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
          <span className="font-bold text-emerald-800">Relation to Original Pattern: </span>
          {similarProblem.relationToOriginal}
        </div>
      </div>

      {/* Strict Requirement Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono text-amber-950 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-800">DEMAND CODE + INTERVIEW COMMENTARY:</span>
          <p className="text-slate-700 leading-relaxed">
            You must provide the solution code <strong>AND</strong> include inline interview comments every <strong>3-5 lines</strong>.
            Explain the logic as if speaking out loud to an L6 FAANG interviewer. Submitting empty code, "I don't know", or hand-wavy placeholders will be rejected (0%).
          </p>
        </div>
      </div>

      {/* Live Commentary Density Monitor */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700 font-semibold">Commentary Density:</span>
          <span
            className={`px-2.5 py-0.5 rounded font-bold ${
              commentStats.isAdequate
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {commentStats.commentLines} comments / {commentStats.totalLines} lines (1 comment per {commentStats.frequency} lines)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={insertCommentAnchor}
            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold transition-colors shadow-2xs"
          >
            + Insert Comment Anchor
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-slate-300 bg-white overflow-hidden shadow-sm">
          {/* Editor Top Bar */}
          <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-mono font-bold text-slate-800">
                Solution Code & Verbal Transcript
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] font-mono text-slate-600 font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
              >
                <option value="python">Python 3</option>
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
              </select>
            </div>
          </div>

          {/* Textarea Editor */}
          <div className="relative">
            <textarea
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write complete solution with inline interview comments every 3-5 lines..."
              className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm focus:outline-none transition-colors resize-y leading-relaxed border-0"
              spellCheck={false}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>The coach will analyze Efficiency, Communication, and Logic with zero sugar-coating.</span>
          </div>

          <button
            type="submit"
            disabled={isCritiquing || !code.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs sm:text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isCritiquing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Blunt L6 Critique...</span>
              </>
            ) : (
              <>
                <span>Submit Solution for Blunt Critique</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* The Blunt Critique Output */}
      {critique && (
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-6">
          {/* Top Verdict Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono font-black text-xl border ${
                  critique.verdict === 'ACCEPTED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : critique.verdict === 'REVISE'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                {critique.overallScore}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono px-2.5 py-0.5 rounded font-black tracking-wider uppercase ${
                      critique.verdict === 'ACCEPTED'
                        ? 'bg-emerald-600 text-white'
                        : critique.verdict === 'REVISE'
                        ? 'bg-amber-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    VERDICT: {critique.verdict}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {critique.summaryVerdict}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-500 self-start sm:self-auto">
              Pattern Architect Review • ohmasterylab.io
            </div>
          </div>

          {/* Tri-Pillar Critique Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Efficiency Critique */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                    1. EFFICIENCY CRITIQUE
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      critique.efficiencyCritique.isOptimal
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {critique.efficiencyCritique.isOptimal ? 'Optimal' : 'Suboptimal'}
                  </span>
                </div>

                <div className="text-xs font-mono space-y-1 mb-2">
                  <div className="text-slate-700">
                    Time: <span className="text-emerald-700 font-bold">{critique.efficiencyCritique.timeComplexity}</span>
                  </div>
                  <div className="text-slate-700">
                    Space: <span className="text-emerald-700 font-bold">{critique.efficiencyCritique.spaceComplexity}</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    TLE Risk: <span className="text-amber-700 font-semibold">{critique.efficiencyCritique.tleRisk}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  "{critique.efficiencyCritique.bluntReview}"
                </p>
              </div>
            </div>

            {/* 2. Communication Critique */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-800 uppercase">
                    2. COMMUNICATION CRITIQUE
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      !critique.communicationCritique.isHandWavy
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {critique.communicationCritique.isHandWavy ? 'Hand-Wavy' : 'Articulate'}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-700 mb-2">
                  Comment Quality Score: <span className="font-bold text-amber-700">{critique.communicationCritique.commentDensityScore}%</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  "{critique.communicationCritique.bluntReview}"
                </p>
              </div>

              {critique.communicationCritique.lineCritiques &&
                critique.communicationCritique.lineCritiques.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                      Line Critiques:
                    </span>
                    {critique.communicationCritique.lineCritiques.slice(0, 2).map((lc, i) => (
                      <div key={i} className="text-[11px] font-mono text-slate-700 bg-white p-1.5 rounded border border-slate-200">
                        <span className="font-bold text-amber-800">{lc.lineOrSection}: </span>
                        {lc.feedback}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* 3. Logic & Bugs Critique */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-rose-800 uppercase">
                    3. LOGIC & BUGS CRITIQUE
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      !critique.logicCritique.hasBugs
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {critique.logicCritique.hasBugs ? 'Bugs Found' : 'Bug-Free'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  "{critique.logicCritique.bluntReview}"
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono">
                {critique.logicCritique.missedEdgeCases.length > 0 && (
                  <div className="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
                    <span className="font-bold">Missed Edge Cases: </span>
                    {critique.logicCritique.missedEdgeCases.join(', ')}
                  </div>
                )}
                {critique.logicCritique.handledEdgeCases.length > 0 && (
                  <div className="p-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <span className="font-bold">Handled: </span>
                    {critique.logicCritique.handledEdgeCases.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coach's Architectural Directive */}
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs font-mono text-emerald-950">
            <span className="text-emerald-800 font-bold block mb-1 uppercase tracking-wider">
              ARCHITECT'S FINAL DIRECTIVE:
            </span>
            <p className="leading-relaxed">
              {critique.architectAdvice}
            </p>
          </div>
        </div>
      )}

      {/* Socratic Assistant in Phase 3 */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs font-mono shadow-xs">
        <div className="flex items-center gap-2 text-slate-700 mb-2 font-bold">
          <HelpCircle className="w-4 h-4 text-rose-600" />
          <span>STUCK ON AN EDGE CASE OR TIME COMPLEXITY? (SOCRATIC COACH)</span>
        </div>
        <p className="text-slate-600 mb-3">
          Ask a targeted architectural question. The coach will test your reasoning without writing the code.
        </p>

        <form onSubmit={handleAskSocratic} className="flex gap-2">
          <input
            type="text"
            value={socraticQuery}
            onChange={(e) => setSocraticQuery(e.target.value)}
            placeholder="e.g. How can I avoid duplicate triplets in 3Sum without using an O(N) hash set lookup?"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isAskingSocratic || !socraticQuery.trim()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold rounded-lg disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {isAskingSocratic ? 'Thinking...' : 'Ask Coach'}
          </button>
        </form>

        {socraticReply && (
          <div className="p-3 mt-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 leading-relaxed">
            <span className="text-amber-800 font-bold block mb-1">SOCRATIC ARCHITECT:</span>
            {socraticReply}
          </div>
        )}
      </div>
    </div>
  );
};
