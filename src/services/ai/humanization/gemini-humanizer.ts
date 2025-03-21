
import { toast } from "@/hooks/use-toast";
import { API_KEY, BASE_URL, GeminiResponse } from "../common";
import { buildHumanizationPrompt } from "./prompt-builder";
import { humanizeTextLocally } from "./local-humanizer";
import requestCache from "../cache/request-cache";

export interface HumanizationOptions {
  targetScore?: number;
  approach?: 'standard' | 'aggressive' | 'ultra';
  style?: string;
  iterationCount?: number;
}

// Advanced humanization prompt engineering for better results
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
      style = 'general'
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
                  text: promptText,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: approach === 'ultra' ? 1.0 : approach === 'aggressive' ? 0.9 : 0.8,
            topP: approach === 'ultra' ? 0.95 : approach === 'aggressive' ? 0.9 : 0.85,
            topK: 40,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Humanizer API error:", errorData);
      throw new Error(errorData.error?.message || "Error calling AI service");
    }

    const data: GeminiResponse = await response.json();

    // Check for safety blocks
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    // Check if we have candidates
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated from the AI service");
    }

    // Get the generated text
    const generatedText = data.candidates[0].content.parts[0].text;
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
