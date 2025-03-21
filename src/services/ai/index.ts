// Exporting all functionality from the new modular structure

// OpenRouter Services
export { 
  callOpenRouterAPI, 
  chooseAppropriateModel,
  OpenRouterModel
} from './openrouter/openrouter-service';

// Original services
export type { 
  HumanizationOptions
} from './humanization/gemini-humanizer';

export { 
  humanizeTextWithGemini, 
  humanizeTextLocally,
} from './humanization/gemini-humanizer';

// AI analysis
export {
  calculateInitialAiScore 
} from './analysis/score-calculator';

export type {
  TextAnalysisResult
} from './analysis/text-analyzer';

export {
  analyzeText,
} from './analysis/text-analyzer';

// Add missing analyzeAIScore export
export const analyzeAIScore = async (text: string): Promise<number> => {
  const result = await analyzeText(text);
  return result.aiProbability || 0;
};

// New OpenRouter services
export {
  detectAIContentWithOpenRouter
} from './analysis/openrouter-detector';

export {
  humanizeTextWithOpenRouter
} from './humanization/openrouter-humanizer';

export {
  generateAIContentWithOpenRouter
} from './generate-with-openrouter';

export {
  translateTextWithOpenRouter
} from './translation/openrouter-translator';

// Other utilities
export {
  isVietnameseText
} from './common';

// Content generation
export type {
  AIGenerationOptions,
  AIGenerationResult
} from './generate';

export {
  generateAIContent,
} from './generate';

// Humanization
export type {
  OptimizationHistoryItem
} from './humanization/humanize-service';

export {
  humanizeText,
} from './humanization/humanize-service';

// Add missing optimization functions from humanize-service
import { HumanizationOptions } from './humanization/gemini-humanizer';
import { OptimizationHistoryItem, humanizeText } from './humanization/humanize-service';

export const optimizeText = async (
  text: string,
  currentScore: number,
  usingRealAI: boolean,
  options: HumanizationOptions,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>
) => {
  // Implementation of optimizeText
  const result = await humanizeText(
    text,
    usingRealAI,
    { ...options, previousScore: currentScore },
    setProgressValue,
    setOptimizationStage,
    setOptimizationHistory,
    setOutputText,
    setHumanScore,
    () => {}
  );
  
  return result;
};

export const runOptimizationIterations = async (
  initialText: string,
  initialScore: number,
  iterations: number,
  targetScore: number,
  usingRealAI: boolean,
  options: HumanizationOptions,
  setOptimizationStage: React.Dispatch<React.SetStateAction<number>>,
  setOptimizationHistory: React.Dispatch<React.SetStateAction<Array<OptimizationHistoryItem>>>,
  setOutputText: React.Dispatch<React.SetStateAction<string>>,
  setHumanScore: React.Dispatch<React.SetStateAction<number | null>>,
  setProgressValue: React.Dispatch<React.SetStateAction<number>>
) => {
  let currentText = initialText;
  let currentScore = initialScore;
  
  for (let i = 0; i < iterations; i++) {
    if (currentScore >= targetScore) {
      break;
    }
    
    const result = await optimizeText(
      currentText,
      currentScore,
      usingRealAI,
      { ...options, iterationCount: i + 1 },
      setProgressValue,
      setOptimizationStage,
      setOptimizationHistory,
      setOutputText,
      setHumanScore
    );
    
    currentText = result.humanized;
    currentScore = result.score;
  }
  
  return {
    text: currentText,
    score: currentScore
  };
};

// Translation
export type {
  TranslationOptions,
  TranslationResult
} from './translation/translate-service';

export {
  translateText,
} from './translation/translate-service';
