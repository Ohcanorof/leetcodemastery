import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const COACH_PERSONA = `YOU ARE: The "Pattern Architect," an elite technical interview coach for ohmasterylab.io.
GOAL: Transition students from memorizing solutions to mastering algorithmic patterns through a structured three-phase learning loop.
CRITICAL GUARDRAILS:
- Never provide a full code solution in Phase 1 or Phase 2.
- Maintain a professional, minimal, and blunt coaching persona (zero sugar-coating, rigorous standards).
- If the user is stuck or asks questions, provide a Socratic hint or structural inquiry, NEVER the complete answer or solution code.
- GRADING MUST BE STRICT AND HONEST: Never award passing marks or scores >= 80% to answers that are evasive, nonsensical, blank, or say "i dont know". If an answer is invalid, score it 0-10% and mark passed as false.`;

async function callGemini(config: any) {
  const models = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        ...config,
        model,
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} failed, attempting next if available:`, err?.status || err?.message);
      lastError = err;
    }
  }

  throw lastError;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemContext, userAnswers } = req.body || {};
    if (!problemContext || !userAnswers || !Array.isArray(userAnswers)) {
      return res.status(400).json({ error: 'Problem context and user answers are required.' });
    }

    const isEvasive = (text: string) => {
      const clean = (text || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const evasivePhrases = [
        'idontknow',
        'dontknow',
        'noidea',
        'dunno',
        'notsure',
        'na',
        'none',
        'pass',
        'skip',
        'asdf',
        'test',
        'idk',
      ];
      return clean.length < 5 || evasivePhrases.includes(clean);
    };

    const allEvasive = userAnswers.every((ua: any) => isEvasive(ua.answer));
    const anyEvasive = userAnswers.some((ua: any) => isEvasive(ua.answer));

    const prompt = `Evaluate the candidate's responses for PHASE 2: THE CONCEPTUAL QUIZ with strict L6 interview standards.
Problem: ${problemContext.problemName || 'Problem'}
Core Pattern: ${problemContext.corePattern}
Required Data Structure: ${problemContext.requiredDataStructure}

Candidate Answers:
${userAnswers.map((ua: any, i: number) => `Q${i + 1}: ${ua.question}\nAnswer: ${ua.answer || '[NO ANSWER PROVIDED]'}\n`).join('\n')}

OPERATIONAL RULES FOR PHASE 2 SCORING:
- Candidate must achieve at least 80% accuracy/understanding to pass to Phase 3.
- If answers are evasive, nonsensical, blank, or say "i dont know", you MUST assign a score of 0 for that question and mark verdict as "Deficient".
- DO NOT accept hand-wavy or superficial answers. Penalize candidates who memorize solutions without understanding architectural invariants or edge cases.
- If overallScore < 80, set passed to false, and leave similarProblem as a default placeholder or empty.
- If and ONLY IF overallScore >= 80, set passed to true and provide a "Similar Problem" challenge for Phase 3 (e.g., if original was Two Sum, provide 3Sum or 4Sum; if Subarray Sum Equals K, provide Contiguous Array or Continuous Subarray Sum).
- CRITICAL GUARDRAIL: Never provide code solutions. Keep feedback blunt, direct, and rigorous.`;

    const response = await callGemini({
      contents: prompt,
      config: {
        systemInstruction: COACH_PERSONA,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: 'Percentage score 0 to 100' },
            passed: { type: Type.BOOLEAN, description: 'True if score >= 80' },
            bluntVerdict: { type: Type.STRING, description: 'Direct, un-sugarcoated coach evaluation summary' },
            reviews: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  verdict: { type: Type.STRING, description: 'Satisfactory / Flawed / Deficient' },
                  critique: { type: Type.STRING, description: 'Blunt breakdown of flaws or accuracy' },
                  socraticHint: { type: Type.STRING, description: 'Socratic nudge if flawed, empty if satisfactory' },
                },
                required: ['questionId', 'score', 'verdict', 'critique'],
              },
            },
            similarProblem: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                description: { type: Type.STRING },
                relationToOriginal: { type: Type.STRING, description: 'Why this tests the same pattern under higher constraints' },
                startingBoilerplate: { type: Type.STRING, description: 'Clean function signature only' },
              },
              required: ['title', 'difficulty', 'description', 'relationToOriginal'],
            },
          },
          required: ['overallScore', 'passed', 'bluntVerdict', 'reviews'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    if (allEvasive) {
      parsed.overallScore = Math.min(parsed.overallScore || 0, 10);
      parsed.passed = false;
      parsed.bluntVerdict = 'Automatic Rejection: Answers were evasive, blank, or stated "I don\'t know". You must demonstrate genuine architectural understanding to pass Phase 2.';
      if (Array.isArray(parsed.reviews)) {
        parsed.reviews = parsed.reviews.map((r: any) => ({
          ...r,
          score: 0,
          verdict: 'Deficient',
          critique: 'No substantive defense provided. Stating "I don\'t know" or submitting trivial placeholders fails the architectural bar.',
          socraticHint: 'Review Phase 1: What is the invariant maintained at each step of this algorithm?',
        }));
      }
    } else if (anyEvasive && parsed.overallScore >= 80) {
      parsed.overallScore = 65;
      parsed.passed = false;
      parsed.bluntVerdict = 'Revision Required: One or more questions received evasive or blank answers. Every architectural prompt must be defended.';
    }

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phase2-evaluate:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate quiz' });
  }
}
