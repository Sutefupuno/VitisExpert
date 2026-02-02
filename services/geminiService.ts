
import { GoogleGenAI, Type } from "@google/genai";
import { PruningInput, PruningRecommendation } from "../types";

/**
 * Analyzes pruning timing based on environmental factors using Gemini 3 Flash.
 */
export const getPruningAdvice = async (input: PruningInput): Promise<PruningRecommendation> => {
  // Always use process.env.API_KEY directly in the constructor.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Du bist ein fachlich präziser Weinbau-Assistent für Hobby-Winzer in Mitteleuropa.
    Beurteile basierend auf folgenden Daten, ob ein Rebschnitt aktuell sinnvoll ist.

    DATEN:
    Rebsorte: ${input.variety}
    Standort: ${input.region}, ${input.altitude}
    Erziehungsform: ${input.trainingSystem}
    Aktuelles Stadium: ${input.phenology}
    Wettertrend: ${input.tempTrend}
    Frostrisiko: ${input.frostRisk}
    Niederschlag aktuell: ${input.precipitation || 'keine Angabe'}
    Windgeschwindigkeit aktuell: ${input.windSpeed || 'keine Angabe'}
    Ziel: ${input.goal}

    ANFORDERUNG:
    - Gib eine klare Empfehlung (jetzt schneiden, noch warten, nur vorbereitende Arbeiten).
    - Begründe fachlich (Vitalität vor Ertrag). Berücksichtige dabei auch die Wundheilung (Feuchtigkeit fürdert Infektionen wie ESCA).
    - Nenne max. 3 typische Fehler.
    - Gib ggf. eine alternative Strategie.
    - Ton: sachlich, verständlich, kein Overkill an Jargon.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { 
            type: Type.STRING, 
            description: 'Muss eines sein von: jetzt schneiden, noch warten, nur vorbereitende Arbeiten' 
          },
          justification: { type: Type.STRING },
          commonMistakes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          alternativeStrategy: { type: Type.STRING }
        },
        required: ['verdict', 'justification', 'commonMistakes']
      }
    }
  });

  try {
    // response.text is a property, not a method.
    return JSON.parse(response.text || '{}') as PruningRecommendation;
  } catch (e) {
    throw new Error("Fehler beim Verarbeiten der Empfehlung.");
  }
};

/**
 * Edits vineyard images using Gemini 2.5 Flash Image.
 * Fixes the error in ImageEditor.tsx by providing the missing export.
 */
export const editVineyardImage = async (image: string, prompt: string): Promise<string | null> => {
  // Always use process.env.API_KEY directly in the constructor.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Extract base64 data and mimeType from the data URL
  const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    return null;
  }
  const mimeType = match[1];
  const base64Data = match[2];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  // The output response may contain both image and text parts; iterate through all parts to find the image part.
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        // Use the returned mimeType if available, or fall back to image/png
        const returnedMimeType = part.inlineData.mimeType || 'image/png';
        return `data:${returnedMimeType};base64,${base64EncodeString}`;
      }
    }
  }

  return null;
};
