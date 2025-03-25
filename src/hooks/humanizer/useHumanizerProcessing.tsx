
import { useToast } from "@/hooks/use-toast";
import { 
  humanizeText, optimizeText, runOptimizationIterations
} from '@/services/ai';
import { HumanizationOptions } from '@/services/ai/humanization/gemini-humanizer';
import { useUserLimits } from '@/hooks/useUserLimits';
import { useAuth } from '@/contexts/AuthContext';

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
  saveToHistory?: (originalText: string, humanizedText: string, score: number) => void;
  setError?: (error: string | null) => void;
}

export const useHumanizerProcessing = (deps: ProcessingDependencies) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { canUseHumanization, incrementUsage } = useUserLimits();
  
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
    setIsProcessing,
    saveToHistory,
    setError
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
    
    // Kiểm tra giới hạn sử dụng
    const wordCount = inputText.trim().split(/\s+/).length;
    const limitCheck = canUseHumanization(inputText);
    
    if (!limitCheck.allowed) {
      toast({
        title: "Giới hạn sử dụng",
        description: limitCheck.message,
        variant: "destructive",
      });
      return;
    }
    
    // Clear any previous errors
    setError && setError(null);
    setIsProcessing(true);
    
    try {
      // Validate input length
      if (inputText.length > 100000) {
        throw new Error("Text is too long. Please reduce the size of your input.");
      }
      
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
      
      // Cập nhật lượng sử dụng nếu người dùng đã đăng nhập
      if (user) {
        await incrementUsage({ humanizationWords: wordCount });
      }
      
      // Save to history
      if (saveToHistory && result.score) {
        saveToHistory(inputText, result.humanized, result.score);
      }
      
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
          setProgressValue,
          saveToHistory,
          inputText
        );
      } else {
        toast({
          title: "Humanization Complete",
          description: `Your text is now ${result.score}% human-like`,
        });
      }
    } catch (error) {
      console.error("Error in humanization process:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      // Set the error state if the setter is provided
      setError && setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
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
    
    // Kiểm tra giới hạn sử dụng
    const limitCheck = canUseHumanization(outputText);
    
    if (!limitCheck.allowed) {
      toast({
        title: "Giới hạn sử dụng",
        description: limitCheck.message,
        variant: "destructive",
      });
      return;
    }
    
    // Clear any previous errors
    setError && setError(null);
    setIsProcessing(true);
    
    try {
      const currentScore = humanScore || 0;
      const wordCount = outputText.trim().split(/\s+/).length;
      
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
      
      // Cập nhật lượng sử dụng nếu người dùng đã đăng nhập
      if (user) {
        await incrementUsage({ humanizationWords: wordCount });
      }
      
      // Save optimized version to history
      if (saveToHistory && result.score) {
        saveToHistory(inputText, result.optimized, result.score);
      }
      
      toast({
        title: "Optimization Complete",
        description: `Your text is now ${result.score}% human-like`,
      });
    } catch (error) {
      console.error("Error in optimization process:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      // Set the error state if the setter is provided
      setError && setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
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
