
// Format timestamp to local string
export const formatTimestamp = (timestamp: Date) => {
  // Convert string date to Date object if needed
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format full analysis text for copy/download
export const formatAnalysisText = (
  score: number | null, 
  confidence: string, 
  analysis: string, 
  patterns: string[] = [], 
  suggestions: string[] = []
) => {
  return `
AI Detection Score: ${score}%
Confidence: ${confidence}
Analysis: ${analysis}
${patterns.length > 0 ? '\nDetected Patterns:\n' + patterns.map(p => `- ${p}`).join('\n') : ''}
${suggestions.length > 0 ? '\nSuggestions:\n' + suggestions.map(s => `- ${s}`).join('\n') : ''}
`.trim();
};
