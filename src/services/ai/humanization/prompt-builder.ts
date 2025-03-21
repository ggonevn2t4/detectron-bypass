
import { isVietnameseText } from "../common";
import { englishHumanizationPrompt, vietnameseHumanizationPrompt, humanizationTrainingGuidelines } from "../prompts";

interface HumanizationPromptOptions {
  targetScore?: number;
  approach?: 'standard' | 'aggressive' | 'ultra';
  style?: string;
  iterationCount?: number;
  previousScore?: number;
}

export const buildHumanizationPrompt = (
  text: string,
  options?: HumanizationPromptOptions
): string => {
  // Set defaults for options
  const {
    targetScore = 95,
    approach = 'standard',
    style = 'general',
    iterationCount = 1,
    previousScore
  } = options || {};
  
  // Determine language and select appropriate prompt
  const isVietnamese = isVietnameseText(text);
  const basePrompt = isVietnamese ? vietnameseHumanizationPrompt : englishHumanizationPrompt;
  
  // Build a more detailed prompt based on settings
  let promptText = basePrompt;
  
  // Include the training guidelines for more comprehensive context
  if (approach === 'aggressive' || approach === 'ultra') {
    promptText += "\n\n" + humanizationTrainingGuidelines;
  }
  
  // Add approach-specific instructions
  if (approach === 'aggressive') {
    promptText += isVietnamese ? 
      "\nSử dụng cách tiếp cận tích cực hơn để nhân hóa văn bản. Thay đổi cấu trúc câu đáng kể và thay thế nhiều từ vựng, đồng thời vẫn giữ nguyên ý nghĩa. Thêm nhiều điểm ngắt tự nhiên, lỗi ngữ pháp nhỏ và cách diễn đạt không chính thức." :
      "\nUse a more aggressive approach to humanizing the text. Change sentence structures significantly and replace more vocabulary while maintaining the meaning. Add more natural breaks, minor grammatical errors, and informal expressions. Focus on techniques #3, #8, #10, and #14 from the humanization techniques list.";
  } else if (approach === 'ultra') {
    promptText += isVietnamese ?
      "\nSử dụng cách tiếp cận cực kỳ mạnh mẽ để nhân hóa. Viết lại hoàn toàn văn bản theo cách mà một người sẽ viết một cách tự nhiên, với ít cấu trúc chính thức hơn, nhiều ý kiến cá nhân, và thêm một số lỗi đánh máy hoặc ngữ pháp nhỏ như người viết thông thường. Nếu cần, có thể thay đổi cách trình bày chi tiết nhưng phải bảo toàn ý chính." :
      "\nUse an extremely powerful humanization approach. Completely rewrite the text as a human would naturally write, with less formal structure, more personal opinions, and adding some minor typos or grammatical errors as a typical writer would. Apply ALL the humanization techniques in the list, especially focusing on personal touches, idioms, casual phrasing, and creating an authentic voice. If necessary, change the presentation of details but preserve the main ideas.";
  }
  
  // Add writing style instructions
  if (style) {
    let styleInstructions = "";
    
    switch (style) {
      case 'academic':
        styleInstructions = isVietnamese ?
          "\nViết theo phong cách học thuật nhưng vẫn đảm bảo tính tự nhiên của con người. Sử dụng từ vựng chuyên ngành phù hợp, nhưng thêm một số cách diễn đạt chủ quan và cấu trúc câu đa dạng để tránh quá công thức." :
          "\nWrite in an academic style while ensuring human naturalness. Use appropriate specialized vocabulary, but add some subjective expressions and varied sentence structures to avoid being too formulaic. Include phrases like 'I argue that,' 'this suggests,' or 'interestingly' to create an authentic scholarly voice.";
        break;
      case 'casual':
        styleInstructions = isVietnamese ?
          "\nViết theo phong cách thân mật, hội thoại. Sử dụng cách nói lóng, từ ngữ đời thường, và các câu ngắn hơn. Thêm một số cụm từ chuyển tiếp như 'này', 'vậy đó', và các câu hỏi tu từ khi thích hợp." :
          "\nWrite in a casual, conversational style. Use slang, everyday language, and shorter sentences. Add transition phrases like 'you know', 'so anyway', and rhetorical questions where appropriate. Throw in some informal expressions and contractions to make it sound like a real person chatting.";
        break;
      case 'professional':
        styleInstructions = isVietnamese ?
          "\nViết theo phong cách chuyên nghiệp nhưng không quá khô khan. Sử dụng ngôn ngữ rõ ràng và chính xác, nhưng vẫn đảm bảo có sự uyển chuyển và cá tính trong giọng điệu." :
          "\nWrite in a professional but not overly dry style. Use clear and precise language, but ensure there is flexibility and personality in the tone. Include occasional first-person perspectives and thoughtful transitions between ideas to maintain a human touch.";
        break;
      case 'creative':
        styleInstructions = isVietnamese ?
          "\nViết theo phong cách mô tả sáng tạo với ngôn ngữ sinh động và hình ảnh phong phú. Sử dụng ẩn dụ, so sánh và từ ngữ gợi cảm. Thêm chi tiết để tạo không khí và bối cảnh." :
          "\nWrite in a creative descriptive style with vivid language and rich imagery. Use metaphors, similes, and evocative words. Add details to create atmosphere and context. Don't shy away from unusual word combinations or sentence structures that showcase personality and artistic expression.";
        break;
    }
    
    if (styleInstructions) {
      promptText += styleInstructions;
    }
  }
  
  // Customize prompt based on previous score and iteration count
  if (previousScore !== undefined) {
    if (previousScore < 80) {
      promptText += isVietnamese ? 
        `\nVăn bản hiện tại vẫn có điểm số ${previousScore}% giống AI. 
        Vui lòng làm cho nó GIỐNG CON NGƯỜI hơn nhiều bằng cách:
        - Thêm thành ngữ và từ lóng phổ biến
        - Bao gồm ý kiến cá nhân hoặc bình luận bên lề trong ngoặc đơn
        - Sử dụng dấu câu một cách tự nhiên hơn
        - Thêm các chuyển tiếp tự nhiên giữa các ý tưởng
        - Đây là lần lặp thứ ${iterationCount}, hãy làm cho nó gần đạt mục tiêu ${targetScore}%` :
        
        `\nThe current text is still scoring ${previousScore}% AI-like. 
        Please make it MUCH more human-like by:
        - Adding more colloquialisms and slang
        - Including personal opinions or asides in parentheses
        - Varying punctuation more naturally
        - Adding more conversational transitions between ideas
        - Using more contractions and informal phrasing
        - Adding sentence fragments for emphasis
        - This is iteration #${iterationCount}, aiming to get closer to the target of ${targetScore}%`;
    } else if (previousScore < targetScore) {
      promptText += isVietnamese ?
        `\nVăn bản hiện tại có điểm số ${previousScore}% giống con người, nhưng chúng ta cần đạt ${targetScore}%. 
        Tập trung vào các đặc điểm tinh tế của con người:
        - Thêm các sửa chữa ý tưởng giữa chừng
        - Sử dụng nhiều đại từ nhân xưng và ngôn ngữ chủ quan
        - Đôi khi thêm các câu hỏi tu từ
        - Đơn giản hóa thuật ngữ phức tạp thành giải thích thông thường
        - Đây là lần lặp thứ ${iterationCount}, hãy cố gắng đạt ${targetScore}%` :
        
        `\nThe current text is scoring ${previousScore}% human-like, but we need to reach ${targetScore}%. 
        Focus on subtle human traits:
        - Add occasional mid-thought corrections or clarifications
        - Use more personal pronouns and subjective language
        - Include rhetorical questions or direct reader engagement
        - Simplify complex terminology into more casual explanations
        - Add a personal anecdote or opinion if appropriate
        - This is iteration #${iterationCount}, try to reach ${targetScore}%`;
    }
  }
  
  promptText += isVietnamese ?
    `\nVăn bản cần nhân hóa: "${text}"` :
    `\nText to humanize: "${text}"`;
    
  return promptText;
};
