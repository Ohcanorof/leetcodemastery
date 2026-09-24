import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

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

// Resilient Gemini generateContent with fallback models
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

// Endpoint 1: Phase 1 Pattern Breakdown
app.post('/api/phase1', async (req: Request, res: Response) => {
  try {
    const { problemText, problemTitle } = req.body;
    if (!problemText || typeof problemText !== 'string' || !problemText.trim()) {
      return res.status(400).json({ error: 'Problem statement is required.' });
    }

    const prompt = `Analyze this algorithmic problem following PHASE 1 of our coaching methodology:
Problem:
${problemTitle ? `Title: ${problemTitle}\n` : ''}${problemText}

REQUIREMENTS FOR PHASE 1:
1. Pattern Identification: Explicitly name the Core Pattern (e.g., Sliding Window, Monotonic Stack, Two Pointers) and the required Data Structure (e.g., Hash Map, Min-Heap).
2. The Logic: 2-3 sentences on the "aha!" moment or core trick of the problem.
3. Method Comparison: Compare Brute Force vs. Optimized approaches including Big O Time/Space Complexity.
4. ELI5: Provide a "Explain Like I'm Five" analogy for the logic.
5. Resources: Provide a YouTube search link in this format: https://www.youtube.com/results?search_query=leetcode+[Problem+Name]+solution
6. Prepare 3-4 initial conceptual questions for Phase 2 (architectural "Why", edge cases, NO code).

CRITICAL: Do NOT include full code solutions. Keep the persona minimal, elite, and blunt.`;

    const response = await callGemini({
      contents: prompt,
      config: {
        systemInstruction: COACH_PERSONA,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemName: { type: Type.STRING },
            corePattern: { type: Type.STRING, description: 'Core algorithmic pattern name' },
            requiredDataStructure: { type: Type.STRING, description: 'Required data structure' },
            secondaryPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            theLogic: {
              type: Type.STRING,
              description: '2-3 sentences on the "aha!" moment or core trick of the problem',
            },
            methodComparison: {
              type: Type.OBJECT,
              properties: {
                bruteForce: {
                  type: Type.OBJECT,
                  properties: {
                    approach: { type: Type.STRING },
                    timeComplexity: { type: Type.STRING },
                    spaceComplexity: { type: Type.STRING },
                    bottleneck: { type: Type.STRING },
                  },
                  required: ['approach', 'timeComplexity', 'spaceComplexity', 'bottleneck'],
                },
                optimized: {
                  type: Type.OBJECT,
                  properties: {
                    approach: { type: Type.STRING },
                    timeComplexity: { type: Type.STRING },
                    spaceComplexity: { type: Type.STRING },
                    advantage: { type: Type.STRING },
                  },
                  required: ['approach', 'timeComplexity', 'spaceComplexity', 'advantage'],
                },
              },
              required: ['bruteForce', 'optimized'],
            },
            eli5: {
              type: Type.STRING,
              description: 'Explain Like I\'m Five analogy for the underlying intuition',
            },
            youtubeUrl: {
              type: Type.STRING,
              description: 'https://www.youtube.com/results?search_query=leetcode+[Problem+Name]+solution',
            },
            coachNote: {
              type: Type.STRING,
              description: 'Blunt, punchy architect note to the candidate',
            },
            phase2Questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  focus: { type: Type.STRING, description: 'e.g. Edge Case, Invariant, Data Structure trade-off' },
                  whyItMatters: { type: Type.STRING },
                },
                required: ['id', 'question', 'focus', 'whyItMatters'],
              },
            },
          },
          required: [
            'problemName',
            'corePattern',
            'requiredDataStructure',
            'theLogic',
            'methodComparison',
            'eli5',
            'youtubeUrl',
            'phase2Questions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phase1:', error);
    return res.status(500).json({ error: error.message || 'Failed to breakdown problem' });
  }
});

// Endpoint 2: Phase 2 Evaluation (Grading user's conceptual answers)
app.post('/api/phase2-evaluate', async (req: Request, res: Response) => {
  try {
    const { problemContext, userAnswers } = req.body;
    if (!problemContext || !userAnswers || !Array.isArray(userAnswers)) {
      return res.status(400).json({ error: 'Problem context and user answers are required.' });
    }

    // Server-side check for evasive / placeholder / empty responses
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

    // Hard safeguard: If all answers were evasive or empty, enforce failure regardless of LLM hallucinations
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

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phase2-evaluate:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate quiz' });
  }
});

