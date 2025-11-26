import { GoogleGenAI } from "@google/genai";
import { GeneratedDocument, Source } from "../types";

// Read the API key from a Vite-style env var
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!apiKey) {
  console.error("❌ Missing VITE_GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({ apiKey });


export const fetchDocumentDraft = async (prompt: string): Promise<GeneratedDocument> => {
  try {
    // Updated system prompt for FCS professional standards
    const fullPrompt = `
      User Request: Create a document draft for: "${prompt}".

      Role: You are an expert technical writer and legal compliance analyst for First Carbon Solutions (FCS).
      
      Objective:
      1. Search for real-world examples, regulatory templates, official government forms, and similar legal documents relevant to the request.
      2. Analyze the structure, required sections, and legal intent of the search results.
      3. Generate a BRAND NEW, legally unique document. It must NOT be a direct copy of any single source.
      4. The document must be structurally rigorous, containing standard sections found in professional environmental, legal, or planning documents (e.g., Executive Summary, Project Description, Mitigation Measures, Conclusions, Signatures).
      
      Style Guidelines:
      - Tone: Professional, authoritative, enterprise-grade, and neutral.
      - Format: Clean layout with clear headings. Use standard placeholders like [Date], [Project Name], [Lead Agency] where variable data is needed.
      - Specificity: If the user asks for an "Environmental Impact Report" or similar, ensure it follows standard CEQA/NEPA outlining conventions if applicable.

      Output:
      - Provide ONLY the document content. Do not include conversational text like "Here is your draft". Start immediately with the Title/Header of the document.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3, // Lower temperature for more structured, consistent output
      },
    });

    const text = response.text || "";
    
    // Extract sources from grounding metadata
    const sources: Source[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Regulatory Source",
            uri: chunk.web.uri,
            sourceType: 'web'
          });
        }
      });
    }

    return {
      content: text,
      sources: sources
    };

  } catch (error) {
    console.error("Error generating document:", error);
    throw error;
  }
};
