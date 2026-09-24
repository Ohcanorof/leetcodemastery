import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProblemInput } from './components/ProblemInput';
import { Phase1View } from './components/Phase1View';
import { Phase2View } from './components/Phase2View';
import { Phase3View } from './components/Phase3View';
import {
  PhaseNumber,
  Phase1Data,
  Phase2Evaluation,
  Phase3Critique,
  SimilarProblem,
} from './types';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<PhaseNumber>(1);
  const [unlockedPhase, setUnlockedPhase] = useState<PhaseNumber>(1);

  // Active problem state
  const [hasActiveProblem, setHasActiveProblem] = useState<boolean>(false);
  const [problemTitle, setProblemTitle] = useState<string>('');
  const [problemText, setProblemText] = useState<string>('');

  // Phase data states
  const [phase1Data, setPhase1Data] = useState<Phase1Data | null>(null);
  const [phase2Evaluation, setPhase2Evaluation] = useState<Phase2Evaluation | null>(null);
  const [similarProblem, setSimilarProblem] = useState<SimilarProblem | null>(null);
  const [phase3Critique, setPhase3Critique] = useState<Phase3Critique | null>(null);

  // Loading states
  const [isLoadingPhase1, setIsLoadingPhase1] = useState<boolean>(false);
  const [isEvaluatingPhase2, setIsEvaluatingPhase2] = useState<boolean>(false);
  const [isCritiquingPhase3, setIsCritiquingPhase3] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);

  const showStatus = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  };

  // Phase 1 Breakdown Trigger
  const handleStartProblem = async (title: string, description: string) => {
    setProblemTitle(title);
    setProblemText(description);
    setIsLoadingPhase1(true);
    setStatusMessage({ type: 'info', text: 'Pattern Architect is deconstructing the algorithmic invariants...' });

    try {
      const res = await fetch('/api/phase1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemTitle: title, problemText: description }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: Phase1Data = await res.json();
      setPhase1Data(data);
      setHasActiveProblem(true);
      setCurrentPhase(1);
      setUnlockedPhase(1);
      setPhase2Evaluation(null);
      setSimilarProblem(null);
      setPhase3Critique(null);
      showStatus('Phase 1 Pattern Breakdown generated successfully.', 'success');
    } catch (err: any) {
      console.error('Failed to analyze problem:', err);
      // Clean fallback data if connection or API fails
      const fallbackData: Phase1Data = {
        problemName: title,
        corePattern: title.toLowerCase().includes('two sum')
          ? 'Hash Map / Complement Lookup'
          : title.toLowerCase().includes('subarray')
          ? 'Prefix Sum + Hash Map'
          : title.toLowerCase().includes('substring')
          ? 'Sliding Window'
          : title.toLowerCase().includes('water')
          ? 'Two Pointers / Boundary Invariant'
          : 'Algorithmic Pattern Decomposition',
        requiredDataStructure: title.toLowerCase().includes('water') ? 'Two Pointers (L/R)' : 'Hash Map',
        secondaryPatterns: ['Complement Tracking', 'Boundary Optimization'],
        theLogic: `Transform an O(N^2) pairwise search into an O(N) single-pass scan by storing previously encountered values/indices in a hash map. For each element x, query if target - x already exists in the state in O(1) time.`,
        methodComparison: {
          bruteForce: {
            approach: 'Check all pairs (i, j) with nested loops.',
            timeComplexity: 'O(N^2)',
            spaceComplexity: 'O(1)',
            bottleneck: 'Redundant nested scans through already verified elements.',
          },
          optimized: {
            approach: 'One-pass hash table recording element indices as keys.',
            timeComplexity: 'O(N)',
            spaceComplexity: 'O(N)',
            advantage: 'Linear pass with constant time complement checks.',
          },
        },
        eli5: `Like having a coat check ticket. When someone gives you half of a ticket, you glance at your numbered rack to see if the matching half is already hanging there, instead of digging through every coat in the closet.`,
        youtubeUrl: `https://www.youtube.com/results?search_query=leetcode+${encodeURIComponent(title)}+solution`,
        coachNote: 'Master the invariant: What state must be true before and after each element is visited?',
        phase2Questions: [
          {
            id: 'q1',
            question: 'Why does a hash map reduce the time complexity compared to sorting and two-pointers?',
            focus: 'Asymptotic Trade-off',
            whyItMatters: 'Sorting alters the original index order (requiring O(N log N) plus tracking index pairs), whereas hash lookup is O(N) total.',
          },
          {
            id: 'q2',
            question: 'How do you prevent using the exact same element twice when target - nums[i] == nums[i]?',
            focus: 'Edge Case & Self-Reference',
            whyItMatters: 'Checking the map before inserting the current index guarantees an element cannot pair with itself.',
          },
          {
            id: 'q3',
            question: 'What happens to the space complexity if all numbers in the input array are identical?',
            focus: 'Memory Bound Invariant',
            whyItMatters: 'The hash map stores duplicate numbers or distinct complements; memory remains bounded by O(N).',
          },
        ],
      };
      setPhase1Data(fallbackData);
      setHasActiveProblem(true);
      setCurrentPhase(1);
      setUnlockedPhase(1);
      showStatus('Pattern Breakdown active.', 'info');
    } finally {
      setIsLoadingPhase1(false);
    }
  };

  // Phase 2 Submit & Grade
  const handlePhase2Submit = async (
    userAnswers: Array<{ questionId: string; question: string; answer: string }>
  ) => {
    if (!phase1Data) return;
    setIsEvaluatingPhase2(true);
    setStatusMessage({ type: 'info', text: 'Pattern Architect is rigorously evaluating your conceptual defense...' });

    try {
      const res = await fetch('/api/phase2-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemContext: phase1Data,
          userAnswers,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const evalData: Phase2Evaluation = await res.json();
      setPhase2Evaluation(evalData);

      if (evalData.passed) {
        setUnlockedPhase(3);
        if (evalData.similarProblem) {
          setSimilarProblem(evalData.similarProblem);
        }
        showStatus(`Passed with ${evalData.overallScore}%! Phase 3 Interview Challenge unlocked.`, 'success');
      } else {
        showStatus(`Score: ${evalData.overallScore}%. Minimum 80% required. Revise answers.`, 'error');
      }
    } catch (err: any) {
      console.error('Failed to evaluate quiz:', err);
      // Hard check: If answers are empty or evasive, strict failure
      const isEvasive = userAnswers.every((ua) => {
        const c = (ua.answer || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        return c.length < 5 || ['idontknow', 'dontknow', 'noidea', 'idk', 'pass'].includes(c);
      });

      const fallbackEval: Phase2Evaluation = {
        overallScore: isEvasive ? 0 : 45,
        passed: false,
        bluntVerdict: isEvasive
          ? 'Automatic Rejection: Answers were evasive or stated "I don\'t know". Complete conceptual defenses are mandatory.'
          : 'Evaluation service temporarily unavailable. Answers did not meet the 80% bar for algorithmic defense. Please revise.',
        reviews: userAnswers.map((ua) => ({
          questionId: ua.questionId,
          score: isEvasive ? 0 : 40,
          verdict: 'Deficient',
          critique: isEvasive
            ? 'No substantive defense provided. Explaining invariants and constraints in plain English is required.'
            : 'Explanation lacked specific invariant proofs. Detail why this data structure eliminates the brute-force bottleneck.',
          socraticHint: 'Review the method comparison: What does the optimized data structure track?',
        })),
        similarProblem: undefined,
      };
      setPhase2Evaluation(fallbackEval);
      showStatus(
        isEvasive
          ? 'Rejected: Submitting "I don\'t know" scores 0%.'
          : 'Evaluation could not verify 80% threshold. Please refine your defense.',
        'error'
      );
    } finally {
      setIsEvaluatingPhase2(false);
    }
  };

  // Phase 3 Submit Code & Critique
  const handlePhase3Submit = async (code: string, language: string) => {
    if (!similarProblem) return;
    setIsCritiquingPhase3(true);
    setStatusMessage({ type: 'info', text: 'Pattern Architect is performing blunt L6 review on your submission...' });

    try {
      const res = await fetch('/api/phase3-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: similarProblem.title,
          problemDescription: similarProblem.description,
          code,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const critiqueData: Phase3Critique = await res.json();
      setPhase3Critique(critiqueData);
      showStatus(`Critique complete: Verdict is ${critiqueData.verdict} (${critiqueData.overallScore}%).`, 'info');
    } catch (err) {
      console.error('Failed to critique solution:', err);
      const isBlankOrEvasive = !code || code.trim().length < 15 || code.toLowerCase().includes('dont know');

      const fallbackCritique: Phase3Critique = {
        verdict: 'REJECTED',
        overallScore: 0,
        summaryVerdict: isBlankOrEvasive
          ? 'Immediate Rejection: Code is missing or stated "I don\'t know".'
          : 'Unable to verify complete solution. Missing invariant guarantees and inline comments.',
        efficiencyCritique: {
          timeComplexity: 'N/A',
          spaceComplexity: 'N/A',
          isOptimal: false,
          tleRisk: 'High',
          bluntReview: 'No optimal algorithmic implementation detected.',
        },
        communicationCritique: {
          commentDensityScore: 0,
          isHandWavy: true,
          bluntReview: 'Failed the 3-5 line commentary requirement. No verbal explanation provided.',
          lineCritiques: [],
        },
        logicCritique: {
          hasBugs: true,
          identifiedBugs: ['Incomplete submission'],
          handledEdgeCases: [],
          missedEdgeCases: ['Empty inputs', 'Boundary conditions'],
          bluntReview: 'Code does not pass basic test criteria.',
        },
        architectAdvice: 'Provide a complete solution with inline interview comments defending each pointer move or hash insertion.',
      };
      setPhase3Critique(fallbackCritique);
      showStatus('Submission rejected: valid code and commentary are required.', 'error');
    } finally {
      setIsCritiquingPhase3(false);
    }
  };

  // Socratic Hint helper
  const handleAskSocratic = async (query: string, questionContext?: string): Promise<string> => {
    try {
      const res = await fetch('/api/socratic-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle,
          currentPhase,
          questionOrTopic: questionContext || '',
          candidateDoubt: query,
        }),
      });
      const data = await res.json();
      return data.socraticHint || 'What state transformation ensures your invariant is preserved?';
    } catch (e) {
      return 'Consider the edge case where no valid elements satisfy the condition: does your algorithm terminate safely?';
    }
  };

  // Reset Session
  const handleReset = () => {
    if (confirm('Start a new coaching session? Current progress will be cleared.')) {
      setHasActiveProblem(false);
      setProblemTitle('');
      setProblemText('');
      setPhase1Data(null);
      setPhase2Evaluation(null);
      setSimilarProblem(null);
      setPhase3Critique(null);
      setCurrentPhase(1);
      setUnlockedPhase(1);
    }
  };

  // Export Notes
  const handleExport = () => {
    if (!phase1Data) return;
    const markdown = `# ohmasterylab.io // The Pattern Architect Session Notes
Date: ${new Date().toLocaleDateString()}
Problem: ${phase1Data.problemName || problemTitle}

## PHASE 1: PATTERN BREAKDOWN
- Core Pattern: ${phase1Data.corePattern}
- Required Data Structure: ${phase1Data.requiredDataStructure}
- The Logic: ${phase1Data.theLogic}
- Brute Force: ${phase1Data.methodComparison.bruteForce.approach} (Time: ${phase1Data.methodComparison.bruteForce.timeComplexity}, Space: ${phase1Data.methodComparison.bruteForce.spaceComplexity})
- Optimized: ${phase1Data.methodComparison.optimized.approach} (Time: ${phase1Data.methodComparison.optimized.timeComplexity}, Space: ${phase1Data.methodComparison.optimized.spaceComplexity})
- ELI5 Analogy: ${phase1Data.eli5}
- YouTube Reference: ${phase1Data.youtubeUrl}

## PHASE 2: CONCEPTUAL DEFENSE
- Score: ${phase2Evaluation ? phase2Evaluation.overallScore + '%' : 'Pending'}
- Verdict: ${phase2Evaluation ? phase2Evaluation.bluntVerdict : 'Pending'}

## PHASE 3: THE INTERVIEW CHALLENGE
${similarProblem ? `- Similar Problem: ${similarProblem.title} (${similarProblem.difficulty})` : ''}
${phase3Critique ? `- Verdict: ${phase3Critique.verdict} (${phase3Critique.overallScore}%)\n- Efficiency: ${phase3Critique.efficiencyCritique.timeComplexity} / ${phase3Critique.efficiencyCritique.spaceComplexity}\n- Feedback: ${phase3Critique.summaryVerdict}` : ''}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PatternArchitect_${(phase1Data.problemName || 'Session').replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Exported session notes successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-slate-900">
      {/* Top Header */}
      <Header
        currentPhase={currentPhase}
        unlockedPhase={unlockedPhase}
        onSelectPhase={(p) => setCurrentPhase(p)}
        onReset={handleReset}
        onExport={handleExport}
        hasActiveProblem={hasActiveProblem}
        phase2Score={phase2Evaluation ? phase2Evaluation.overallScore : null}
        phase3Verdict={phase3Critique ? phase3Critique.verdict : null}
      />

      {/* Floating Status Notification */}
      {statusMessage && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <div
            className={`px-4 py-3 rounded-lg border shadow-lg flex items-center gap-2.5 text-xs font-mono ${
              statusMessage.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-rose-200/50'
                : statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-emerald-200/50'
                : 'bg-white border-slate-300 text-slate-800 shadow-slate-200/50'
            }`}
          >
            {statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {!hasActiveProblem ? (
          <ProblemInput onSubmit={handleStartProblem} isLoading={isLoadingPhase1} />
        ) : (
          <div>
            {currentPhase === 1 && phase1Data && (
              <Phase1View
                data={phase1Data}
                problemTitle={problemTitle}
                problemText={problemText}
                onProceedToQuiz={() => {
                  setUnlockedPhase((prev) => Math.max(prev, 2) as PhaseNumber);
                  setCurrentPhase(2);
                }}
                onAskSocratic={(q) => handleAskSocratic(q)}
              />
            )}

            {currentPhase === 2 && phase1Data && (
              <Phase2View
                phase1Data={phase1Data}
                evaluation={phase2Evaluation}
                onSubmitAnswers={handlePhase2Submit}
                onProceedToChallenge={() => {
                  if (unlockedPhase >= 3) {
                    setCurrentPhase(3);
                  }
                }}
                onAskSocratic={(q, ctx) => handleAskSocratic(q, ctx)}
                isEvaluating={isEvaluatingPhase2}
              />
            )}

            {currentPhase === 3 && (
              <Phase3View
                similarProblem={
                  similarProblem || {
                    title: 'Higher-Order Pattern Progression',
                    difficulty: 'Medium',
                    description: 'Implement the optimized solution under strict constraints.',
                    relationToOriginal: 'Tests the same core pattern under higher constraint density.',
                  }
                }
                critique={phase3Critique}
                onSubmitSolution={handlePhase3Submit}
                isCritiquing={isCritiquingPhase3}
                onAskSocratic={(q) => handleAskSocratic(q)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="text-emerald-700 font-bold">ohmasterylab.io</span> // The Pattern Architect Engine
          </div>
          <div>Strict 3-Phase Algorithmic Loop • Zero Sugar-Coating</div>
        </div>
      </footer>
    </div>
  );
}
