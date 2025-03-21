
// Shared type definitions for API services

// Base API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Response types for each API function
export interface HumanizeResponse {
  humanizedText: string;
  humanScore: number;
}

export interface DetectResponse {
  isAI: boolean;
  aiScore: number;
  details: any;
}

export interface OptimizeResponse {
  optimizedText: string;
  newScore: number;
}
