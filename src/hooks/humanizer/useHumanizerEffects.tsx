
import { useEffect } from 'react';

export interface EffectsDependencies {
  inputText: string;
  setHumanScore: (score: number | null) => void;
  setAiDetectionScore: (score: number | null) => void;
  setOptimizationHistory: (history: any) => void;
  setOptimizationStage: (stage: number) => void;
}

export const useHumanizerEffects = (deps: EffectsDependencies) => {
  const {
    inputText,
    setHumanScore,
    setAiDetectionScore,
    setOptimizationHistory,
    setOptimizationStage
  } = deps;

  // Reset analytics when input text changes
  useEffect(() => {
    if (inputText !== "") {
      setHumanScore(null);
      setAiDetectionScore(null);
      setOptimizationHistory([]);
      setOptimizationStage(0);
    }
  }, [inputText, setHumanScore, setAiDetectionScore, setOptimizationHistory, setOptimizationStage]);
};
