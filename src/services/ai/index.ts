
// Export all functionality from their respective files
export { isVietnameseText } from './common';

// Humanization modules
export { humanizeTextWithGemini } from './humanization/gemini-humanizer';
export { humanizeTextLocally } from './humanization/local-humanizer';
export { humanizeText } from './humanization/humanize-service';
export type { OptimizationHistoryItem } from './humanization/humanize-service';

// Optimization modules
export { optimizeText, runOptimizationIterations } from './optimization/optimize-service';

// Analysis modules
export { calculateInitialAiScore } from './analysis/score-calculator';
export { analyzeAIScore } from './analysis/gemini-analyzer';
export { detectAIContent } from './analysis/detailed-detector';
export type { AIDetectionResult } from './analysis/detailed-detector';
export { analyzeText } from './analysis/text-analyzer';
export type { TextAnalysisResult } from './analysis/text-analyzer';

// Generation module 
export { generateAIContent } from './generate';
export type { AIGenerationOptions, AIGenerationResult } from './generate';

// Translation module
export { translateText } from './translation/translate-service';
export type { TranslationOptions, TranslationResult } from './translation/translate-service';

// API module
export { humanizeAPI, detectAPI, optimizeAPI, analyzeAPI } from './api';
