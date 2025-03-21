
import { humanizeText } from '../humanization/humanize-service';
import { HumanizationOptions } from '../humanization/gemini-humanizer';
import requestCache from '../cache/request-cache';
import { ApiResponse, HumanizeResponse } from './types';

// API functionality for humanization
export const humanizeAPI = async (
  text: string,
  options: HumanizationOptions = { 
    targetScore: 95, 
    approach: 'standard',
    style: 'academic'
  }
): Promise<ApiResponse<HumanizeResponse>> => {
  try {
    // Generate cache key based on input and options
    const cacheKey = `humanize:${text}:${JSON.stringify(options)}`;
    const cachedResult = requestCache.get<HumanizeResponse>(cacheKey);
    
    if (cachedResult) {
      console.log('Using cached humanization result');
      return {
        success: true,
        data: cachedResult
      };
    }
    
    // Mock the progress and optimization functions since they're not needed for API
    const mockSetFunction = () => {};
    
    const result = await humanizeText(
      text,
      true, // Use real AI
      options,
      mockSetFunction,
      mockSetFunction,
      mockSetFunction,
      mockSetFunction,
      mockSetFunction,
      mockSetFunction
    );
    
    const response: HumanizeResponse = {
      humanizedText: result.humanized,
      humanScore: result.score
    };
    
    // Cache the result
    requestCache.set(cacheKey, response);
    
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('API Humanization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during humanization'
    };
  }
};
