
import React from 'react';
import { toast } from "@/hooks/use-toast";
import { 
  humanizeTextWithGemini, analyzeAIScore, detectAIContent, 
  humanizeTextLocally, calculateInitialAiScore 
} from '@/services/ai';

interface OptimizationHistoryItem {
  score: number;
  text: string;
}

export interface HumanizationOptions {
  targetScore: number;
  approach: 'standard' | 'aggressive' | 'ultra';
  style: string;
  iterationCount?: number;
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

export const optimizeText = async (
  text: string,
  currentScore: number,
  usingRealAI: boolean,
  options: HumanizationOptions,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  setProgressValue(0);
  
  try {
    const progressInterval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 300);
    
    setOptimizationStage(prev => prev + 1);
    
    let optimized: string;
    if (usingRealAI) {
      optimized = await humanizeTextWithGemini(
        text, 
        currentScore, 
        {
          ...options,
          iterationCount: options.iterationCount || 1
        }
      );
    } else {
      optimized = humanizeTextLocally(text);
    }
    
    let newHumanScore: number;
    if (usingRealAI) {
      const newAiScore = await analyzeAIScore(optimized);
      newHumanScore = 100 - newAiScore;
    } else {
      newHumanScore = 100 - calculateInitialAiScore(optimized);
    }
    
    setOptimizationHistory(prev => [...prev, {
      score: newHumanScore,
      text: optimized
    }]);
    
    setOutputText(optimized);
    setHumanScore(newHumanScore);
    setProgressValue(100);
    
    clearInterval(progressInterval);
    
    return {
      optimized,
      score: newHumanScore
    };
  } catch (error) {
    console.error("Error in optimization process:", error);
    throw error;
  }
};

export const runOptimizationIterations = async (
  text: string, 
  currentScore: number, 
  remainingIterations: number,
  targetScore: number,
  usingRealAI: boolean,
  options: HumanizationOptions,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (remainingIterations <= 0 || currentScore >= targetScore) {
    setProgressValue(100);
    toast({
      title: "Optimization Complete",
      description: `Your text is now ${currentScore}% human-like`,
    });
    return;
  }
  
  try {
    setOptimizationStage(prev => prev + 1);
    
    let optimized: string;
    if (usingRealAI) {
      optimized = await humanizeTextWithGemini(
        text, 
        currentScore, 
        {
          ...options,
          iterationCount: options.iterationCount || 1
        }
      );
    } else {
      optimized = humanizeTextLocally(text);
    }
    
    let newHumanScore: number;
    if (usingRealAI) {
      const newAiScore = await analyzeAIScore(optimized);
      newHumanScore = 100 - newAiScore;
    } else {
      newHumanScore = 100 - calculateInitialAiScore(optimized);
    }
    
    setOutputText(optimized);
    setHumanScore(newHumanScore);
    
    setOptimizationHistory(prev => [...prev, {
      score: newHumanScore,
      text: optimized
    }]);
    
    if (newHumanScore < targetScore && remainingIterations > 1) {
      await runOptimizationIterations(
        optimized, 
        newHumanScore, 
        remainingIterations - 1,
        targetScore,
        usingRealAI,
        options,
        setOptimizationStage,
        setOptimizationHistory,
        setOutputText,
        setHumanScore,
        setProgressValue
      );
    } else {
      setProgressValue(100);
      toast({
        title: "Optimization Complete",
        description: `Your text is now ${newHumanScore}% human-like`,
      });
    }
  } catch (error) {
    console.error("Error in optimization iteration:", error);
    throw error;
  }
};
