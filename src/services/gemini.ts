
// This file is maintained for backward compatibility
// It re-exports all the functionality from the new modular structure

import {
  humanizeTextWithGemini,
  humanizeTextLocally,
  calculateInitialAiScore,
  analyzeAIScore,
  detectAIContent,
  generateAIContent,
  isVietnameseText
} from './ai';

export {
  humanizeTextWithGemini,
  humanizeTextLocally,
  calculateInitialAiScore,
  analyzeAIScore,
  detectAIContent,
  generateAIContent,
  isVietnameseText
};
