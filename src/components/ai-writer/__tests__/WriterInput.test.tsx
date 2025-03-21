
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WriterInput from '../WriterInput';

// Mock the components we don't want to test directly
jest.mock('../writer/WriterBasicOptions', () => {
  return function MockBasicOptions(props: any) {
    return <div data-testid="basic-options">Basic Options Mock</div>;
  };
});

jest.mock('../writer/WriterAdvancedOptions', () => {
  return function MockAdvancedOptions(props: any) {
    return <div data-testid="advanced-options">Advanced Options Mock</div>;
  };
});

jest.mock('../writer/WriterSuggestionsBar', () => {
  return function MockSuggestionsBar(props: any) {
    return <div data-testid="suggestions-bar">Suggestions Bar Mock</div>;
  };
});

describe('WriterInput Component', () => {
  // Define default props for testing
  const defaultProps = {
    topic: '',
    setTopic: jest.fn(),
    length: 'medium' as const,
    setLength: jest.fn(),
    tone: 'professional' as const,
    setTone: jest.fn(),
    format: 'article' as const,
    setFormat: jest.fn(),
    audience: 'general' as const,
    setAudience: jest.fn(),
    includeHeadings: true,
    setIncludeHeadings: jest.fn(),
    includeFacts: true,
    setIncludeFacts: jest.fn(),
    includeQuotes: false,
    setIncludeQuotes: jest.fn(),
    isGenerating: false,
    onGenerate: jest.fn(),
  };

  test('renders correctly', () => {
    render(<WriterInput {...defaultProps} />);
    
    // Check if title is present
    expect(screen.getByText('Tạo nội dung AI')).toBeInTheDocument();
    
    // Check if textarea is present
    expect(screen.getByPlaceholderText('Nhập chủ đề để viết về...')).toBeInTheDocument();
    
    // Check if subcomponents are rendered
    expect(screen.getByTestId('basic-options')).toBeInTheDocument();
    expect(screen.getByTestId('advanced-options')).toBeInTheDocument();
    expect(screen.getByTestId('suggestions-bar')).toBeInTheDocument();
    
    // Check if Generate button is present
    expect(screen.getByText('Tạo nội dung')).toBeInTheDocument();
  });

  test('handles text input', () => {
    render(<WriterInput {...defaultProps} />);
    
    const textarea = screen.getByPlaceholderText('Nhập chủ đề để viết về...');
    fireEvent.change(textarea, { target: { value: 'Test topic' } });
    
    expect(defaultProps.setTopic).toHaveBeenCalledWith('Test topic');
  });

  test('generate button should be disabled when topic is empty', () => {
    render(<WriterInput {...defaultProps} topic="" />);
    
    const generateButton = screen.getByText('Tạo nội dung');
    expect(generateButton).toBeDisabled();
  });

  test('generate button should be enabled when topic is not empty', () => {
    render(<WriterInput {...defaultProps} topic="Valid topic" />);
    
    const generateButton = screen.getByText('Tạo nội dung');
    expect(generateButton).not.toBeDisabled();
  });

  test('generate button should be disabled when isGenerating is true', () => {
    render(<WriterInput {...defaultProps} topic="Valid topic" isGenerating={true} />);
    
    const loadingText = screen.getByText('Đang tạo...');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText.closest('button')).toBeDisabled();
  });

  test('calls onGenerate when button is clicked', () => {
    render(<WriterInput {...defaultProps} topic="Valid topic" />);
    
    const generateButton = screen.getByText('Tạo nội dung');
    fireEvent.click(generateButton);
    
    expect(defaultProps.onGenerate).toHaveBeenCalled();
  });
});
