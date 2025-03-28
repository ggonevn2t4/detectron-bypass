
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface WriterSettingsProps {
  isGenerating: boolean;
  progressValue: number;
}

const WriterSettings: React.FC<WriterSettingsProps> = ({
  isGenerating,
  progressValue
}) => {
  if (!isGenerating) {
    return null;
  }
  
  return (
    <div className="md:col-span-2 mb-3">
      <div className="flex items-center justify-center mb-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
        <span className="text-sm font-medium">Đang tạo nội dung...</span>
      </div>
      <Progress value={progressValue} className="h-1.5" />
      <p className="text-xs text-muted-foreground mt-1 text-center">
        {progressValue < 30 
          ? 'Đang phân tích chủ đề và nghiên cứu...' 
          : progressValue < 60
          ? 'Đang tạo nội dung với tùy chọn của bạn...'
          : progressValue < 95
          ? 'Đang hoàn thiện và làm mịn nội dung...'
          : 'Hoàn thành!'}
      </p>
    </div>
  );
};

export default WriterSettings;
