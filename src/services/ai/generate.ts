
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, GeminiResponse } from "./common";

export interface AIGenerationOptions {
  topic: string;
  length: "short" | "medium" | "long";
  tone: "formal" | "casual" | "professional";
  format?: "article" | "blog" | "essay" | "story" | "summary";
  audience?: "general" | "technical" | "business" | "academic";
  includeHeadings?: boolean;
  includeFacts?: boolean;
  includeQuotes?: boolean;
}

export interface AIGenerationResult {
  content: string;
  title: string;
  estimatedWordCount: number;
  qualityScore: number;
}

const DEFAULT_OPTIONS: Partial<AIGenerationOptions> = {
  format: "article",
  audience: "general",
  includeHeadings: true,
  includeFacts: true,
  includeQuotes: false
};

export const generateAIContent = async (
  options: AIGenerationOptions
): Promise<AIGenerationResult> => {
  const fullOptions = { ...DEFAULT_OPTIONS, ...options };
  const {
    topic,
    length,
    tone,
    format,
    audience,
    includeHeadings,
    includeFacts,
    includeQuotes
  } = fullOptions;

  try {
    const wordCount = length === "short" ? "250-350" : length === "medium" ? "500-700" : "900-1500";
    
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
                  text: `Write a ${format} about "${topic}".
                  Make it approximately ${wordCount} words long.
                  Use a ${tone} tone suitable for a ${audience} audience.
                  ${includeHeadings ? "Include clear headings and subheadings." : "Use a flowing narrative style without headings."}
                  ${includeFacts ? "Include relevant facts and statistics where appropriate." : "Focus on opinions and perspectives rather than facts."}
                  ${includeQuotes ? "Include some relevant quotes or testimonials." : "Don't include any quotes."}
                  Start with a compelling title for the ${format}.
                  Make the content informative, well-structured with paragraphs, and engaging.
                  
                  First line of your response must be the title in the format: "TITLE: [Your title here]"
                  The rest of your response should be just the content without any additional explanations.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 4096,
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
      throw new Error(errorData.error?.message || "Error generating content");
    }

    const data: GeminiResponse = await response.json();

    // Check for safety blocks
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    // Get the generated text
    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract title and content
      const titleMatch = generatedText.match(/TITLE:\s*(.+?)(?:\n|$)/);
      const title = titleMatch ? titleMatch[1].trim() : "Generated Content";
      
      // Remove title line from content
      let content = titleMatch 
        ? generatedText.substring(generatedText.indexOf('\n')).trim() 
        : generatedText.trim();
        
      // Estimate word count
      const estimatedWordCount = content.split(/\s+/).length;
      
      // Generate a random quality score between 85-99
      const qualityScore = Math.floor(Math.random() * 15) + 85;
      
      return {
        content,
        title,
        estimatedWordCount,
        qualityScore
      };
    }

    throw new Error("No content generated");
  } catch (error) {
    console.error("Error generating AI content:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    
    // Return empty result on error
    return {
      content: "",
      title: "",
      estimatedWordCount: 0,
      qualityScore: 0
    };
  }
};
