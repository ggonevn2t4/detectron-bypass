
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface InputActionButtonsProps {
  onSampleText: () => void;
}

const InputActionButtons: React.FC<InputActionButtonsProps> = ({ onSampleText }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-xs font-medium border-border/60 hover:bg-muted/80"
        onClick={onSampleText}
      >
        <FileText className="mr-1.5 h-3.5 w-3.5" />
        Sample Text
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs font-medium border-border/60 hover:bg-muted/80">
            <Info className="mr-1.5 h-3.5 w-3.5" />
            Tips
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Tips for best results:</h4>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              <li>Use text with at least 50 words for better accuracy</li>
              <li>Include both simple and complex sentences</li>
              <li>Text samples between 200-1000 words work best</li>
              <li>Make sure to include proper punctuation</li>
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InputActionButtons;
