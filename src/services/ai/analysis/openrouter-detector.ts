
import { API_KEY, BASE_URL, DEEPSEEK_MODEL, OPENROUTER_API_KEY, OPENROUTER_URL, OpenRouterResponse } from "../common";
import { OpenRouterModel, chooseAppropriateModel } from "../openrouter/openrouter-service";
import { calculateInitialAiScore } from "./score-calculator";
import requestCache from "../cache/request-cache";

export const detectAIContentWithOpenRouter = async (
  text: string,
  model: OpenRouterModel = OpenRouterModel.GPT4O
): Promise<number> => {
  try {
    // Generate a cache key based on the text content and model
    const cacheKey = `detect-openrouter-${model}-${text.substring(0, 100).replace(/\s+/g, '-')}`;
    
    // Check if we have a cached result
    const cachedResult = requestCache.get<number>(cacheKey);
    if (cachedResult !== null) {
      console.log("Using cached OpenRouter detection result");
      return cachedResult;
    }
    
    const selectedModel = chooseAppropriateModel(model);
    
    const response = await fetch(
      `${OPENROUTER_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Humanizer"
        },
        body: JSON.stringify({
          model: selectedModel,
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
          temperature: 0.1,
          max_tokens: 16
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    
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

    // If OpenRouter fails, fallback to DeepSeek API
    return await fallbackToDeepSeek(text);
  } catch (error) {
    console.error("Error detecting AI content with OpenRouter:", error);
    
    // Fallback to DeepSeek API
    return await fallbackToDeepSeek(text);
  }
};

// Fallback function that uses DeepSeek API if OpenRouter fails
const fallbackToDeepSeek = async (text: string): Promise<number> => {
  try {
    console.log("Falling back to DeepSeek API for AI detection");
    
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
          temperature: 0.1,
          max_tokens: 16
        }),
      }
    );

    if (!response.ok) {
      throw new Error("DeepSeek API error");
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const generatedText = data.choices[0].message.content;
      const scoreMatch = generatedText.match(/\d+/);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[0], 10);
        return Math.min(Math.max(score, 0), 100); // Ensure between 0-100
      }
    }
    
    throw new Error("Invalid response from DeepSeek API");
  } catch (error) {
    console.error("Error with DeepSeek fallback:", error);
    // If all else fails, use local calculation
    return calculateInitialAiScore(text);
  }
};
