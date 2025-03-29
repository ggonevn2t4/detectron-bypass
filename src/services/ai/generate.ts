
import { toast } from "@/hooks/use-toast";
import { API_KEY, BASE_URL, DEEPSEEK_MODEL, DeepSeekResponse } from "./common";
import requestCache from "./cache/request-cache";

export interface AIGenerationOptions {
  topic: string;
  length?: 'short' | 'medium' | 'long';
  tone?: 'casual' | 'professional' | 'academic';
  language?: string;
  additionalInstructions?: string;
  format?: 'article' | 'blog' | 'essay' | 'story' | 'summary';
  audience?: 'general' | 'technical' | 'business' | 'academic';
  includeHeadings?: boolean;
  includeFacts?: boolean;
  includeQuotes?: boolean;
}

export interface AIGenerationResult {
  content: string;
  wordCount: number;
  characterCount: number;
  title?: string;
  estimatedWordCount?: number;
  qualityScore?: number;
  options?: {
    topic?: string;
    length?: string;
    tone?: string;
    format?: string;
    audience?: string;
  };
}

export const generateAIContent = async (
  options: AIGenerationOptions
): Promise<AIGenerationResult> => {
  try {
    // Create a unique cache key based on the generation options
    const cacheKey = `generate-${options.topic.substring(0, 50).replace(/\s+/g, '-')}-${options.length}-${options.tone}`;
    
    // Check if we have a cached result
    const cachedResult = requestCache.get<AIGenerationResult>(cacheKey);
    if (cachedResult !== null) {
      console.log("Using cached AI generation result");
      return cachedResult;
    }
    
    // Prepare prompt based on options
    const lengthMap = {
      'short': '150-200 words',
      'medium': '300-400 words',
      'long': '600-800 words'
    };
    
    const toneMap = {
      'casual': 'conversational and friendly',
      'professional': 'formal and business-like',
      'academic': 'scholarly and research-oriented'
    };
    
    const lengthInstruction = options.length ? lengthMap[options.length] : '300-400 words';
    const toneInstruction = options.tone ? toneMap[options.tone] : 'professional and informative';
    const languageInstruction = options.language ? `in ${options.language}` : '';
    
    const prompt = `
      Generate well-written content about "${options.topic}" ${languageInstruction}.
      Length: ${lengthInstruction}
      Tone: ${toneInstruction}
      ${options.additionalInstructions ? `Additional instructions: ${options.additionalInstructions}` : ''}
      
      The content should be organized with clear structure, accurate information, and engaging writing style.
      Focus on providing valuable information and insights about the topic.
      
      Return the content in the following JSON format:
      {
        "title": "An appropriate title for the content",
        "content": "The generated content here",
        "wordCount": estimatedWordCount
      }
    `;
    
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
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2048
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error generating content");
    }

    const data: DeepSeekResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const generatedContent = data.choices[0].message.content.trim();
      let title = "";
      let contentText = generatedContent;
      let estimatedWordCount = 0;
      
      // Try to parse JSON if available
      try {
        const contentJson = JSON.parse(generatedContent);
        if (contentJson.content) {
          contentText = contentJson.content;
          title = contentJson.title || "";
          estimatedWordCount = contentJson.wordCount || contentText.split(/\s+/).length;
        }
      } catch (e) {
        console.log("Response was not in JSON format, using raw text");
      }
      
      const wordCount = contentText.split(/\s+/).length;
      const characterCount = contentText.length;
      
      const result: AIGenerationResult = {
        content: contentText,
        wordCount,
        characterCount,
        title,
        estimatedWordCount: estimatedWordCount || wordCount,
        qualityScore: Math.floor(Math.random() * 20) + 80, // Placeholder quality score
        options: {
          topic: options.topic,
          length: options.length,
          tone: options.tone,
          format: options.format,
          audience: options.audience
        }
      };
      
      // Cache the result
      requestCache.set(cacheKey, result);
      
      return result;
    }
    
    throw new Error("Failed to generate content");
  } catch (error) {
    console.error("Error generating content:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred while generating content",
      variant: "destructive",
    });
    
    // Return empty result on error
    return {
      content: "",
      wordCount: 0,
      characterCount: 0
    };
  }
};
