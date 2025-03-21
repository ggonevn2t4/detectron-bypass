
export interface HumanizationOptions {
  targetScore?: number;
  approach?: 'standard' | 'aggressive' | 'ultra';
  style?: string;
  previousScore?: number;
  iterationCount?: number;
  model?: string;
}
