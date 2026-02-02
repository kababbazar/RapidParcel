
import { GoogleGenAI, Type } from "@google/genai";
import { Area } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const detectAreaFromAddress = async (address: string, areas: Area[]): Promise<string | null> => {
  if (!address || areas.length === 0) return null;

  try {
    const areaListString = areas.map(a => `${a.areaName} (${a.district}) - ID: ${a.id}`).join(', ');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given the customer address: "${address}". 
      From the following list of courier service areas, which one is the best match? 
      List: ${areaListString}. 
      Return ONLY the ID of the matching area. If no clear match is found, return "NONE".`,
      config: {
        temperature: 0.1,
        maxOutputTokens: 20,
      }
    });

    const result = response.text.trim();
    return result === "NONE" ? null : result;
  } catch (error) {
    console.error("AI Area Detection Error:", error);
    return null;
  }
};
