
import { API_KEY, BASE_URL, DEEPSEEK_MODEL, DeepSeekResponse } from "../common";
import { calculateInitialAiScore } from "./score-calculator";
import requestCache from "../cache/request-cache";

export interface AIDetectionResult {
  score: number;
  confidence: 'low' | 'medium' | 'high';
  analysis: string;
  patterns: Array<{
    pattern: string;
    description: string;
    examples: string[];
  }>;
  suggestions: string[];
}

export const detectAIContent = async (text: string): Promise<AIDetectionResult> => {
  try {
    // Generate a cache key based on the text content
    const cacheKey = `detect-detailed-${text.substring(0, 100).replace(/\s+/g, '-')}`;
    
    // Check if we have a cached result
    const cachedResult = requestCache.get<AIDetectionResult>(cacheKey);
    if (cachedResult !== null) {
      console.log("Using cached detailed AI detection result");
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
              content: `Analyze the following text and provide a detailed assessment of whether it was likely written by AI or a human. 
              
              Return your analysis in the following JSON format (no extra text outside the JSON):
              {
                "score": [0-100 representing likelihood of AI content],
                "confidence": ["low", "medium", or "high"],
                "analysis": [summary of why you think it's AI or human-written],
                "patterns": [
                  {
                    "pattern": [pattern name],
                    "description": [description of pattern],
                    "examples": [array of examples from the text]
                  }
                ],
                "suggestions": [array of suggestions to make the text sound more human]
              }
              
              Text to analyze: "${text}"`
            }
          ],
          temperature: 0.1
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
        const validatedResult: AIDetectionResult = {
          score: typeof resultJson.score === 'number' ? 
            Math.min(Math.max(resultJson.score, 0), 100) : 
            calculateInitialAiScore(text),
          confidence: ['low', 'medium', 'high'].includes(resultJson.confidence) ? 
            resultJson.confidence as 'low' | 'medium' | 'high' : 
            'medium',
          analysis: resultJson.analysis || "No detailed analysis available",
          patterns: Array.isArray(resultJson.patterns) ? 
            resultJson.patterns.map((p: any) => ({
              pattern: p.pattern || "Unknown pattern",
              description: p.description || "",
              examples: Array.isArray(p.examples) ? p.examples : []
            })) : 
            [],
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
    console.error("Error in detailed AI detection:", error);
    
    // Use local calculation as fallback
    const score = calculateInitialAiScore(text);
    const fallbackResult: AIDetectionResult = {
      score,
      confidence: 'low',
      analysis: "Unable to perform detailed analysis. Using basic pattern detection instead.",
      patterns: [
        {
          pattern: "Basic patterns",
          description: "Simple linguistic patterns detected by local analysis",
          examples: []
        }
      ],
      suggestions: [
        "Add more personal anecdotes",
        "Vary sentence structure and length",
        "Include conversational phrases and contractions"
      ]
    };
    
    return fallbackResult;
  }
};
