import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

/**
 * Initializes and returns the Gemini AI instance.
 * Using a getter ensures we only initialize when needed and can handle missing keys.
 */
export function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error(
        "GEMINI_API_KEY is not set. Please add it to your project's Secrets (Settings > Secrets) in AI Studio."
      );
    }
    
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

/**
 * Helper to generate insights or tips for a calculation
 */
export async function generateCalculationInsight(calculatorTitle: string, resultValue: string) {
  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provides a brief, helpful tip for a user who used the ${calculatorTitle} and got a result of ${resultValue}. Keep it under 50 words.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return null; // Return null so the UI can hide the insight section if it fails
  }
}
