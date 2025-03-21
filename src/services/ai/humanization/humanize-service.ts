import { toast } from "@/hooks/use-toast";
import { 
  humanizeTextWithGemini, analyzeAIScore, 
  humanizeTextLocally, calculateInitialAiScore 
} from '@/services/ai';
import { HumanizationOptions } from './gemini-humanizer';

export interface OptimizationHistoryItem {
  score: number;
  text: string;
}

export const humanizeText = async (
  inputText: string, 
  usingRealAI: boolean, 
  options: HumanizationOptions,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>,
  setAiDetectionScore: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  setProgressValue(0);
  setOptimizationStage(0);
  setOptimizationHistory([]);
  
  try {
    const progressInterval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 300);
    
    let initialAiScore: number;
    if (usingRealAI) {
      initialAiScore = await analyzeAIScore(inputText);
    } else {
      initialAiScore = calculateInitialAiScore(inputText);
    }
    setAiDetectionScore(initialAiScore);
    
    let humanized: string;
    if (usingRealAI) {
      humanized = await humanizeTextWithGemini(
        inputText, 
        undefined, 
        options
      );
    } else {
      humanized = humanizeTextLocally(inputText);
    }
    
    setOutputText(humanized);
    
    let finalHumanScore: number;
    if (usingRealAI) {
      const newAiScore = await analyzeAIScore(humanized);
      finalHumanScore = 100 - newAiScore;
    } else {
      finalHumanScore = 100 - calculateInitialAiScore(humanized);
    }
    
    setOptimizationHistory([{
      score: finalHumanScore,
      text: humanized
    }]);
    
    setHumanScore(finalHumanScore);
    
    clearInterval(progressInterval);
    setProgressValue(100);
    
    return {
      humanized,
      score: finalHumanScore
    };
  } catch (error) {
    console.error("Error in humanization process:", error);
    throw error;
  }
};
