
import { callOpenRouterAPI, OpenRouterModel } from "./openrouter/openrouter-service";
import { AIGenerationOptions, AIGenerationResult } from "./generate";

/**
 * Tạo nội dung sử dụng OpenRouter API
 */
export const generateAIContentWithOpenRouter = async (
  options: AIGenerationOptions
): Promise<AIGenerationResult> => {
  try {
    const {
      topic,
      length = 'medium',
      tone = 'formal',
      format = 'article',
      audience = 'general',
      includeHeadings = true,
      includeFacts = true,
      includeQuotes = false
    } = options;
    
    // Xác định độ dài dựa trên tùy chọn
    const wordCountTarget = 
      length === 'short' ? '300-500 words' :
      length === 'medium' ? '700-1000 words' :
      '1500-2000 words';
    
    // Chọn mô hình dựa trên độ phức tạp
    const model = 
      length === 'long' ? OpenRouterModel.CLAUDE_3_SONNET :
      length === 'medium' ? OpenRouterModel.GPT4O :
      OpenRouterModel.GPT4O_MINI;
    
    // Xây dựng prompt cho việc tạo nội dung
    const prompt = `Generate a ${format} about "${topic}" in ${wordCountTarget}.
    
    Details:
    - Tone: ${tone}
    - Target audience: ${audience}
    ${includeHeadings ? '- Include clear section headings' : '- Write in paragraph form without headings'}
    ${includeFacts ? '- Include relevant facts and statistics' : '- Focus on general knowledge without specific statistics'}
    ${includeQuotes ? '- Include some relevant quotes' : '- No need to include quotes'}
    
    First, generate a compelling title. Then write the content in a structured, engaging manner.`;
    
    // Hệ thống prompt cho việc tạo nội dung
    const systemPrompt = `You are an expert content creator specializing in ${format}s for ${audience} audiences. 
Your writing style is ${tone} and highly engaging. 
Your content is well-structured, evidence-based, and compelling.
Always start with a compelling title separated by two newlines from the content.
${includeHeadings ? 'Use clear headings to organize the content.' : 'Write in flowing paragraphs without headings.'}`;
    
    // Gọi OpenRouter API
    const generatedContent = await callOpenRouterAPI(prompt, systemPrompt, {
      model,
      temperature: 0.7,
      max_tokens: length === 'long' ? 3000 : length === 'medium' ? 2000 : 1000
    });
    
    // Trích xuất tiêu đề và nội dung
    let title = "Generated Content";
    let content = generatedContent;
    
    // Tách tiêu đề và nội dung
    const titleMatch = generatedContent.match(/^(.*?)\n\n([\s\S]*)$/);
    if (titleMatch) {
      title = titleMatch[1].replace(/^#\s+/, ''); // Loại bỏ markdown # nếu có
      content = titleMatch[2];
    }
    
    // Ước tính số từ
    const wordCount = content.split(/\s+/).length;
    
    // Tính toán điểm chất lượng (giả lập)
    const qualityScore = Math.floor(Math.random() * 10) + 85; // Số ngẫu nhiên từ 85-95
    
    return {
      title,
      content,
      estimatedWordCount: wordCount,
      qualityScore
    };
  } catch (error) {
    console.error("Error generating content with OpenRouter:", error);
    throw error;
  }
};
