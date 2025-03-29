import { humanizeTextWithGemini, humanizeTextLocally, HumanizationOptions } from "./gemini-humanizer";
import { detectAIContent } from "../analysis/detailed-detector";
import { humanizeTextWithOpenRouter } from "./openrouter-humanizer";

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

export const humanizeText = async (
  text: string,
  useRealAI: boolean,
  humanizationOptions: HumanizationOptions,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>,
  setAiDetectionScore: React.Dispatch<React.SetStateAction<number | null>>
): Promise<HumanizationResult> => {
  const startTime = Date.now();
  let currentIteration = humanizationOptions.iterationCount || 0;
  
  // Determine which AI service to use
  const useOpenRouter = useRealAI && humanizationOptions.approach !== 'local';
  const useGemini = useRealAI && humanizationOptions.approach === 'standard';
  
  // Define the humanization function based on the selected AI service
  const humanizationFunction = useOpenRouter 
  ? (text: string) => humanizeTextWithOpenRouter(text) 
  : useGemini
    ? (text: string) => humanizeTextWithGemini(text, humanizationOptions) 
    : (text: string) => humanizeTextLocally(text);

  // Humanize the text
  const humanized = await humanizationFunction(text);
  
  // Analyze the AI score
  const aiDetectionResult = await detectAIContent(humanized);
  const aiScore = aiDetectionResult.score;
  
  // Calculate elapsed time
  const endTime = Date.now();
  const elapsedTime = (endTime - startTime) / 1000;
  
  // Update state
  setOutputText(humanized);
  setHumanScore(100 - aiScore);
  setAiDetectionScore(aiScore);
  setProgressValue(100);
  
  // Update optimization history
  setOptimizationHistory((prev: OptimizationHistoryItem[]) => [
    ...prev,
    {
      iteration: currentIteration,
      score: 100 - aiScore,
      text: humanized,
      timestamp: new Date()
    }
  ]);
  
  // Log the results
  console.log(`Humanization completed in ${elapsedTime} seconds. AI Score: ${aiScore}`);
  
  return {
    humanized: humanized,
    score: 100 - aiScore
  };
};
