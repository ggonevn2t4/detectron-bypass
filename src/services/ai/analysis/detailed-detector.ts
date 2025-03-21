
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, GeminiResponse } from "../common";

export interface AIDetectionResult {
  score: number;
  analysis: string;
  confidence: "high" | "medium" | "low";
  patterns: string[];
  suggestions: string[];
}

export const detectAIContent = async (text: string): Promise<AIDetectionResult> => {
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
                  
                  Return your response in the following JSON format without any additional text:
                  {
                    "score": [numeric score from 0-100 where 100 means definitely AI-generated],
                    "confidence": ["high", "medium", or "low"],
                    "analysis": [2-3 sentence explanation of why you think the text is AI-generated or human-written],
                    "patterns": [array of 3-5 specific patterns found that indicate AI or human writing],
                    "suggestions": [array of 2-3 tips to make the text more human-like if it appears to be AI-generated]
                  }
                  
                  Be extremely thorough in your analysis. Look for subtle patterns like:
                  - Consistent sentence structures
                  - Lack of personal anecdotes or genuine opinions
                  - Excessive formality or perfectly balanced arguments
                  - Unnaturally consistent tone throughout
                  - Absence of contractions, slang, or idioms
                  - Repetitive transition phrases
                  
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
      
      try {
        // Extract JSON from the response text
        const jsonStartIndex = analysisText.indexOf('{');
        const jsonEndIndex = analysisText.lastIndexOf('}') + 1;
        const jsonString = analysisText.substring(jsonStartIndex, jsonEndIndex);
        
        const result = JSON.parse(jsonString) as AIDetectionResult;
        
        // Validate and ensure all fields exist
        return {
          score: Math.min(Math.max(result.score || 50, 0), 100),
          confidence: result.confidence || "medium",
          analysis: result.analysis || "Unable to provide detailed analysis.",
          patterns: result.patterns || ["No specific patterns detected."],
          suggestions: result.suggestions || ["No specific suggestions available."]
        };
      } catch (e) {
        console.error("Error parsing AI detection response:", e);
        
        // Fallback to regex pattern matching if JSON parsing fails
        const scoreMatch = analysisText.match(/score"?\s*:?\s*(\d+)/i);
        const confidenceMatch = analysisText.match(/confidence"?\s*:?\s*"(high|medium|low)"/i);
        const analysisMatch = analysisText.match(/analysis"?\s*:?\s*"([^"]+)"/i);
        
        return {
          score: scoreMatch ? Math.min(Math.max(parseInt(scoreMatch[1], 10), 0), 100) : 50,
          confidence: (confidenceMatch ? confidenceMatch[1].toLowerCase() : "medium") as "high" | "medium" | "low",
          analysis: analysisMatch ? analysisMatch[1] : "Unable to provide detailed analysis.",
          patterns: ["No specific patterns detected."],
          suggestions: ["No specific suggestions available."]
        };
      }
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
      analysis: "Unable to perform analysis due to an error. Please try again later.",
      patterns: ["Analysis failed due to an error."],
      suggestions: ["Try again later or use a different text sample."]
    };
  }
};
