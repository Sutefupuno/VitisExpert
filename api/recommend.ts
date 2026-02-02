import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing GOOGLE_API_KEY" });

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            justification: { type: Type.STRING },
            commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
            alternativeStrategy: { type: Type.STRING }
          },
          required: ['verdict', 'justification', 'commonMistakes']
        }
      }
    });

    const text = response.text || '{}';
    res.status(200).json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: err + "" });
  }
}
