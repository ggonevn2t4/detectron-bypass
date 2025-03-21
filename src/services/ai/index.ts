
// Export all functionality from their respective files
export { isVietnameseText } from './common';

// Humanization modules
export { humanizeTextWithGemini } from './humanization/gemini-humanizer';
export { humanizeTextLocally } from './humanization/local-humanizer';

// Analysis modules
export { calculateInitialAiScore } from './analysis/score-calculator';
export { analyzeAIScore } from './analysis/gemini-analyzer';
export { detectAIContent } from './analysis/detailed-detector';

// Generation module 
export { generateAIContent } from './generate';
