
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WriterSuggestionsBarProps {
  onSuggestedTopic: () => void;
}

const WriterSuggestionsBar: React.FC<WriterSuggestionsBarProps> = ({
  onSuggestedTopic
}) => {
  return (
    <div className="flex flex-wrap items-center mt-4 gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-xs font-medium border-border/60 hover:bg-muted/80"
        onClick={onSuggestedTopic}
      >
        <FileText className="mr-1.5 h-3.5 w-3.5" />
        Chủ đề gợi ý
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs font-medium border-border/60 hover:bg-muted/80">
            <Info className="mr-1.5 h-3.5 w-3.5" />
            Mẹo
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Mẹo để có kết quả tốt nhất:</h4>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              <li>Cụ thể hóa chủ đề của bạn để có nội dung tập trung hơn</li>
              <li>Bao gồm các điểm chính bạn muốn đề cập trong mô tả</li>
              <li>Chọn giọng điệu phù hợp với đối tượng mục tiêu của bạn</li>
              <li>Sau khi tạo, bạn có thể nhân hóa nội dung bằng công cụ AI Humanizer</li>
              <li>Sử dụng tùy chọn nâng cao để kiểm soát chi tiết hơn</li>
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default WriterSuggestionsBar;
