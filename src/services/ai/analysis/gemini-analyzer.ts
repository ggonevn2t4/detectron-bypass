
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, DeepSeekResponse } from "../common";
import { calculateInitialAiScore } from "./score-calculator";
import requestCache from "../cache/request-cache";

export const analyzeAIScore = async (text: string): Promise<number> => {
  try {
    // Generate a cache key based on the text content
    const cacheKey = `analyze-score-${text.substring(0, 100).replace(/\s+/g, '-')}`;
    
    // Check if we have a cached result
    const cachedResult = requestCache.get<number>(cacheKey);
    if (cachedResult !== null) {
      console.log("Using cached AI score analysis result");
      return cachedResult;
    }
    
    const response = await fetch(
      `${BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: `Analyze the following text and provide only a number from 0-100 indicating how likely it was written by AI (100 = definitely AI, 0 = definitely human).
              Be extremely critical of perfect grammar, formal language, and structured writing patterns which are typical AI traits.
              Look for human qualities like minor typos, informal language, contractions, personal anecdotes, or opinions.
              Return ONLY the number, no other text or explanation.
              
              Text to analyze: "${text}"`
            }
          ],
          temperature: 0.1, // Low temperature for more consistent scoring
          max_tokens: 16
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error analyzing text");
    }

    const data: DeepSeekResponse = await response.json();

    // Get the generated score
    if (data.choices && data.choices.length > 0) {
      const generatedText = data.choices[0].message.content;
      const scoreMatch = generatedText.match(/\d+/);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[0], 10);
        const finalScore = Math.min(Math.max(score, 0), 100); // Ensure between 0-100
        
        // Cache the result
        requestCache.set(cacheKey, finalScore);
        
        return finalScore;
      }
    }

    // If we couldn't get a proper score, use the local calculation
    const calculatedScore = calculateInitialAiScore(text);
    requestCache.set(cacheKey, calculatedScore);
    return calculatedScore;
  } catch (error) {
    console.error("Error analyzing AI score:", error);
    // Use local calculation as fallback
    return calculateInitialAiScore(text);
  }
};
