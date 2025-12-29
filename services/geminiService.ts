/// <reference types="vite/client" />

import { GroundingChunk } from "../types";

/* ================================
   CONFIGURATION
================================ */

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

if (!API_KEY) {
  throw new Error("❌ VITE_DEEPSEEK_API_KEY is missing. Add it to your .env file.");
}

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

/* ================================
   COMMON CALL FUNCTION
================================ */

const callDeepSeek = async (prompt: string): Promise<string> => {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful expert assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

/* ================================
   QUICK ADVICE (TEXT)
================================ */

export const getQuickAdvice = async (query: string): Promise<string> => {
  try {
    const prompt = `Give a short expert tip (2 sentences) about: ${query}`;
    return await callDeepSeek(prompt);
  } catch (error) {
    console.error("Quick advice error:", error);
    return "No advice available right now.";
  }
};

/* ================================
   NEWS / TRENDS (TEXT)
================================ */

export const searchCounterfeitNews = async (
  query: string
): Promise<{ text: string; links: GroundingChunk[] }> => {
  try {
    const prompt = `
Explain recent trends or news related to counterfeit products and ${query}.
Do not invent sources. Keep it concise.
`;

    const text = await callDeepSeek(prompt);

    return {
      text,
      links: [], // DeepSeek does not provide grounding links like Gemini
    };
  } catch (error) {
    console.error("News search error:", error);
    return {
      text: "Could not fetch news at this time.",
      links: [],
    };
  }
};

/* ================================
   IMAGE ANALYSIS (TEXT-BASED)
   DeepSeek = text only
================================ */

export const analyzeProductImage = async (
  imageDescription: string
): Promise<string> => {
  try {
    const prompt = `
You are an expert product inspector.

A user has scanned a product. Here is the description of the product image:

"${imageDescription}"

Analyze whether the product could be counterfeit.
Check for:
- Poor packaging quality
- Missing or mismatched branding
- Broken seals
- Spelling or logo issues

Give a clear final conclusion.
`;

    return await callDeepSeek(prompt);
  } catch (error) {
    console.error("Image analysis error:", error);
    throw error;
  }
};
