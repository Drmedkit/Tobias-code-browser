import { GoogleGenAI } from "@google/genai";
import { CodeState } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTutorResponse = async (
  userPrompt: string, 
  codeContext: CodeState,
  chatHistory: string[] = []
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Construct a context-aware prompt
    const contextBlock = `
--- CURRENT CODE CONTEXT ---
FILE: index.html
${codeContext.html}

FILE: style.css
${codeContext.css}

FILE: script.js
${codeContext.javascript}
--- END CONTEXT ---
`;

    const systemInstruction = `You are CodeWeaver, an expert AI coding tutor embedded in an online web IDE. 
    Your goal is to help the user write HTML, CSS, and JavaScript.
    
    Rules:
    1. You have access to the user's current code (provided in the context).
    2. If the user asks for a fix, explain the fix and provide the corrected code snippet.
    3. If the user asks for a feature, provide the code to implement it.
    4. Be concise, encouraging, and educational.
    5. Format code blocks using markdown (e.g., \`\`\`html ... \`\`\`).
    6. If the user has syntax errors, point them out gently.
    `;

    const fullPrompt = `${contextBlock}\n\nUser Question: ${userPrompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI Tutor. Please check your API key or try again later.";
  }
};