
import { 
  humanizeTextWithGemini, 
  humanizeTextWithOpenRouter,
  humanizeTextLocally,
  HumanizationOptions,
  HumanizationResult 
} from './gemini-humanizer';
import { analyzeAIScore } from '../analysis/text-analyzer';
import { API_KEY, BASE_URL, DEEPSEEK_MODEL, DeepSeekResponse } from "../common";

export interface OptimizationHistoryItem {
  iteration: number;
  text: string;
  score: number;
  timestamp: Date;
}

// Humanize text with DeepSeek API
export const humanizeTextWithDeepSeek = async (
  text: string,
  options: HumanizationOptions
): Promise<HumanizationResult> => {
  try {
    console.log("Humanizing text with DeepSeek API");
    
    // Prepare prompt based on options
    const stylePrompt = options.style ? `Use a ${options.style} writing style.` : '';
    const approachMap = {
      'standard': 'Make moderate changes to humanize the text while preserving the original meaning.',
      'aggressive': 'Make significant changes to sentence structure and vocabulary to sound more human.',
      'ultra': 'Completely rewrite the text to be indistinguishable from human writing, while preserving the core meaning.'
    };
    
    const approachPrompt = options.approach 
      ? approachMap[options.approach] 
      : approachMap['standard'];
    
    const targetPrompt = options.targetScore 
      ? `Aim to make the text score at least ${options.targetScore}% human-like.` 
      : 'Aim to make the text sound naturally human-written.';
    
    const iterationPrompt = options.iterationCount 
      ? `This is optimization iteration ${options.iterationCount}. The current human score is ${options.previousScore || '0'}%.` 
      : '';
    
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
              content: `
                Humanize the following text that was likely written by AI to make it sound more natural and human-written.
                ${approachPrompt}
                ${stylePrompt}
                ${targetPrompt}
                ${iterationPrompt}
                
                Text to humanize:
                "${text}"
                
                Make it sound like it was written by a real person, with natural language patterns, varying sentence structure, 
                occasional informal language, and more natural flow. Avoid overly formal structure or repetitive patterns.
                Preserve the original meaning, intent, and key information of the text.
                
                Return only the humanized text without any explanations, introductions, or quotation marks.
              `
            }
          ],
          temperature: 0.7,
          max_tokens: 2048
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error humanizing text");
    }

    const data: DeepSeekResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const humanizedText = data.choices[0].message.content.trim();
      
      // Get the AI score for the humanized text
      const humanScore = 100 - await analyzeAIScore(humanizedText);
      
      return {
        original: text,
        humanized: humanizedText,
        score: humanScore
      };
    }
    
    throw new Error("Failed to humanize text");
  } catch (error) {
    console.error("Error humanizing text with DeepSeek:", error);
    throw error;
  }
};

// Main humanize function that delegates to the appropriate implementation
export const humanizeText = async (
  text: string,
  usingRealAI: boolean,
  options: HumanizationOptions,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>,
  setAiDetectionScore?: React.Dispatch<React.SetStateAction<number | null>>
): Promise<HumanizationResult> => {
  try {
    // Start progress indicator
    setProgressValue(0);
    setOptimizationStage(options.iterationCount || 1);
    
    // Artificial delay and progress updates to provide visual feedback
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress > 90) {
        progress = 90;
        clearInterval(progressInterval);
      }
      setProgressValue(progress);
    }, 200);
    
    let result: HumanizationResult;
    
    if (!usingRealAI) {
      // Use local humanization if not using real AI
      result = await humanizeTextLocally(text, options);
    } else {
      // Use DeepSeek API for humanization (as primary method)
      result = await humanizeTextWithDeepSeek(text, options);
    }
    
    // Complete progress indicator
    clearInterval(progressInterval);
    setProgressValue(100);
    
    // Update UI with result
    setOutputText(result.humanized);
    setHumanScore(result.score);
    if (setAiDetectionScore) {
      setAiDetectionScore(100 - result.score);
    }
    
    // Add to optimization history
    const historyItem: OptimizationHistoryItem = {
      iteration: options.iterationCount || 1,
      text: result.humanized,
      score: result.score,
      timestamp: new Date()
    };
    
    setOptimizationHistory(prev => {
      // Find if there's already an item with this iteration
      const exists = prev.some(item => item.iteration === historyItem.iteration);
      if (exists) {
        // Replace existing iteration
        return prev.map(item => 
          item.iteration === historyItem.iteration ? historyItem : item
        );
      } else {
        // Add new iteration
        return [...prev, historyItem];
      }
    });
    
    return result;
  } catch (error) {
    setProgressValue(0);
    console.error("Error in humanization process:", error);
    throw error;
  }
};
