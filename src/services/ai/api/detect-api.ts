
import { detectAIContent } from '../analysis/detailed-detector';
import requestCache from '../cache/request-cache';
import { ApiResponse, DetectResponse } from './types';

// API functionality for AI detection
export const detectAPI = async (
  text: string
): Promise<ApiResponse<DetectResponse>> => {
  try {
    // Generate cache key
    const cacheKey = `detect:${text}`;
    const cachedResult = requestCache.get<DetectResponse>(cacheKey);
    
    if (cachedResult) {
      console.log('Using cached detection result');
      return {
        success: true,
        data: cachedResult
      };
    }
    
    const result = await detectAIContent(text);
    
    const response: DetectResponse = {
      isAI: result.score > 70, // If score > 70, likely AI
      aiScore: result.score,
      details: result
    };
    
    // Cache the result
    requestCache.set(cacheKey, response);
    
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('API Detection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during AI detection'
    };
  }
};
