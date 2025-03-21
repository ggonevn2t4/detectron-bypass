
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

// Generation module 
export { generateAIContent } from './generate';
