
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, GeminiResponse } from "../common";
import { buildHumanizationPrompt } from "./prompt-builder";
import { humanizeTextLocally } from "./local-humanizer";

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
    // Set defaults for options
    const {
      approach = 'standard',
      iterationCount = 1
    } = options || {};
    
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
      throw new Error(errorData.error?.message || "Error calling AI service");
    }

    const data: GeminiResponse = await response.json();

    // Check for safety blocks
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    // Get the generated text
    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      return generatedText.trim();
    }

    throw new Error("No response generated");
  } catch (error) {
    console.error("Error humanizing text:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return text; // Return original text on error
  }
};
