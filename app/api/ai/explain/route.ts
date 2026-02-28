import { NextResponse } from 'next/server';

const FALLBACK = 'AI explanation is currently unavailable. Please consult your doctor or pharmacist for detailed information about this prescription.';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prescription } = body;

    if (!prescription) {
      return NextResponse.json({ error: 'No prescription provided' }, { status: 400 });
    }

    const meds = (prescription.medications ?? prescription.meds ?? []) as Array<{
      name: string;
      dose?: string;
      frequency?: string;
      duration?: string;
    }>;

    const medLines = meds
      .map((m) => `• ${m.name} — ${m.dose ?? ''}, ${m.frequency ?? ''} for ${m.duration ?? ''}`)
      .join('\n');

    const prompt = `You are a helpful medical assistant. Explain this prescription to a patient in simple, clear language (no jargon). Keep it under 200 words.

Prescription:
Patient: ${prescription.patientId ?? 'Unknown'}
Medications:
${medLines}
Notes: ${prescription.notes ?? 'None'}

Explain what each medication does, why it might be prescribed, and any important instructions.`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 400, temperature: 0.4 },
          }),
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const text =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? FALLBACK;
        return NextResponse.json({ explanation: text });
      }
    }

    // OpenAI fallback
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 400,
          temperature: 0.4,
        }),
      });

      if (openaiRes.ok) {
        const openaiData = await openaiRes.json();
        const text = openaiData?.choices?.[0]?.message?.content ?? FALLBACK;
        return NextResponse.json({ explanation: text });
      }
    }

    // No API key configured — return a structured generic explanation
    const genericMeds = meds
      .map(
        (m) =>
          `${m.name} (${m.dose ?? 'dosage as prescribed'}): Take ${m.frequency ?? 'as directed'} for ${m.duration ?? 'the prescribed period'}.`
      )
      .join(' ');

    return NextResponse.json({
      explanation: `This prescription includes the following medications: ${genericMeds} ${
        prescription.notes ? `Additional notes from your doctor: ${prescription.notes}` : ''
      } Always follow your doctor's instructions and contact them if you have questions.`,
    });
  } catch (err: unknown) {
    console.error('[AI Explain]', err);
    return NextResponse.json({ explanation: FALLBACK }, { status: 200 });
  }
}
