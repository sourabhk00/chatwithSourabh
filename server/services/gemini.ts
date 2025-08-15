import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface ChatResponse {
  text: string;
  error?: string;
}

export async function generateChatResponse(
  prompt: string, 
  fileContents?: Array<{ filename: string; content: string; mimeType: string }>
): Promise<ChatResponse> {
  try {
    let enhancedPrompt = prompt;
    
    if (fileContents && fileContents.length > 0) {
      enhancedPrompt += "\n\nContext from uploaded files:\n";
      fileContents.forEach(file => {
        enhancedPrompt += `\n--- ${file.filename} ---\n${file.content}\n`;
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enhancedPrompt,
    });

    return {
      text: response.text || "I apologize, but I couldn't generate a response."
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      text: "I'm having trouble connecting to my AI services right now. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function analyzeFile(
  filename: string, 
  content: string, 
  mimeType: string
): Promise<ChatResponse> {
  try {
    const analysisPrompt = `Please analyze this file and provide insights about its content, structure, and purpose:

Filename: ${filename}
Type: ${mimeType}

Content:
${content}

Please provide:
1. A summary of what this file contains
2. Key insights or notable elements
3. Suggestions for improvements (if applicable)
4. Any potential issues or concerns`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: analysisPrompt,
    });

    return {
      text: response.text || "I couldn't analyze this file properly."
    };
  } catch (error) {
    console.error("File analysis error:", error);
    return {
      text: "I encountered an error while analyzing this file.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function analyzeImage(filePath: string): Promise<ChatResponse> {
  try {
    const imageBytes = fs.readFileSync(filePath);
    
    const contents = [
      {
        inlineData: {
          data: imageBytes.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
      "Analyze this image in detail and describe its key elements, context, and any notable aspects.",
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    return {
      text: response.text || "I couldn't analyze this image properly."
    };
  } catch (error) {
    console.error("Image analysis error:", error);
    return {
      text: "I encountered an error while analyzing this image.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
