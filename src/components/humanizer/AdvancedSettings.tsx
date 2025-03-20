
import React from 'react';
import { 
  Slider, 
  RadioGroup, 
  RadioGroupItem,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  FileEdit, 
  Zap, 
  Repeat
} from 'lucide-react';
import { Form, FormControl, FormItem, FormLabel, FormDescription } from '@/components/ui/form';

interface AdvancedSettingsProps {
  showAdvancedSettings: boolean;
  humanScoreTarget: number;
  setHumanScoreTarget: (value: number) => void;
  humanizationApproach: 'standard' | 'aggressive' | 'ultra';
  setHumanizationApproach: (value: 'standard' | 'aggressive' | 'ultra') => void;
  autoOptimize: boolean;
  setAutoOptimize: (value: boolean) => void;
  iterations: number;
  setIterations: (value: number) => void;
  writingStyle: string;
  setWritingStyle: (value: string) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  showAdvancedSettings,
  humanScoreTarget,
  setHumanScoreTarget,
  humanizationApproach,
  setHumanizationApproach,
  autoOptimize,
  setAutoOptimize,
  iterations,
  setIterations,
  writingStyle,
  setWritingStyle
}) => {
  if (!showAdvancedSettings) return null;

  return (
    <div className="mt-2 p-4 border border-border rounded-lg bg-background/50 animate-in fade-in-50 duration-300">
      <h3 className="text-sm font-medium mb-3 flex items-center">
        <Sparkles className="h-4 w-4 mr-2 text-primary" />
        Advanced Humanization Settings
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="human-score">Target Human Score: {humanScoreTarget}%</Label>
          </div>
          <Slider 
            id="human-score"
            min={70} 
            max={99} 
            step={1}
            value={[humanScoreTarget]}
            onValueChange={(value) => setHumanScoreTarget(value[0])} 
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Higher values may require more iterations</p>
        </div>
        
        <div className="space-y-2">
          <Label>Humanization Approach</Label>
          <RadioGroup 
            value={humanizationApproach} 
            onValueChange={(value) => setHumanizationApproach(value as 'standard' | 'aggressive' | 'ultra')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="approach-standard" />
              <Label htmlFor="approach-standard" className="text-sm font-normal cursor-pointer">Standard - Balance of readability and human-like text</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aggressive" id="approach-aggressive" />
              <Label htmlFor="approach-aggressive" className="text-sm font-normal cursor-pointer">Aggressive - More human patterns, may alter wording</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ultra" id="approach-ultra" />
              <Label htmlFor="approach-ultra" className="text-sm font-normal cursor-pointer">Ultra - Maximum humanization, may significantly change text</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="writing-style">Writing Style</Label>
          <Select value={writingStyle} onValueChange={setWritingStyle}>
            <SelectTrigger id="writing-style">
              <SelectValue placeholder="Select a writing style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="casual">Casual/Conversational</SelectItem>
              <SelectItem value="professional">Professional/Business</SelectItem>
              <SelectItem value="creative">Creative/Descriptive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-2 border-t border-border/60">
          <div className="flex items-center justify-between mb-3">
            <Label htmlFor="auto-optimize" className="flex items-center">
              <Repeat className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              Auto-optimize for target score
            </Label>
            <Switch 
              id="auto-optimize" 
              checked={autoOptimize} 
              onCheckedChange={setAutoOptimize}
            />
          </div>
          
          {autoOptimize && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="iterations" className="text-sm">Maximum Iterations: {iterations}</Label>
              <Slider 
                id="iterations"
                min={1} 
                max={5} 
                step={1}
                value={[iterations]}
                onValueChange={(value) => setIterations(value[0])} 
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">More iterations improve humanization but take longer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
