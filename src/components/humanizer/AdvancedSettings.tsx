
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Repeat, Zap } from 'lucide-react';
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
    <div className="mt-4 p-5 border border-border/70 rounded-lg bg-muted/10 animate-in fade-in-50 duration-300">
      <h3 className="text-sm font-medium mb-4 flex items-center text-primary">
        <Zap className="h-4 w-4 mr-2 text-primary" />
        Cài đặt Humanization nâng cao
      </h3>
      
      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="human-score" className="font-medium">Mục tiêu điểm Human: {humanScoreTarget}%</Label>
          </div>
          <div className="mt-2">
            <Slider 
              id="human-score"
              min={70} 
              max={99} 
              step={1}
              value={[humanScoreTarget]}
              onValueChange={(value) => setHumanScoreTarget(value[0])} 
              className="w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Giá trị cao hơn có thể cần nhiều lần lặp hơn</p>
        </div>
        
        <div>
          <Label className="font-medium mb-2 block">Approach Humanization</Label>
          <RadioGroup 
            value={humanizationApproach} 
            onValueChange={(value) => setHumanizationApproach(value as 'standard' | 'aggressive' | 'ultra')}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 rounded-md border border-border/60 p-2 hover:bg-muted/40 transition-colors">
              <RadioGroupItem value="standard" id="approach-standard" />
              <Label htmlFor="approach-standard" className="text-sm font-normal cursor-pointer">Standard - Cân bằng giữa tính dễ đọc và văn bản giống con người</Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border border-border/60 p-2 hover:bg-muted/40 transition-colors">
              <RadioGroupItem value="aggressive" id="approach-aggressive" />
              <Label htmlFor="approach-aggressive" className="text-sm font-normal cursor-pointer">Aggressive - Nhiều mẫu giống con người hơn, có thể thay đổi từ ngữ</Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border border-border/60 p-2 hover:bg-muted/40 transition-colors">
              <RadioGroupItem value="ultra" id="approach-ultra" />
              <Label htmlFor="approach-ultra" className="text-sm font-normal cursor-pointer">Ultra - Humanization tối đa, có thể thay đổi đáng kể văn bản</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="writing-style" className="font-medium mb-2 block">Phong cách viết</Label>
          <Select value={writingStyle} onValueChange={setWritingStyle}>
            <SelectTrigger id="writing-style" className="w-full">
              <SelectValue placeholder="Chọn phong cách viết" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Tổng quát</SelectItem>
              <SelectItem value="academic">Học thuật</SelectItem>
              <SelectItem value="casual">Thân mật/Trò chuyện</SelectItem>
              <SelectItem value="professional">Chuyên nghiệp/Kinh doanh</SelectItem>
              <SelectItem value="creative">Sáng tạo/Mô tả</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-3 border-t border-border/60">
          <div className="flex items-center justify-between mb-3">
            <Label htmlFor="auto-optimize" className="flex items-center font-medium">
              <Repeat className="h-3.5 w-3.5 mr-2 text-primary" />
              Tự động tối ưu hóa để đạt mục tiêu
            </Label>
            <Switch 
              id="auto-optimize" 
              checked={autoOptimize} 
              onCheckedChange={setAutoOptimize}
            />
          </div>
          
          {autoOptimize && (
            <div className="ml-6 space-y-2 mt-3 p-3 bg-muted/10 rounded-md border border-border/40">
              <Label htmlFor="iterations" className="text-sm">Số lần lặp tối đa: {iterations}</Label>
              <Slider 
                id="iterations"
                min={1} 
                max={5} 
                step={1}
                value={[iterations]}
                onValueChange={(value) => setIterations(value[0])} 
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Nhiều lần lặp sẽ cải thiện humanization nhưng mất nhiều thời gian hơn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
