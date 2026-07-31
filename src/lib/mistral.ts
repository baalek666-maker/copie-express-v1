import { Mistral } from '@mistralai/mistralai';

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!,
});

export interface OCRResult {
  text: string;
  pages: number;
  cost_estimate_eur: number;
}

export interface ExtractionResult {
  student_identifier: string | null;
  answers: Record<string, string | null>;
  method_used?: string | null;
  confidence: number;
  cost_estimate_eur: number;
}

/**
 * Step 1 — OCR via Mistral OCR API
 * Accepte : PDF, JPG, PNG
 * Retourne : texte brut extrait de la copie manuscrite
 */
export async function runOCR(fileUrl: string, fileType: 'pdf' | 'image'): Promise<OCRResult> {
  const response = await client.ocr.process({
    model: 'mistral-ocr-latest',
    document: {
      type: 'document_url',
      documentUrl: fileUrl,
    },
    includeImageBase64: false,
  });

  const text = response.pages?.map((p) => p.markdown || '').join('\n\n') || '';
  const pages = response.pages?.length || 0;

  return {
    text,
    pages,
    cost_estimate_eur: pages * 0.01, // ~0.01€/page Mistral OCR
  };
}

/**
 * Step 2 — Extraction structurée des réponses via Mistral Small
 * Reçoit : texte OCR + barème + bonnes réponses
 * Retourne : JSON {élève, réponses, score}
 */
export async function extractAnswers(
  ocrText: string,
  gradingScale: Array<{ id: string; label: string; max_points: number }>,
  correctAnswers?: Record<string, string>
): Promise<ExtractionResult> {
  const systemPrompt = `Tu es un assistant qui extrait les réponses d'une copie d'élève à partir du texte OCR. Tu retournes UNIQUEMENT du JSON valide, aucun commentaire.`;

  const userPrompt = `Barème de l'évaluation :
${JSON.stringify(gradingScale, null, 2)}

${correctAnswers ? `Bonnes réponses attendues :\n${JSON.stringify(correctAnswers, null, 2)}\n` : ''}

Texte OCR de la copie :
"""
${ocrText}
"""

Retourne un JSON strict avec cette structure :
{
  "student_identifier": "eleve_XX" (string ou null si illisible),
  "answers": {<id_question>: "réponse élève ou null si illisible", ...},
  "confidence": 0.0 à 1.0 (ta confiance globale dans l'extraction)
}

Toutes les questions du barème doivent apparaître dans "answers". JSON uniquement, pas de texte autour.`;

  const response = await client.chat.complete({
    model: 'mistral-small-latest',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    responseFormat: { type: 'json_object' as const } as any,
    temperature: 0,
  });

  const content = response.choices?.[0]?.message?.content;
  const parsed = typeof content === 'string' ? JSON.parse(content) : content;

  return {
    student_identifier: parsed.student_identifier || null,
    answers: parsed.answers || {},
    method_used: parsed.method_used || null,
    confidence: parsed.confidence || 0,
    cost_estimate_eur: 0.005,
  };
}