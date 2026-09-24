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
    const { problemTitle, problemDescription, code, language } = req.body || {};
    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Code submission is required.' });
    }

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

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error in /api/phase3-critique:', error);
    return res.status(500).json({ error: error.message || 'Failed to critique submission' });
  }
}
