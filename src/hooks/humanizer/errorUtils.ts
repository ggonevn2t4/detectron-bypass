
import { toast } from '@/hooks/use-toast';

/**
 * Validate input text length
 */
export const validateInput = (text: string): void => {
  if (!text.trim()) {
    throw new Error("Empty Text. Please enter some text to humanize.");
  }
  
  if (text.length > 100000) {
    throw new Error("Text is too long. Please reduce the size of your input.");
  }
};

/**
 * Handle processing errors
 */
export const handleProcessingError = (
  error: unknown, 
  setError?: (error: string | null) => void
): void => {
  console.error("Processing error:", error);
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
  
  // Set the error state if the setter is provided
  if (setError) {
    setError(errorMessage);
  }
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
};
