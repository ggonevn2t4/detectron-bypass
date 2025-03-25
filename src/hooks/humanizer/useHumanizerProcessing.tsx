
import { useToast } from "@/hooks/use-toast";
import { HumanizationOptions } from '@/services/ai/humanization/gemini-humanizer';
import { useUserLimits } from '@/hooks/useUserLimits';
import { useAuth } from '@/contexts/AuthContext';
import { executeHumanization, executeOptimization } from './humanizationUtils';
import { checkUsageLimits, trackUsage } from './usageTrackingUtils';
import { saveToHistory } from './historyUtils';
import { validateInput, handleProcessingError } from './errorUtils';
import { runOptimizationIterations } from '@/services/ai';

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
    saveToHistory: saveHistoryFn,
    setError
  } = deps;

  const handleHumanize = async () => {
    try {
      // Validate input
      validateInput(inputText);
      
      // Check usage limits
      const limitCheck = checkUsageLimits(inputText, canUseHumanization);
      if (!limitCheck.allowed) {
        return;
      }
      
      // Clear any previous errors
      if (setError) setError(null);
      setIsProcessing(true);
      
      // Calculate word count for usage tracking
      const wordCount = inputText.trim().split(/\s+/).length;
      
      // Prepare humanization options
      const options: HumanizationOptions = {
        targetScore: humanScoreTarget,
        approach: humanizationApproach,
        style: writingStyle
      };
      
      // Execute humanization
      const result = await executeHumanization(
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
      
      // Track usage
      await trackUsage(user, wordCount, incrementUsage);
      
      // Save to history
      if (saveHistoryFn && result.score) {
        saveToHistory(inputText, result.humanized, result.score, saveHistoryFn);
      }
      
      // Run auto-optimization if needed
      if (autoOptimize && result.score < humanScoreTarget && iterations > 1) {
        await runOptimizationIterations(
          result.humanized, // text
          result.score, // currentScore
          iterations - 1, // remainingIterations
          humanScoreTarget, // targetScore 
          usingRealAI, // usingRealAI
          { // options
            ...options,
            iterationCount: optimizationStage + 1
          },
          setOptimizationStage, // setOptimizationStage
          setOptimizationHistory, // setOptimizationHistory
          setOutputText, // setOutputText
          setHumanScore, // setHumanScore
          setProgressValue, // setProgressValue
          saveHistoryFn, // saveToHistory
          inputText // originalText
        );
      } else {
        toast({
          title: "Humanization Complete",
          description: `Your text is now ${result.score}% human-like`,
        });
      }
    } catch (error) {
      handleProcessingError(error, setError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOptimize = async () => {
    try {
      // Validate output text
      if (!outputText.trim()) {
        toast({
          title: "No Text to Optimize",
          description: "Please humanize text first before optimizing",
          variant: "default",
        });
        return;
      }
      
      // Check usage limits
      const limitCheck = checkUsageLimits(outputText, canUseHumanization);
      if (!limitCheck.allowed) {
        return;
      }
      
      // Clear any previous errors
      if (setError) setError(null);
      setIsProcessing(true);
      
      // Calculate word count for usage tracking
      const wordCount = outputText.trim().split(/\s+/).length;
      
      // Prepare optimization options
      const options: HumanizationOptions = {
        targetScore: humanScoreTarget,
        approach: humanizationApproach,
        style: writingStyle,
        iterationCount: optimizationStage + 1
      };
      
      // Execute optimization
      const result = await executeOptimization(
        outputText,
        humanScore || 0,
        usingRealAI,
        options,
        setProgressValue,
        setOptimizationStage,
        setOptimizationHistory,
        setOutputText,
        setHumanScore
      );
      
      // Track usage
      await trackUsage(user, wordCount, incrementUsage);
      
      // Save to history
      if (saveHistoryFn && result.score) {
        saveToHistory(inputText, result.humanized, result.score, saveHistoryFn);
      }
      
      toast({
        title: "Optimization Complete",
        description: `Your text is now ${result.score}% human-like`,
      });
    } catch (error) {
      handleProcessingError(error, setError);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleHumanize,
    handleOptimize
  };
};
