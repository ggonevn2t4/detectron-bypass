
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TextInputProps {
  inputText: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({ inputText, onInputChange }) => {
  return (
    <div className="relative group">
      <Textarea 
        placeholder="Paste your text here to analyze..."
        className="min-h-[280px] resize-none p-4 text-base border-border/60 focus:border-primary/40 transition-all duration-300"
        value={inputText}
        onChange={onInputChange}
      />
    </div>
  );
};

export default TextInput;
