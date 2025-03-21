
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, InfoIcon, Settings, Sparkles, RefreshCw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AdvancedSettings from './AdvancedSettings';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HumanizerInputProps {
  inputText: string;
  wordCount: number;
  isProcessing: boolean;
  showAdvancedSettings: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSampleText: () => void;
  onToggleSettings: () => void;
  onHumanize: () => void;
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

const HumanizerInput: React.FC<HumanizerInputProps> = ({
  inputText,
  wordCount,
  isProcessing,
  showAdvancedSettings,
  onInputChange,
  onSampleText,
  onToggleSettings,
  onHumanize,
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
  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Nội dung AI-Generated</h3>
        <Badge variant="info" className="px-3 py-1">
          <span className="font-medium">{wordCount} từ</span>
        </Badge>
      </div>
      
      <div className="relative group">
        <Textarea 
          placeholder="Dán nội dung tạo bởi AI vào đây..."
          className="min-h-[280px] resize-none p-4 text-base border-border/60 focus:border-primary/40 transition-all duration-300"
          value={inputText}
          onChange={onInputChange}
        />
      </div>
      
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-medium border-border/60 hover:bg-muted/80"
          onClick={onSampleText}
        >
          <FileText className="mr-1.5 h-3.5 w-3.5" />
          Văn bản mẫu
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs font-medium border-border/60 hover:bg-muted/80">
              <InfoIcon className="mr-1.5 h-3.5 w-3.5" />
              Mẹo sử dụng
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Mẹo để có kết quả tốt nhất:</h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Sử dụng văn bản ít nhất 50 từ để có kết quả tốt hơn</li>
                <li>Để có điểm humanize cực cao, hãy chạy nhiều lần lặp</li>
                <li>Đoạn văn bản nhỏ (200-500 từ) hoạt động tốt nhất</li>
                <li>Chọn phong cách viết phù hợp với mục đích của bạn</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center ml-auto">
          <Button
            variant={showAdvancedSettings ? "secondary" : "ghost"}
            size="sm"
            className="text-xs font-medium flex items-center"
            onClick={onToggleSettings}
          >
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            {showAdvancedSettings ? "Ẩn cài đặt" : "Cài đặt nâng cao"}
          </Button>
        </div>
      </div>
      
      <AdvancedSettings
        showAdvancedSettings={showAdvancedSettings}
        humanScoreTarget={humanScoreTarget}
        setHumanScoreTarget={setHumanScoreTarget}
        humanizationApproach={humanizationApproach}
        setHumanizationApproach={setHumanizationApproach}
        autoOptimize={autoOptimize}
        setAutoOptimize={setAutoOptimize}
        iterations={iterations}
        setIterations={setIterations}
        writingStyle={writingStyle}
        setWritingStyle={setWritingStyle}
      />
      
      <div className="mt-4">
        <Button
          onClick={onHumanize}
          disabled={!inputText.trim() || isProcessing}
          className="bg-primary hover:bg-primary/90 w-full font-medium"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Humanize Văn bản
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default HumanizerInput;
