
import { HumanizationOptions } from '@/services/ai/humanization/gemini-humanizer';
import { 
  humanizeText as humanizeTextService,
  OptimizationHistoryItem 
} from '@/services/ai';

export interface HumanizationResult {
  humanized: string;
  score: number;
}

/**
 * Execute the humanization process with progress tracking
 */
export const executeHumanization = async (
  inputText: string,
  usingRealAI: boolean,
  options: HumanizationOptions,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>,
  setAiDetectionScore: React.Dispatch<React.SetStateAction<number | null>>
): Promise<HumanizationResult> => {
  try {
    // Reset optimization stage at the beginning
    setOptimizationStage(0);
    
    const result = await humanizeTextService(
      inputText,
      usingRealAI,
      options,
      setProgressValue,
      setOptimizationStage,
      setOptimizationHistory,
      setOutputText,
      setHumanScore,
      setAiDetectionScore
    );
    
    return {
      humanized: result.humanized,
      score: result.score
    };
  } catch (error) {
    console.error("Error in humanization process:", error);
    throw error;
  }
}

/**
 * Execute the optimization process with progress tracking
 */
export const executeOptimization = async (
  text: string,
  currentScore: number,
  usingRealAI: boolean,
  options: HumanizationOptions,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>
): Promise<HumanizationResult> => {
  try {
    // Call the external service for text optimization
    const result = await humanizeTextService(
      text,
      usingRealAI,
      { ...options, previousScore: currentScore },
      setProgressValue,
      setOptimizationStage,
      setOptimizationHistory,
      setOutputText,
      setHumanScore,
      () => {} // No need to track AI detection score during optimization
    );
    
    return {
      humanized: result.humanized,
      score: result.score
    };
  } catch (error) {
    console.error("Error in optimization process:", error);
    throw error;
  }
}
