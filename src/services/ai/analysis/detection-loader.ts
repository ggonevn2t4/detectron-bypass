
import { AIDetectionResult, detectAIContent } from './detailed-detector';
import requestCache from '../cache/request-cache';

// Throttling delays between similar detection requests (ms)
const THROTTLE_DELAY = 500;
let lastDetectionTime = 0;

export const getAIDetectionResults = async (text: string): Promise<AIDetectionResult> => {
  // Skip detection for very short texts
  if (text.length < 20) {
    return {
      score: 50,
      confidence: "low",
      analysis: "Text is too short for meaningful analysis.",
      patterns: [
        {
          pattern: "Short text",
          description: "Text is too short for analysis.",
          examples: [text]
        }
      ],
      suggestions: ["Provide more text for a better analysis."]
    };
  }
  
  // Generate cache key based on text content
  const cacheKey = `detect-ai-${text.substring(0, 100).replace(/\s+/g, '-')}`;
  
  // Check for cached result
  const cachedResult = requestCache.get<AIDetectionResult>(cacheKey);
  if (cachedResult !== null) {
    console.log("Using cached AI detection result");
    return cachedResult;
  }
  
  // Throttle requests to avoid excessive API calls
  const now = Date.now();
  if (now - lastDetectionTime < THROTTLE_DELAY) {
    await new Promise(resolve => setTimeout(resolve, THROTTLE_DELAY));
  }
  lastDetectionTime = Date.now();
  
  // Make the detection request
  const result = await detectAIContent(text);
  
  // Cache the result
  requestCache.set(cacheKey, result);
  
  return result;
};
