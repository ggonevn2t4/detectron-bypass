
import { analyzeText } from '../analysis/text-analyzer';
import requestCache from '../cache/request-cache';
import { ApiResponse } from './types';

// API functionality for text analysis
export const analyzeAPI = async (
  text: string
): Promise<ApiResponse<any>> => {
  try {
    // Generate cache key
    const cacheKey = `analyze:${text}`;
    const cachedResult = requestCache.get(cacheKey);
    
    if (cachedResult) {
      console.log('Using cached analysis result');
      return {
        success: true,
        data: cachedResult
      };
    }
    
    const result = await analyzeText(text);
    
    // Cache the result
    requestCache.set(cacheKey, result);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('API Analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during text analysis'
    };
  }
};
