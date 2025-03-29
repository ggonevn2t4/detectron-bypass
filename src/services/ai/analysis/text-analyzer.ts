
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, DEEPSEEK_MODEL, DeepSeekResponse } from "../common";
import { calculateInitialAiScore } from "./score-calculator";
import requestCache from "../cache/request-cache";

export interface TextAnalysisResult {
  score: number;
  readability: string;
  tone: string;
  complexity: string;
  suggestions: string[];
}

export const analyzeText = async (text: string): Promise<TextAnalysisResult> => {
  try {
    // Generate a cache key based on the text content
    const cacheKey = `analyze-text-${text.substring(0, 100).replace(/\s+/g, '-')}`;
    
    // Check if we have a cached result
    const cachedResult = requestCache.get<TextAnalysisResult>(cacheKey);
    if (cachedResult !== null) {
      console.log("Using cached text analysis result");
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
          model: DEEPSEEK_MODEL,
          messages: [
            {
              role: "user",
              content: `Analyze the following text and provide an assessment of its readability, tone, complexity, and suggestions for improvement.
              
              Return your analysis in the following JSON format (no extra text outside the JSON):
              {
                "score": [0-100 representing quality],
                "readability": [brief readability assessment],
                "tone": [brief tone assessment],
                "complexity": [brief complexity assessment],
                "suggestions": [array of suggestions for improvement]
              }
              
              Text to analyze: "${text}"`
            }
          ],
          temperature: 0.3
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error analyzing text");
    }

    const data: DeepSeekResponse = await response.json();

    // Extract the JSON response
    if (data.choices && data.choices.length > 0) {
      const resultText = data.choices[0].message.content;
      try {
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : resultText;
        const resultJson = JSON.parse(jsonStr);
        
        // Ensure the result has the correct format
        const validatedResult: TextAnalysisResult = {
          score: typeof resultJson.score === 'number' ? 
            Math.min(Math.max(resultJson.score, 0), 100) : 
            75,
          readability: resultJson.readability || "No readability assessment available",
          tone: resultJson.tone || "No tone assessment available",
          complexity: resultJson.complexity || "No complexity assessment available",
          suggestions: Array.isArray(resultJson.suggestions) ? 
            resultJson.suggestions : 
            []
        };
        
        // Cache the result
        requestCache.set(cacheKey, validatedResult);
        
        return validatedResult;
      } catch (error) {
        console.error("Error parsing JSON from DeepSeek response:", error);
        throw new Error("Invalid response format from AI service");
      }
    }

    throw new Error("No valid response received from AI service");
  } catch (error) {
    console.error("Error in text analysis:", error);
    
    // Use fallback values
    return {
      score: 70,
      readability: "Unable to assess readability",
      tone: "Unable to assess tone",
      complexity: "Unable to assess complexity",
      suggestions: [
        "Consider revising for clarity",
        "Check for grammatical errors",
        "Ensure consistent tone"
      ]
    };
  }
};

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
          model: DEEPSEEK_MODEL,
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
