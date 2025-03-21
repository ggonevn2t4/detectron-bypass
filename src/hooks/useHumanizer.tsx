
import { useHumanizerState } from './humanizer/useHumanizerState';
import { useHumanizerTextHandlers } from './humanizer/useHumanizerTextHandlers';
import { useHumanizerProcessing } from './humanizer/useHumanizerProcessing';
import { useHumanizerEffects } from './humanizer/useHumanizerEffects';

export const useHumanizer = () => {
  // State management
  const {
    inputText, setInputText,
    outputText, setOutputText,
    isProcessing, setIsProcessing,
    wordCount, setWordCount,
    humanScore, setHumanScore,
    aiDetectionScore, setAiDetectionScore,
    progressValue, setProgressValue,
    usingRealAI, setUsingRealAI,
    showAdvancedSettings, setShowAdvancedSettings,
    humanScoreTarget, setHumanScoreTarget,
    humanizationApproach, setHumanizationApproach,
    iterations, setIterations,
    autoOptimize, setAutoOptimize,
    writingStyle, setWritingStyle,
    optimizationStage, setOptimizationStage,
    optimizationHistory, setOptimizationHistory,
  } = useHumanizerState();

  // Text handling functions
  const {
    handleInputChange,
    handleSampleText,
    handleCopy,
    handleDownload
  } = useHumanizerTextHandlers(setInputText, setWordCount);

  // Processing functions
  const {
    handleHumanize,
    handleOptimize
  } = useHumanizerProcessing({
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
  });

  // Side effects
  useHumanizerEffects({
    inputText,
    setHumanScore,
    setAiDetectionScore,
    setOptimizationHistory,
    setOptimizationStage
  });

  return {
    // State
    inputText,
    outputText,
    isProcessing,
    wordCount,
    humanScore,
    aiDetectionScore,
    progressValue,
    usingRealAI,
    showAdvancedSettings,
    humanScoreTarget,
    humanizationApproach,
    iterations,
    autoOptimize,
    writingStyle,
    optimizationStage,
    optimizationHistory,
    
    // Handlers
    handleInputChange,
    handleSampleText,
    handleHumanize,
    handleOptimize,
    handleCopy,
    handleDownload,
    
    // Setters
    setUsingRealAI,
    setShowAdvancedSettings,
    setHumanScoreTarget,
    setHumanizationApproach,
    setIterations,
    setAutoOptimize,
    setWritingStyle
  };
};
