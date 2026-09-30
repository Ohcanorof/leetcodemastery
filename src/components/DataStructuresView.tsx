import React, { useState } from 'react';
import {
  DATA_STRUCTURES_DATA,
  DataStructureDetail,
  QuizQuestion,
} from '../data/dataStructuresData';
import {
  Layers,
  BookOpen,
  Cpu,
  Globe,
  Code2,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Zap,
  Scale,
  Copy,
  Check,
  AlertTriangle,
  BookmarkCheck,
  Terminal,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  SCRATCH_CODE_DATABASE,
} from '../data/scratchCodeData';
import {
  INTERVIEW_MASTERY_DATABASE,
} from '../data/interviewMasteryData';

interface DataStructuresViewProps {
  onGoToLeetCode: (problemTitle?: string, problemDescription?: string) => void;
  onOpenDisclaimer?: () => void;
}

export const DataStructuresView: React.FC<DataStructuresViewProps> = ({
  onGoToLeetCode,
  onOpenDisclaimer,
}) => {
  const [selectedId, setSelectedId] = useState<string>('arrays');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'traps' | 'realworld' | 'leetcode' | 'code' | 'quiz'
  >('overview');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');
  const [codeMode, setCodeMode] = useState<'scratch' | 'stdlib'>('scratch');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Interactive Quiz state per question
  const [userQuizAnswers, setUserQuizAnswers] = useState<
    Record<string, number | null>
  >({});
  const [showQuizExplanations, setShowQuizExplanations] = useState<
    Record<string, boolean>
  >({});

  const currentDS: DataStructureDetail =
    DATA_STRUCTURES_DATA.find((ds) => ds.id === selectedId) ||
    DATA_STRUCTURES_DATA[0];

  const masteryData = INTERVIEW_MASTERY_DATABASE[currentDS.id] || INTERVIEW_MASTERY_DATABASE['arrays'];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setShowQuizExplanations((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleResetQuiz = () => {
    const newAnswers = { ...userQuizAnswers };
    const newExplanations = { ...showQuizExplanations };
    currentDS.quiz.forEach((q) => {
      delete newAnswers[q.id];
      delete newExplanations[q.id];
    });
    setUserQuizAnswers(newAnswers);
    setShowQuizExplanations(newExplanations);
  };

  const quizScore = currentDS.quiz.reduce((score, q) => {
    return userQuizAnswers[q.id] === q.correctIndex ? score + 1 : score;
  }, 0);
  const totalQuestions = currentDS.quiz.length;
  const answeredCount = currentDS.quiz.filter(
    (q) => userQuizAnswers[q.id] !== undefined && userQuizAnswers[q.id] !== null
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded border border-emerald-300 uppercase">
              Stage 1 • Foundations & Cheat Sheets
            </span>
            <span className="text-xs font-mono text-slate-500">
              ohmasterylab.io Core Curriculum
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Master the Data Structures (The Basics)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Physical RAM mechanics, when to use vs avoid, fatal interview traps, language standard libraries,
            scratch implementations, and self-testing quizzes.
          </p>
        </div>

        <button
          onClick={() => onGoToLeetCode()}
          className="shrink-0 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto group"
        >
          <span>Skip to LeetCode Portion</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Container: Exact layout from user's drawing (Left clickable menu | Right content) */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[750px]">
        {/* Left Column: Data Structures Menu */}
        <aside className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r-2 md:border-slate-300 bg-slate-50/70 shrink-0 flex flex-col">
          {/* Menu Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-wider">
                Data Structures
              </h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold">
              {DATA_STRUCTURES_DATA.length} Available
            </span>
          </div>

          {/* Clickable List of Data Structures */}
          <nav className="p-2 space-y-1 overflow-y-auto flex-1 max-h-[400px] md:max-h-[calc(100vh-280px)]">
            {DATA_STRUCTURES_DATA.map((ds, index) => {
              const isSelected = ds.id === selectedId;
              const numStr = (index + 1).toString().padStart(2, '0');

              return (
                <button
                  key={ds.id}
                  onClick={() => {
                    setSelectedId(ds.id);
                    setActiveTab('overview');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? 'bg-emerald-700 text-emerald-100'
                          : 'bg-white border border-slate-200 text-slate-500'
                      }`}
                    >
                      {numStr}
                    </span>
                    <span className="truncate">{ds.name}</span>
                  </div>

                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ml-1 ${
                      isSelected
                        ? 'bg-emerald-700/60 text-emerald-100'
                        : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    {ds.category}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Quick Notice at bottom of menu */}
          <div className="p-3 border-t border-slate-200 bg-slate-100/50 text-[11px] text-slate-500 font-mono">
            <span>✨ Free access • No accounts • Nothing locked</span>
          </div>
        </aside>

        {/* Right Column: Rest of the content depending on the data structure chosen */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 bg-white flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            {/* Header of Selected Data Structure */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded font-semibold uppercase">
                      {currentDS.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-700 font-bold">
                      Fundamental Invariant
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {currentDS.name}
                  </h2>
                </div>

                {/* Visual Video Search Link */}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    currentDS.youtubeQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Watch Visual Animations on YouTube"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-mono font-bold transition-colors shadow-2xs self-start sm:self-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
                  <span>Visual Video Search</span>
                </a>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-700 italic border-l-2 border-emerald-500 pl-3 py-0.5 mb-3">
                "{currentDS.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentDS.description}
              </p>

              {/* Navigation Tabs for Modules (Expanded to 6 Intuitive Tabs) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-2.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>1. Mechanics</span>
                </button>

                <button
                  onClick={() => setActiveTab('traps')}
                  className={`px-2.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'traps'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>2. Traps & Rules</span>
                </button>

                <button
                  onClick={() => setActiveTab('realworld')}
                  className={`px-2.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'realworld'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>3. Real-World</span>
                </button>

                <button
                  onClick={() => setActiveTab('leetcode')}
                  className={`px-2.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'leetcode'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>4. LeetCode</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-2.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'code'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>5. Code & StdLib</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-2.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'quiz'
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>6. Self Quiz</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Mechanics & Hardware Memory Layout */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                      Physical Hardware & Memory Model
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="text-[11px] font-mono text-slate-500 uppercase">
                        RAM Layout
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {currentDS.memoryModel.layout}
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="text-[11px] font-mono text-slate-500 uppercase">
                        CPU Cache Locality
                      </div>
                      <div
                        className={`text-xs font-bold mt-1 ${
                          currentDS.memoryModel.cacheLocality.includes('High')
                            ? 'text-emerald-700'
                            : currentDS.memoryModel.cacheLocality.includes('Moderate')
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {currentDS.memoryModel.cacheLocality}
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                      <div className="text-[11px] font-mono text-slate-500 uppercase">
                        Pointer Overhead
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {currentDS.memoryModel.pointerOverhead}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                    {currentDS.memoryModel.explanation}
                  </p>
                </div>

                {/* Big-O Complexity Table */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                        Asymptotic Time & Space Complexity
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Average vs. Worst Case
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/60">
                          <th className="py-2.5 px-3 font-bold">Operation</th>
                          <th className="py-2.5 px-3 font-bold">Average</th>
                          <th className="py-2.5 px-3 font-bold">Worst Case</th>
                          <th className="py-2.5 px-3 font-bold">Architectural Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentDS.complexity.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {c.operation}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-emerald-700">
                              {c.average}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-700">
                              {c.worst}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{c.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Traps & Decision Matrix (NEW) */}
            {activeTab === 'traps' && (
              <div className="space-y-6">
                {/* Decision Matrix: When to Use vs When Not to Use */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* When To Use */}
                  <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-mono font-bold text-xs uppercase tracking-wider">
                      <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                      <span>When To Use This Structure</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {masteryData.decisionMatrix.whenToUse.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* When NOT To Use */}
                  <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-rose-900 font-mono font-bold text-xs uppercase tracking-wider">
                      <XCircle className="w-4 h-4 text-rose-700" />
                      <span>When NOT To Use (Red Flags)</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {masteryData.decisionMatrix.whenNotToUse.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Top 3 Fatal Interview Traps */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                        Top 3 Fatal Interview Traps for {currentDS.shortName}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Common Submission Killers
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {masteryData.decisionMatrix.fatalTraps.map((trap, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex items-start gap-2 text-rose-900 font-bold text-xs sm:text-sm">
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-mono font-bold border border-rose-300">
                            Trap #{idx + 1}
                          </span>
                          <span>{trap.trap}</span>
                        </div>

                        <div className="pl-6 space-y-1.5 text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-800">Why candidates fail it: </span>
                            {trap.whyItHappens}
                          </div>
                          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 font-medium font-mono text-[11px]">
                            💡 <span className="font-bold">Architect Fix: </span>
                            {trap.howToFix}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Real-World Applications */}
            {activeTab === 'realworld' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                    How {currentDS.name} Powers Real-World Industrial Systems
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-4">
                  These exact abstractions power production databases, operating systems, and distributed platforms:
                </p>

                <div className="grid grid-cols-1 gap-3.5">
                  {currentDS.realWorldApplications.map((app, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {app.title}
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto font-semibold">
                          {app.domain}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {app.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: LeetCode Benchmarks */}
            {activeTab === 'leetcode' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                      LeetCode Benchmark Problems Driven by {currentDS.shortName}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Click to launch into Pattern Architect
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-4">
                  These classic problems test whether you can recognize when this data structure
                  converts a naive scan into optimal linear or logarithmic execution.
                </p>

                <div className="space-y-3">
                  {currentDS.leetcodeBenchmarks.map((bench) => (
                    <div
                      key={bench.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {bench.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              bench.difficulty === 'Hard'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : bench.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {bench.difficulty}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-emerald-700 font-medium">
                          Pattern: {bench.pattern}
                        </div>
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">Why this structure: </span>
                          {bench.whyThisStructure}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          onGoToLeetCode(
                            bench.title,
                            `Problem: ${bench.title}\nPattern Focus: ${bench.pattern}\nWhy this structure: ${bench.whyThisStructure}`
                          )
                        }
                        className="shrink-0 px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-300 hover:border-emerald-400 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs transition-colors self-start sm:self-auto"
                      >
                        <span>Study in Coach</span>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Code & StdLib Reference (NEW Dual-Mode) */}
            {activeTab === 'code' && (() => {
              const structCode = SCRATCH_CODE_DATABASE[currentDS.id];
              const codeSnippet =
                structCode?.snippets[selectedLanguage] ||
                currentDS.scratchImplementation.code;
              const keyTakeaway =
                structCode?.keyTakeaway ||
                currentDS.scratchImplementation.keyTakeaway;

              const stdlib = masteryData.stdlibGuide[selectedLanguage];

              const handleCopy = (text: string) => {
                navigator.clipboard.writeText(text);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              };

              return (
                <div className="space-y-4">
                  {/* Mode Switcher: Scratch Code vs Standard Library */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono">
                      <button
                        onClick={() => setCodeMode('scratch')}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          codeMode === 'scratch'
                            ? 'bg-white text-slate-900 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Scratch Implementation</span>
                      </button>

                      <button
                        onClick={() => setCodeMode('stdlib')}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          codeMode === 'stdlib'
                            ? 'bg-white text-emerald-900 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Standard Library Cheat Sheet</span>
                      </button>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      {codeMode === 'scratch' ? 'Deep Mental Model' : 'Real Interview Syntax'}
                    </span>
                  </div>

                  {/* Language Selector Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-mono font-semibold text-slate-500 px-2">
                      Language:
                    </span>
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = selectedLanguage === lang.id;
                      return (
                        <button
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{lang.label}</span>
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                              isSelected
                                ? 'bg-slate-700 text-slate-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {lang.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* MODE 1: Scratch Implementation */}
                  {codeMode === 'scratch' && (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium leading-relaxed">
                        💡 <span className="font-bold">Architect Invariant: </span>
                        {keyTakeaway}
                      </div>

                      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                            <span className="text-slate-400 text-[11px] ml-2">
                              {currentDS.shortName} • {SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage)?.label}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopy(codeSnippet)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-4 bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed max-h-[520px]">
                          <code>{codeSnippet}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* MODE 2: Standard Library Reference (NEW) */}
                  {codeMode === 'stdlib' && (
                    <div className="space-y-4">
                      {/* Crucial Standard Library Gotcha Warning Banner */}
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-900 uppercase tracking-wider font-mono text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Standard Library Interview Gotcha ({SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage)?.label})</span>
                        </div>
                        <p className="leading-relaxed font-sans">{stdlib.gotchaWarning}</p>
                      </div>

                      {/* Imports & Declarations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-xs">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">
                            Import Statement
                          </span>
                          <pre className="p-2.5 bg-slate-900 text-emerald-300 rounded-lg overflow-x-auto">
                            <code>{stdlib.importStmt}</code>
                          </pre>
                        </div>

                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-xs">
                          <span className="text-[11px] font-bold text-slate-500 uppercase">
                            Initialization / Declaration
                          </span>
                          <pre className="p-2.5 bg-slate-900 text-emerald-300 rounded-lg overflow-x-auto">
                            <code>{stdlib.declaration}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Common Built-in Operations */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                            Common Standard Operations & Idioms
                          </span>
                          <button
                            onClick={() => handleCopy(stdlib.commonOps.join('\n'))}
                            className="text-xs font-mono text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Snippet</span>
                          </button>
                        </div>

                        <pre className="p-3.5 bg-slate-900 text-emerald-300 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                          <code>{stdlib.commonOps.join('\n')}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Tab 6: Mastery Quiz */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wider">
                        {currentDS.shortName} Mastery Quiz
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600">
                      Test your architectural grasp on memory invariants, Big-O trade-offs, and edge cases.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                      Score:{' '}
                      <span className="font-bold text-emerald-700">
                        {quizScore} / {totalQuestions}
                      </span>{' '}
                      ({answeredCount}/{totalQuestions} answered)
                    </div>
                    <button
                      onClick={handleResetQuiz}
                      title="Reset this quiz"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {currentDS.quiz.map((q: QuizQuestion, qIndex: number) => {
                    const selectedOpt = userQuizAnswers[q.id];
                    const hasAnswered = selectedOpt !== undefined && selectedOpt !== null;
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                            {qIndex + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {q.question}
                          </h4>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 pt-1 pl-8">
                          {q.options.map((option, optIdx) => {
                            const isOptionSelected = selectedOpt === optIdx;
                            const isOptionCorrect = optIdx === q.correctIndex;

                            let btnClasses =
                              'bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50';

                            if (hasAnswered) {
                              if (isOptionCorrect) {
                                btnClasses =
                                  'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                              } else if (isOptionSelected) {
                                btnClasses =
                                  'bg-rose-50 border-rose-400 text-rose-950 font-semibold';
                              } else {
                                btnClasses = 'bg-white border-slate-200 text-slate-400 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(q.id, optIdx)}
                                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-start gap-2.5 ${btnClasses}`}
                              >
                                <span className="font-bold shrink-0">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span className="flex-1">{option}</span>
                                {hasAnswered && isOptionCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                )}
                                {hasAnswered && isOptionSelected && !isOptionCorrect && (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation box */}
                        {hasAnswered && (
                          <div
                            className={`mt-3 p-3.5 rounded-lg border text-xs font-mono pl-8 transition-all ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : 'bg-rose-50 border-rose-200 text-rose-950'
                            }`}
                          >
                            <div className="font-bold mb-1 flex items-center gap-1.5">
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-600" />
                              )}
                              <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                            </div>
                            <p className="leading-relaxed">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {answeredCount === totalQuestions && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-900 uppercase">
                        Module Completed!
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        You scored {quizScore} out of {totalQuestions} (
                        {Math.round((quizScore / totalQuestions) * 100)}%).
                      </div>
                    </div>
                    <button
                      onClick={() => onGoToLeetCode()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold shadow-xs flex items-center gap-2"
                    >
                      <span>Practice in LeetCode Gauntlet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* "disclaimer part" positioned directly below the box, matching the user's diagram */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500 opacity-80 hover:opacity-100 transition-opacity">
        <p className="text-center sm:text-left">
          <span className="font-semibold text-slate-700">Disclaimer:</span> ohmasterylab.io is an educational sandbox.
          Data structures, algorithmic patterns, and problem formulations are studied under 17 U.S.C. § 107 (Fair Use) for transformative learning.
        </p>
        {onOpenDisclaimer && (
          <button
            onClick={onOpenDisclaimer}
            className="shrink-0 underline text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Notice</span>
          </button>
        )}
      </div>
    </div>
  );
};
