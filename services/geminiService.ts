import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SourceAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The title of the webpage found in the <title> tag.",
    },
    metaDescription: {
      type: Type.STRING,
      description: "The content of the meta description tag.",
    },
    techStack: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of frameworks, libraries, or tools detected (e.g., React, Tailwind, Bootstrap, WordPress).",
    },
    summary: {
      type: Type.STRING,
      description: "A concise summary of what the page appears to be about based on its content.",
    },
    securityHeaders: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Any interesting security related meta tags or headers observed (e.g., CSP).",
    },
  },
  required: ["title", "techStack", "summary"],
};

export const analyzeHtmlContent = async (html: string): Promise<SourceAnalysis> => {
  try {
    // Truncate HTML if it's excessively large to stay within reasonable token limits/latency
    // Gemini 2.5 Flash handles ~1M tokens, so this is just a safety optimization for latency.
    const truncatedHtml = html.length > 200000 ? html.substring(0, 200000) + "...(truncated)" : html;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a web expert. Analyze the following HTML source code and extract key details. 
      
      HTML Content:
      ${truncatedHtml}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a helpful and precise web crawler assistant. Extract information accurately from the provided HTML.",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as SourceAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the source code with AI.");
  }
};
