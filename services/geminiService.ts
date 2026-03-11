/// <reference types="vite/client" />

import { GroundingChunk } from "../types";

/* ================================
   CONFIGURATION
================================ */

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!API_KEY) {
  throw new Error("❌ VITE_OPENROUTER_API_KEY is missing.");
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/* ================================
   COMMON CALL FUNCTION
================================ */

// Vision-capable, stable models for Lovable / OpenRouter
const MODELS = [
  "openai/gpt-4o-mini",
  "mistralai/mistral-7b-instruct"
];



const callAI = async (messages: any[]): Promise<string> => {
  let lastError: any;

  for (const model of MODELS) {
    try {
      console.log(`Attempting AI call with model: ${model}`);
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Anti-Counterfeit Project",
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Model ${model} failed: ${response.status} - ${errorText}`);
        lastError = new Error(`Model ${model} failed: ${errorText}`);
        continue; // Try next model
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response received.";

    } catch (err) {
      console.warn(`Network/Model error with ${model}:`, err);
      lastError = err;
      continue;
    }
  }

  // If we get here, all models failed
  throw lastError || new Error("All AI models failed to respond.");
};

/* ================================
   QUICK ADVICE
================================ */

export const getQuickAdvice = async (query: string): Promise<string> => {
  try {
    return await callAI([
      { role: "system", content: "You are a helpful expert assistant." },
      { role: "user", content: `Give a short expert tip (2 sentences) about: ${query}` }
    ]);
  } catch (error) {
    console.error("AI Error:", error);
    return "No advice available right now.";
  }
};

/* ================================
   NEWS / TRENDS
================================ */

export const searchCounterfeitNews = async (
  query: string
): Promise<{ text: string; links: GroundingChunk[] }> => {
  try {
    const text = await callAI([
      { role: "system", content: "You are a helpful expert assistant." },
      { role: "user", content: `Explain recent trends or news related to counterfeit products and ${query}. Keep it concise.` }
    ]);

    return { text, links: [] };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      text: "Could not fetch news at this time.",
      links: [],
    };
  }
};

/* ================================
   IMAGE ANALYSIS (TEXT-BASED)
================================ */
export const analyzeProductImage = async (): Promise<string> => {
  return await callAI([
    {
      role: "system",
      content: "You are an expert product inspector."
    },
    {
      role: "user",
      content: `
A product image was uploaded.
Analyze common counterfeit indicators such as:
- Poor packaging quality
- Logo or brand mismatch
- Spelling or print errors
- Broken or missing seals

Provide a clear final conclusion.
`
    }
  ]);
};
