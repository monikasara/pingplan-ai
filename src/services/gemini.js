import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash"];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function askGemini(prompt) {
  if (!apiKey) {
    return "API key missing. Add VITE_GEMINI_API_KEY in .env and restart npm run dev.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Gemini error with ${modelName}:`, error);

      if (error.message?.includes("503")) {
        await wait(1500);
        continue;
      }
    }
  }

  return "AI is temporarily busy. Try again in a few seconds with smaller material.";
}