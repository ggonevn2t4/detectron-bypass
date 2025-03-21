
import { optimizeText } from '../optimization/optimize-service';
import { HumanizationOptions } from '../humanization/gemini-humanizer';
import requestCache from '../cache/request-cache';
import { ApiResponse, OptimizeResponse } from './types';

// API functionality for text optimization
export const optimizeAPI = async (
  text: string,
  currentScore: number,
  options: HumanizationOptions = { 
    targetScore: 95, 
    approach: 'standard',
    style: 'academic'
  }
): Promise<ApiResponse<OptimizeResponse>> => {
  try {
    // Generate cache key
    const cacheKey = `optimize:${text}:${currentScore}:${JSON.stringify(options)}`;
    const cachedResult = requestCache.get<OptimizeResponse>(cacheKey);
    
    if (cachedResult) {
      console.log('Using cached optimization result');
      return {
        success: true,
        data: cachedResult
      };
    }
    
    // Mock the progress and optimization functions since they're not needed for API
    const mockSetFunction = () => {};
    
    const result = await optimizeText(
      text,
      currentScore,
      true, // Use real AI
      options,
      mockSetFunction,
      mockSetFunction,
      mockSetFunction,
      mockSetFunction,
      mockSetFunction
    );
    
    const response: OptimizeResponse = {
      optimizedText: result.optimized,
      newScore: result.score
    };
    
    // Cache the result
    requestCache.set(cacheKey, response);
    
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('API Optimization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during optimization'
    };
  }
};
