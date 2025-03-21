// Exporting all functionality from the new modular structure

// OpenRouter Services
export { 
  callOpenRouterAPI, 
  chooseAppropriateModel,
  OpenRouterModel
} from './openrouter/openrouter-service';

// Original services
export { 
  humanizeTextWithGemini, 
  humanizeTextLocally,
  HumanizationOptions
} from './humanization/gemini-humanizer';

// AI analysis
export {
  calculateInitialAiScore 
} from './analysis/score-calculator';

export {
  analyzeAIScore, 
  analyzeText,
  TextAnalysisResult
} from './analysis/text-analyzer';

export {
  detectAIContent 
} from './analysis/detailed-detector';

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
export {
  generateAIContent,
  type AIGenerationOptions,
  type AIGenerationResult
} from './generate';

// Humanization
export {
  humanizeText,
  OptimizationHistoryItem
} from './humanization/humanize-service';

// Translation
export {
  translateText,
  type TranslationOptions,
  type TranslationResult
} from './translation/translate-service';

// Re-export the AIGenerationResult type from generate.ts instead of redefining it
