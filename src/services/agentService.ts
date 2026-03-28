import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeUserBehavior(profile: UserProfile): Promise<{ tags: string[]; script: string }> {
  const pathString = profile.paths.map(p => p.path).join(" -> ");
  
  const prompt = `
    Analyze the following user behavior path in a high-end postpartum care center app:
    Path: ${pathString}
    Current Tags: ${profile.tags.join(", ")}
    
    Tasks:
    1. Identify new interests and tags (e.g., "Interested in luxury suites", "Concerned about postpartum recovery").
    2. Generate a sales script for a human salesperson to use when contacting this high-net-worth customer.
    
    Return the result in JSON format:
    {
      "newTags": ["tag1", "tag2"],
      "salesScript": "The script here..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      tags: result.newTags || [],
      script: result.salesScript || "No script generated.",
    };
  } catch (error) {
    console.error("Agent analysis failed:", error);
    return { tags: [], script: "Analysis failed." };
  }
}
