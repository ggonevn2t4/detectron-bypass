import { AIGenerationOptions, AIGenerationResult } from "./generate";
import { OPENROUTER_API_KEY, OPENROUTER_URL, OpenRouterResponse } from "./common";

export const generateAIContentWithOpenRouter = async (
  options: AIGenerationOptions
): Promise<AIGenerationResult> => {
  try {
    const formatMap: Record<string, string> = {
      article: "informative article",
      blog: "engaging blog post",
      essay: "well-structured essay",
      story: "narrative story",
      summary: "concise summary"
    };

    const audienceMap: Record<string, string> = {
      general: "general audience",
      technical: "technical experts",
      business: "business professionals",
      academic: "academic readers"
    };

    const formatInstruction = options.format ? `Format: ${formatMap[options.format]}` : '';
    const audienceInstruction = options.audience ? `Target audience: ${audienceMap[options.audience]}` : '';
    const headingsInstruction = options.includeHeadings ? "Include clear headings and subheadings." : '';
    const factsInstruction = options.includeFacts ? "Include relevant facts and statistics when possible." : '';
    const quotesInstruction = options.includeQuotes ? "Include some expert quotes on the topic." : '';

    const prompt = `
      Generate well-written content about "${options.topic}".
      ${formatInstruction}
      ${audienceInstruction}
      ${headingsInstruction}
      ${factsInstruction}
      ${quotesInstruction}
      ${options.additionalInstructions ? `Additional instructions: ${options.additionalInstructions}` : ''}
      
      The content should be organized with clear structure, accurate information, and engaging writing style.
      Focus on providing valuable information and insights about the topic.
      
      Return the content in the following JSON format:
      {
        "title": "An appropriate title for the content",
        "content": "The generated content here"
      }
    `;
    
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
          model: "mistralai/mistral-medium",
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
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const generatedContent = data.choices[0].message.content.trim();
      let contentJson: any = {};
      try {
        contentJson = JSON.parse(generatedContent);
      } catch (e) {
        console.log("Response was not in JSON format, using raw text");
      }
      
      const contentText = contentJson.content || generatedContent;
      const wordCount = contentText.split(/\s+/).length;
      const characterCount = contentText.length;
      
      const result: AIGenerationResult = {
        content: contentText,
        wordCount,
        characterCount,
        title: contentJson.title || "",
        estimatedWordCount: wordCount,
        qualityScore: 90
      };
      
      return result;
    }
    
    throw new Error("Failed to generate content");
  } catch (error) {
    console.error("Error generating content with OpenRouter:", error);
    
    // Return empty result on error
    return {
      content: "",
      wordCount: 0,
      characterCount: 0
    };
  }
};
