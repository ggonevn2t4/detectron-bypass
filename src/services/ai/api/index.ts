
import { humanizeText } from '../humanization/humanize-service';
import { HumanizationOptions } from '../humanization/gemini-humanizer';
import { optimizeText } from '../optimization/optimize-service';
import { analyzeText } from '../analysis/text-analyzer';
import { detectAIContent } from '../analysis/detailed-detector';
import requestCache from '../cache/request-cache';

// Base API response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Define the return types for each API function
interface HumanizeResponse {
  humanizedText: string;
  humanScore: number;
}

interface DetectResponse {
  isAI: boolean;
  aiScore: number;
  details: any;
}

interface OptimizeResponse {
  optimizedText: string;
  newScore: number;
}

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
