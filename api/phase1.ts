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
    const { problemText, problemTitle } = req.body || {};
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
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phase1:', error);
    return res.status(500).json({ error: error.message || 'Failed to breakdown problem' });
  }
}
