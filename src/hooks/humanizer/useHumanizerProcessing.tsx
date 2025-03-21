
import { useToast } from "@/hooks/use-toast";
import { 
  humanizeText, optimizeText, runOptimizationIterations
} from '@/services/ai';
import { HumanizationOptions } from '@/services/ai/humanization/gemini-humanizer';

export interface ProcessingDependencies {
  inputText: string;
  outputText: string;
  humanScore: number | null;
  usingRealAI: boolean;
  humanScoreTarget: number;
  humanizationApproach: 'standard' | 'aggressive' | 'ultra';
  writingStyle: string;
  iterations: number;
  autoOptimize: boolean;
  optimizationStage: number;
  setOutputText: (text: string) => void;
  setHumanScore: (score: number | null) => void;
  setAiDetectionScore: (score: number | null) => void;
  setProgressValue: (value: number) => void;
  setOptimizationStage: (stage: number) => void;
  setOptimizationHistory: (history: any) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

export const useHumanizerProcessing = (deps: ProcessingDependencies) => {
  const { toast } = useToast();
  const {
    inputText,
    outputText,
    humanScore,
    usingRealAI,
    humanScoreTarget,
    humanizationApproach,
    writingStyle,
    iterations,
    autoOptimize,
    optimizationStage,
    setOutputText,
    setHumanScore,
    setAiDetectionScore,
    setProgressValue,
    setOptimizationStage,
    setOptimizationHistory,
    setIsProcessing
  } = deps;

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to humanize",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const options: HumanizationOptions = {
        targetScore: humanScoreTarget,
        approach: humanizationApproach,
        style: writingStyle
      };
      
      const result = await humanizeText(
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
      
      if (autoOptimize && result.score < humanScoreTarget && iterations > 1) {
        await runOptimizationIterations(
          result.humanized,
          result.score,
          iterations - 1,
          humanScoreTarget,
          usingRealAI,
          {
            ...options,
            iterationCount: optimizationStage + 1
          },
          setOptimizationStage,
          setOptimizationHistory,
          setOutputText,
          setHumanScore,
          setProgressValue
        );
      } else {
        toast({
          title: "Humanization Complete",
          description: `Your text is now ${result.score}% human-like`,
        });
      }
    } catch (error) {
      console.error("Error in humanization process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimize = async () => {
    if (!outputText.trim()) {
      toast({
        title: "No Text to Optimize",
        description: "Please humanize text first before optimizing",
        variant: "default",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const currentScore = humanScore || 0;
      
      const options: HumanizationOptions = {
        targetScore: humanScoreTarget,
        approach: humanizationApproach,
        style: writingStyle,
        iterationCount: optimizationStage + 1
      };
      
      const result = await optimizeText(
        outputText,
        currentScore,
        usingRealAI,
        options,
        setProgressValue,
        setOptimizationStage,
        setOptimizationHistory,
        setOutputText,
        setHumanScore
      );
      
      toast({
        title: "Optimization Complete",
        description: `Your text is now ${result.score}% human-like`,
      });
    } catch (error) {
      console.error("Error in optimization process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleHumanize,
    handleOptimize
  };
};
