
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ModeSelectorProps {
  usingRealAI: boolean;
  onModeChange: (useRealAI: boolean) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  usingRealAI,
  onModeChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={usingRealAI ? "default" : "outline"} 
        className="cursor-pointer" 
        onClick={() => onModeChange(true)}
      >
        Advanced Mode
      </Badge>
      <Badge 
        variant={!usingRealAI ? "default" : "outline"} 
        className="cursor-pointer" 
        onClick={() => onModeChange(false)}
      >
        Demo Mode
      </Badge>
    </div>
  );
};

export default ModeSelector;
