import { HumanizationOptions, humanizeTextWithGemini, humanizeTextLocally } from "../humanization/gemini-humanizer";
import { detectAIContent } from "../analysis/detailed-detector";
import { humanizeTextWithOpenRouter } from "./openrouter-humanizer";
import { OpenRouterModel } from "../openrouter/openrouter-service";

export interface HumanizationResult {
  humanized: string;
  score: number;
}

export interface OptimizationHistoryItem {
  iteration: number;
  score: number;
  text: string;
  timestamp: Date;
}

const useGemini = true;
const useOpenRouter = false;

export const humanizeText = async (
  text: string,
  usingRealAI: boolean,
  humanizationOptions: HumanizationOptions,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>,
  setAiDetectionScore: React.Dispatch<React.SetStateAction<number | null>>
): Promise<HumanizationResult> => {
  const iterationCount = humanizationOptions.iterationCount || 0;
  
  // Local function to update progress
  const updateProgress = (progress: number) => {
    setProgressValue(progress);
  };
  
  // Local function to update optimization stage
  const updateOptimizationStage = (stage: number) => {
    setOptimizationStage(stage);
  };
  
  // Local function to update optimization history
  const updateOptimizationHistory = (score: number, text: string) => {
    setOptimizationHistory((prev: OptimizationHistoryItem[]) => [
      ...prev,
      {
        iteration: iterationCount,
        score: score,
        text: text,
        timestamp: new Date()
      }
    ]);
  };
  
  // Choose the appropriate humanization function
  const humanizationFunction = useOpenRouter 
  ? (text: string) => humanizeTextWithOpenRouter(text) 
  : useGemini
    ? (text: string, options: any) => humanizeTextWithGemini(text, options) 
    : (text: string) => humanizeTextLocally(text);

  // Humanize the text
  const humanizedText = await humanizationFunction(text, humanizationOptions);
  
  // Analyze the AI score
  const aiDetectionResult = await detectAIContent(humanizedText);
  const aiScore = aiDetectionResult.score;
  
  // Update the output text
  setOutputText(humanizedText);
  
  // Update the human score
  setHumanScore(100 - aiScore);
  
  // Update the AI detection score
  setAiDetectionScore(aiScore);
  
  // Update the optimization history
  updateOptimizationHistory(100 - aiScore, humanizedText);
  
  return {
    humanized: humanizedText,
    score: 100 - aiScore
  };
};
