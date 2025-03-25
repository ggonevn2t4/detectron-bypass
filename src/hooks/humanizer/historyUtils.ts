
/**
 * Save humanization result to history
 */
export const saveToHistory = (
  originalText: string, 
  humanizedText: string, 
  score: number,
  saveHistoryFn?: (originalText: string, humanizedText: string, score: number) => void
): void => {
  if (saveHistoryFn) {
    saveHistoryFn(originalText, humanizedText, score);
  }
};
