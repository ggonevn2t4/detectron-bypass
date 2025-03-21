
// This file is maintained for backward compatibility
// It re-exports all the functionality from the new modular structure

import {
  humanizeTextWithGemini,
  humanizeTextWithOpenRouter,
  humanizeTextLocally,
  calculateInitialAiScore,
  analyzeAIScore,
  detectAIContent,
  detectAIContentWithOpenRouter,
  generateAIContent,
  generateAIContentWithOpenRouter,
  isVietnameseText,
  translateText,
  translateTextWithOpenRouter,
  OpenRouterModel
} from './ai';

export {
  humanizeTextWithGemini,
  humanizeTextWithOpenRouter,
  humanizeTextLocally,
  calculateInitialAiScore,
  analyzeAIScore,
  detectAIContent,
  detectAIContentWithOpenRouter,
  generateAIContent,
  generateAIContentWithOpenRouter,
  isVietnameseText,
  translateText,
  translateTextWithOpenRouter,
  OpenRouterModel
};