// Endpoint 3: Phase 3 Blunt Critique
app.post('/api/phase3-critique', async (req: Request, res: Response) => {
  try {
    const { problemTitle, problemDescription, code, language } = req.body;
    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Code submission is required.' });
    }

    // Check for trivial, evasive, or "i dont know" code
    const cleanCode = code.trim().toLowerCase();
    const isEvasiveCode =
      cleanCode === 'i dont know' ||
      cleanCode === 'idk' ||
      cleanCode === 'pass' ||
      cleanCode.replace(/[^a-z0-9]/g, '') === 'idontknow' ||
      cleanCode.length < 15;

    const prompt = `Perform PHASE 3: THE BLUNT CRITIQUE on this candidate's code submission.
Problem: ${problemTitle || 'Challenge'}
Description: ${problemDescription || ''}
Language: ${language || 'Python'}

Candidate Submission:
\`\`\`${language || 'python'}
${code}
\`\`\`

REQUIREMENTS & EVALUATION CRITERIA:
1. Demand Code + Commentary: Check if the user included "Interview Comments"—inline explanations every 3-5 lines explaining the logic as if speaking to an interviewer.
2. THE BLUNT CRITIQUE: Analyze the submission with zero sugar-coating:
   - Efficiency: Identify Big O Time & Space complexity. Will it TLE on large inputs? Did they miss the optimal pattern?
   - Communication: Scrutinize inline comments. Are they hand-wavy? Did they explain WHY they increment pointers or make transformations?
   - Logic: Identify specific bugs, off-by-one errors, or unhandled edge cases (e.g. empty inputs, duplicates, overflow, negative values).
3. Final Verdict:
   - "ACCEPTED" (Optimal Big O, rock-solid logic, articulate interview commentary)
   - "REVISE" (Correct pattern but flawed comments, suboptimal constant factors, or minor edge-case bug)
   - "REJECTED" (Suboptimal Big O / TLE, missing commentary, placeholder/evasive text, or broken logic)

CRITICAL: If the candidate simply wrote "i dont know", pseudo placeholders, or incomplete code, Verdict MUST BE "REJECTED", overallScore must be 0-15%, and blunt reviews must call out the lack of implementation.`;

    const response = await callGemini({
      contents: prompt,
      config: {
        systemInstruction: COACH_PERSONA,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: 'ACCEPTED, REVISE, or REJECTED' },
            overallScore: { type: Type.INTEGER, description: '0 to 100 rating' },
            summaryVerdict: { type: Type.STRING, description: 'Single sentence blunt summary' },
            efficiencyCritique: {
              type: Type.OBJECT,
              properties: {
                timeComplexity: { type: Type.STRING },
                spaceComplexity: { type: Type.STRING },
                isOptimal: { type: Type.BOOLEAN },
                tleRisk: { type: Type.STRING, description: 'High, Moderate, None' },
                bluntReview: { type: Type.STRING },
              },
              required: ['timeComplexity', 'spaceComplexity', 'isOptimal', 'tleRisk', 'bluntReview'],
            },
            communicationCritique: {
              type: Type.OBJECT,
              properties: {
                commentDensityScore: { type: Type.INTEGER, description: '0 to 100 based on having comments every 3-5 lines' },
                isHandWavy: { type: Type.BOOLEAN },
                bluntReview: { type: Type.STRING },
                lineCritiques: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      lineOrSection: { type: Type.STRING },
                      feedback: { type: Type.STRING },
                    },
                    required: ['lineOrSection', 'feedback'],
                  },
                },
              },
              required: ['commentDensityScore', 'isHandWavy', 'bluntReview', 'lineCritiques'],
            },
            logicCritique: {
              type: Type.OBJECT,
              properties: {
                hasBugs: { type: Type.BOOLEAN },
                identifiedBugs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                handledEdgeCases: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                missedEdgeCases: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                bluntReview: { type: Type.STRING },
              },
              required: ['hasBugs', 'identifiedBugs', 'handledEdgeCases', 'missedEdgeCases', 'bluntReview'],
            },
            architectAdvice: {
              type: Type.STRING,
              description: 'Next concrete directive for the candidate',
            },
          },
          required: [
            'verdict',
            'overallScore',
            'summaryVerdict',
            'efficiencyCritique',
            'communicationCritique',
            'logicCritique',
            'architectAdvice',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Hard fallback guardrail for evasive code
    if (isEvasiveCode) {
      parsed.verdict = 'REJECTED';
      parsed.overallScore = 0;
      parsed.summaryVerdict = 'Immediate Rejection: No algorithmic solution or code provided.';
      parsed.efficiencyCritique.isOptimal = false;
      parsed.efficiencyCritique.bluntReview = 'Non-existent implementation. Cannot evaluate asymptotic complexity.';
      parsed.communicationCritique.isHandWavy = true;
      parsed.communicationCritique.commentDensityScore = 0;
      parsed.communicationCritique.bluntReview = 'No interview commentary present.';
      parsed.logicCritique.hasBugs = true;
      parsed.logicCritique.identifiedBugs = ['Zero functional logic submitted'];
      parsed.architectAdvice = 'Write a complete executable solution demonstrating the target pattern with inline interview commentary.';
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phase3-critique:', error);
    return res.status(500).json({ error: error.message || 'Failed to critique submission' });
  }
});

// Endpoint 4: Socratic Hint & Clarifications
app.post('/api/socratic-hint', async (req: Request, res: Response) => {
  try {
    const { problemTitle, currentPhase, questionOrTopic, candidateDoubt } = req.body;
    if (!candidateDoubt) {
      return res.status(400).json({ error: 'Candidate inquiry is required.' });
    }

    const prompt = `The candidate is asking a question or appears stuck in Phase ${currentPhase || 1}.
Problem: ${problemTitle || 'Algorithmic Problem'}
Context/Question: ${questionOrTopic || ''}
Candidate Query: "${candidateDoubt}"

CRITICAL GUARDRAIL:
- NEVER provide a full code solution or direct answer.
- Provide a razor-sharp, Socratic hint that forces them to deduce the invariant or structure themselves.
- Keep the response under 4 sentences. Professional, elite, minimal.`;

    const response = await callGemini({
      contents: prompt,
      config: {
        systemInstruction: COACH_PERSONA,
      },
    });

    return res.json({ socraticHint: response.text });
  } catch (error: any) {
    console.error('Error in /api/socratic-hint:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate Socratic hint' });
  }
});

// Mount Vite in dev or serve dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pattern Architect server running on http://0.0.0.0:${PORT}`);
});
