
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DetectorTool from '../DetectorTool';
import { detectAIContent } from '@/services/ai/analysis/detailed-detector';

// Mock the detect AI content function
jest.mock('@/services/ai/analysis/detailed-detector', () => ({
  detectAIContent: jest.fn()
}));

// Mock the useIsMobile hook
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

describe('DetectorTool', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders the detector tool', () => {
    render(<DetectorTool />);
    expect(screen.getByText('Text to Analyze')).toBeInTheDocument();
    expect(screen.getByText('Kết quả phân tích')).toBeInTheDocument();
  });

  test('updates word count when input changes', () => {
    render(<DetectorTool />);
    const textarea = screen.getByPlaceholderText('Paste your text here to analyze...');
    
    fireEvent.change(textarea, { target: { value: 'This is a test.' } });
    expect(screen.getByText('4 words')).toBeInTheDocument();
    
    fireEvent.change(textarea, { target: { value: 'This is a longer test with more words.' } });
    expect(screen.getByText('8 words')).toBeInTheDocument();
  });

  test('analyze button is disabled when input is empty', () => {
    render(<DetectorTool />);
    const analyzeButton = screen.getByText('Analyze Text').closest('button');
    expect(analyzeButton).toBeDisabled();
  });

  test('analyze button is enabled when input has text', () => {
    render(<DetectorTool />);
    const textarea = screen.getByPlaceholderText('Paste your text here to analyze...');
    fireEvent.change(textarea, { target: { value: 'This is a test.' } });
    
    const analyzeButton = screen.getByText('Analyze Text').closest('button');
    expect(analyzeButton).not.toBeDisabled();
  });

  test('performs analysis when analyze button is clicked', async () => {
    const mockResult = {
      score: 75,
      confidence: 'medium',
      analysis: 'This text shows signs of being AI-generated.',
      patterns: ['Consistent sentence structure', 'Lack of idioms'],
      suggestions: ['Add more personal anecdotes', 'Use more varied sentence structures']
    };
    
    (detectAIContent as jest.Mock).mockResolvedValue(mockResult);
    
    render(<DetectorTool />);
    const textarea = screen.getByPlaceholderText('Paste your text here to analyze...');
    fireEvent.change(textarea, { target: { value: 'This is a test.' } });
    
    const analyzeButton = screen.getByText('Analyze Text').closest('button');
    fireEvent.click(analyzeButton!);
    
    await waitFor(() => {
      expect(detectAIContent).toHaveBeenCalledWith('This is a test.');
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });
});
