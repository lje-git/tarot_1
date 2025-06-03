import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TarotCard } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Add '!' as we handle the missing key in UI

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const getInterpretation = async (
  cards: TarotCard[],
  positions: string[],
  question: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is not configured. Cannot fetch interpretation.");
  }

  const drawnCardsDescription = cards.map((card, index) => 
    `${index + 1}. ${positions[index]} - ${card.name}`
  ).join("\\n");

  const prompt = `
You are a tarot reader conducting a Celtic Cross reading. Your tone should be insightful, balanced, and empathetic.
The following 10 cards have been randomly drawn for the user:

${drawnCardsDescription}

The user's question is: "${question}"

Please provide an unbiased interpretation of these cards in relation to the user's question. Follow these rules strictly for your entire response:
1.  Address each card and its position systematically. For each card, begin with "For the [Position Name] - [Card Name]:".
2.  Include BOTH positive and challenging aspects of each card as it relates to its position and the overall question.
3.  Don't sugarcoat difficult cards or overly dramatize positive ones. Maintain a neutral, objective tone.
4.  Acknowledge when cards seem contradictory or unclear in the context of the question or other cards.
5.  Present multiple possible interpretations where relevant, especially for nuanced cards or complex interactions.
6.  Avoid definitive predictions. Focus on energies, potentials, influences, and areas for reflection or action. Use phrases like "This suggests...", "This could indicate...", "Consider how this energy might manifest as...".
7.  If a card doesn't seem to directly fit the question, acknowledge this honestly and explore how its general energy might still offer insight or a broader perspective.
8.  Conclude with a brief summary (2-3 sentences) that synthesizes the key themes of the reading in relation to the question, without making predictions.
9.  Format your response clearly. Use newlines (\\n) for paragraph breaks to ensure readability. Do not use markdown lists or bolding, just plain text paragraphs.
10. Do not add any introductory or concluding remarks beyond the interpretation itself. Stick to the card analysis and the brief summary.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      // No specific config like thinkingConfig or responseMimeType needed for this text-based interpretation
    });
    
    const text = response.text;
    if (!text) {
      throw new Error("Received an empty response from the AI.");
    }
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid API Key. Please check your API_KEY configuration.");
    }
    throw new Error("Failed to get interpretation from AI. " + (error instanceof Error ? error.message : String(error)));
  }
};
