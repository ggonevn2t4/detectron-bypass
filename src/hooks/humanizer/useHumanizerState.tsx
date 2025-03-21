
import { useState } from 'react';
import { OptimizationHistoryItem } from '@/services/ai';
import { HumanizationOptions } from '@/services/ai/humanization/gemini-humanizer';

export const useHumanizerState = () => {
  // Basic state
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  // Analysis state
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [aiDetectionScore, setAiDetectionScore] = useState<number | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  
  // Settings state
  const [usingRealAI, setUsingRealAI] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [humanScoreTarget, setHumanScoreTarget] = useState(95);
  const [humanizationApproach, setHumanizationApproach] = useState<'standard' | 'aggressive' | 'ultra'>('standard');
  const [iterations, setIterations] = useState(1);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [writingStyle, setWritingStyle] = useState('general');
  
  // Optimization state
  const [optimizationStage, setOptimizationStage] = useState(0);
  const [optimizationHistory, setOptimizationHistory] = useState<Array<OptimizationHistoryItem>>([]);

  return {
    // Basic state
    inputText, setInputText,
    outputText, setOutputText,
    isProcessing, setIsProcessing,
    wordCount, setWordCount,
    
    // Analysis state
    humanScore, setHumanScore,
    aiDetectionScore, setAiDetectionScore,
    progressValue, setProgressValue,
    
    // Settings state
    usingRealAI, setUsingRealAI,
    showAdvancedSettings, setShowAdvancedSettings,
    humanScoreTarget, setHumanScoreTarget,
    humanizationApproach, setHumanizationApproach,
    iterations, setIterations,
    autoOptimize, setAutoOptimize,
    writingStyle, setWritingStyle,
    
    // Optimization state
    optimizationStage, setOptimizationStage,
    optimizationHistory, setOptimizationHistory,
  };
};
