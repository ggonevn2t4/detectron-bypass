
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, FileEdit, Sparkles, Languages } from 'lucide-react';
import ModeSelector from './ModeSelector';

interface HumanizerTabsHeaderProps {
  usingRealAI: boolean;
  onModeChange: (value: boolean) => void;
}

const HumanizerTabsHeader: React.FC<HumanizerTabsHeaderProps> = ({ 
  usingRealAI, 
  onModeChange 
}) => {
  return (
    <div className="border-b border-border">
      <div className="px-6 flex justify-between items-center">
        <TabsList className="bg-transparent h-16">
          <TabsTrigger 
            value="humanizer" 
            className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg mr-2"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Humanizer
          </TabsTrigger>
          <TabsTrigger 
            value="detector" 
            className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg mr-2"
          >
            <Eye className="mr-2 h-4 w-4" />
            AI Detector
          </TabsTrigger>
          <TabsTrigger 
            value="writer" 
            className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg mr-2"
          >
            <FileEdit className="mr-2 h-4 w-4" />
            AI Writer
          </TabsTrigger>
          <TabsTrigger 
            value="translator" 
            className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg"
          >
            <Languages className="mr-2 h-4 w-4" />
            Dịch thuật
          </TabsTrigger>
        </TabsList>
        
        <ModeSelector 
          usingRealAI={usingRealAI}
          onModeChange={onModeChange}
        />
      </div>
    </div>
  );
};

export default HumanizerTabsHeader;
