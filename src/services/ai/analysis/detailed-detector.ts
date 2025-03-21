
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, GeminiResponse } from "../common";

export const detectAIContent = async (text: string): Promise<{
  score: number;
  analysis: string;
  confidence: "high" | "medium" | "low";
}> => {
  try {
    const response = await fetch(
      `${BASE_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following text to determine if it was written by AI or a human.
                  
                  Return your response in the format:
                  SCORE: [numeric score from 0-100 where 100 means definitely AI-generated]
                  CONFIDENCE: [high|medium|low]
                  ANALYSIS: [2-3 sentences explaining why you think the text is AI-generated or human-written, noting specific patterns or features]
                  
                  Text to analyze: "${text}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error analyzing text");
    }

    const data: GeminiResponse = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const analysisText = data.candidates[0].content.parts[0].text;
      
      // Extract the score
      const scoreMatch = analysisText.match(/SCORE:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
      
      // Extract the confidence
      const confidenceMatch = analysisText.match(/CONFIDENCE:\s*(high|medium|low)/i);
      const confidence = (confidenceMatch ? confidenceMatch[1].toLowerCase() : "medium") as "high" | "medium" | "low";
      
      // Extract the analysis
      const analysisMatch = analysisText.match(/ANALYSIS:\s*([\s\S]+)(?:\n|$)/i);
      const analysis = analysisMatch ? analysisMatch[1].trim() : "Unable to provide detailed analysis.";
      
      return {
        score: Math.min(Math.max(score, 0), 100),
        confidence,
        analysis
      };
    }

    throw new Error("Failed to analyze the text");
  } catch (error) {
    console.error("Error running AI detection:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    
    // Return fallback values
    return {
      score: Math.floor(Math.random() * 40) + 30, // Random score between 30-70
      confidence: "low",
      analysis: "Unable to perform analysis due to an error. Please try again later."
    };
  }
};
