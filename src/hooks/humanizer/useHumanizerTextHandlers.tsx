
import { useState, useCallback, useEffect } from 'react';
import { sampleTexts } from '@/components/humanizer/SampleTexts';
import { useToast } from '@/hooks/use-toast';

// Debounce function for input handling
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useHumanizerTextHandlers = (
  setInputText: (text: string) => void,
  setWordCount: (count: number) => void
) => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  
  // Update word count and input text when debounced input changes
  useEffect(() => {
    const words = debouncedInput.trim().split(/\s+/);
    const count = debouncedInput.trim() ? words.length : 0;
    setWordCount(count);
    setInputText(debouncedInput);
  }, [debouncedInput, setInputText, setWordCount]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSampleText = useCallback(() => {
    // Randomly select a sample text
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    const sample = sampleTexts[randomIndex];
    setInput(sample);
    
    // Immediately update for better UX
    const words = sample.trim().split(/\s+/);
    const count = sample.trim() ? words.length : 0;
    setWordCount(count);
    setInputText(sample);
    
    toast({
      title: "Đã tải mẫu văn bản",
      description: "Mẫu văn bản đã được tải vào trình soạn thảo",
    });
  }, [setInputText, setWordCount, toast]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Văn bản đã được sao chép vào clipboard",
    });
  }, [toast]);

  const handleDownload = useCallback((text: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Đã tải xuống",
      description: `Văn bản đã được tải xuống dưới dạng ${filename}`,
    });
  }, [toast]);

  return {
    handleInputChange,
    handleSampleText,
    handleCopy,
    handleDownload,
    currentInput: input
  };
};
