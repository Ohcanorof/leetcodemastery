import React from 'react';
import { ShieldCheck, X, ExternalLink, Scale } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Educational Fair Use & Legal Disclaimer
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Compliance, Intellectual Property, and Open Learning Notice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-sans">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              1. Non-Commercial Educational Purpose (17 U.S.C. § 107)
            </h4>
            <p>
              ohmasterylab.io is an independent, non-commercial educational coaching sandbox
              designed to assist computer science students and software engineers in studying
              fundamental computer science theory, memory models, and algorithmic patterns.
              All analyses, ELI5 analogies, conceptual quizzes, and critiques provided herein
              constitute transformative commentary and scholarship.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1">
              2. Problem Titles & Benchmark Prompts
            </h4>
            <p>
              Problem titles, classic computer science formulations (e.g. Two Sum, Subarray Sum,
              Topological Sort, Shortest Path), and mathematical constraints referenced in this
              curriculum are standard mathematical invariants widely published in academic
              literature (such as Cormen, Leiserson, Rivest, Stein's <em>Introduction to Algorithms</em>).
              No proprietary internal test suites, hidden test cases, or paywalled solutions from LeetCode LLC
              or any third-party testing vendor are stored or redistributed.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1">
              3. Third-Party Links & Open Community Videos
            </h4>
            <p>
              Outbound links to YouTube are standard search queries directing students to public,
              community-created educational tutorials and algorithmic animations. ohmasterylab.io does
              not host, re-upload, or claim ownership of third-party video content.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1">
              4. Non-Affiliation Trademark Notice
            </h4>
            <p>
              "LeetCode" is a registered trademark of LeetCode LLC. "YouTube" is a registered trademark
              of Google LLC / Alphabet Inc. Use of these nominative terms within this application is
              solely for descriptive identification and reference purposes and does not imply any
              affiliation, sponsorship, endorsement, or partnership.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold transition-all"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
