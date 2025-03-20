
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, SparklesIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModeSelectorProps {
  usingRealAI: boolean;
  onModeChange: (useRealAI: boolean) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  usingRealAI,
  onModeChange
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={usingRealAI ? "default" : "outline"} 
              className="cursor-pointer flex items-center" 
              onClick={() => onModeChange(true)}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Advanced Mode
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Uses real AI for highest-quality humanization</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={!usingRealAI ? "default" : "outline"} 
              className="cursor-pointer flex items-center" 
              onClick={() => onModeChange(false)}
            >
              Demo Mode
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Uses simulated processing for demonstration</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ModeSelector;
