
import { toast } from "@/hooks/use-toast";
import { API_KEY, BASE_URL, DeepSeekResponse } from "../common";
import { buildHumanizationPrompt } from "./prompt-builder";
import { humanizeTextLocally } from "./local-humanizer";
import requestCache from "../cache/request-cache";
import { OpenRouterModel } from "../openrouter/openrouter-service";

export interface HumanizationOptions {
  targetScore?: number;
  approach?: 'standard' | 'aggressive' | 'ultra';
  style?: string;
  iterationCount?: number;
  model?: OpenRouterModel | string;
  previousScore?: number;
}

// Advanced humanization using DeepSeek API
export const humanizeTextWithGemini = async (
  text: string, 
  previousScore?: number, 
  options?: HumanizationOptions
): Promise<string> => {
  try {
    // Check if API key is available
    if (!API_KEY) {
      throw new Error("Missing API key. Cannot perform humanization.");
    }
    
    // Check text length
    if (text.length > 100000) {
      throw new Error("Text is too long. Please reduce the size of your input.");
    }
    
    // Set defaults for options
    const {
      approach = 'standard',
      iterationCount = 1,
      style = 'general',
      model = 'deepseek-chat'
    } = options || {};
    
    // Generate a cache key based on the text and options
    const cacheKey = `humanize-${approach}-${iterationCount}-${style}-${previousScore || 0}-${text.substring(0, 50).replace(/\s+/g, '-')}`;
    
    // Check if we have a cached result
    const cachedResult = requestCache.get<string>(cacheKey);
    if (cachedResult !== null) {
      console.log("Using cached humanization result");
      return cachedResult;
    }
    
    // Build the prompt based on user options
    const promptText = buildHumanizationPrompt(text, {
      ...options,
      previousScore
    });

    // Set temperature based on approach
    const temperature = approach === 'ultra' ? 1.0 : approach === 'aggressive' ? 0.9 : 0.8;

    const response = await fetch(
      `${BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: promptText
            }
          ],
          temperature: temperature,
          max_tokens: 2048
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Humanizer API error:", errorData);
      throw new Error(errorData.error?.message || "Error calling AI service");
    }

    const data: DeepSeekResponse = await response.json();

    // Check if we have choices
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response generated from the AI service");
    }

    // Get the generated text
    const generatedText = data.choices[0].message.content;
    const result = generatedText.trim();
    
    // Verify we got a valid response
    if (!result || result.length < 10) {
      throw new Error("Generated text is too short or empty");
    }
    
    // Cache the result
    requestCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error("Error humanizing text:", error);
    
    // Provide a more helpful error by checking for network issues
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Network error. Please check your internet connection.");
    }
    
    // Re-throw for handling by the caller
    throw error;
  }
};

// Make local humanizer available for import
export { humanizeTextLocally };
