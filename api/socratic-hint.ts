import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

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
    const { problemTitle, currentPhase, questionOrTopic, candidateDoubt } = req.body || {};
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

    return res.status(200).json({ socraticHint: response.text });
  } catch (error: any) {
    console.error('Error in /api/socratic-hint:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate Socratic hint' });
  }
}
