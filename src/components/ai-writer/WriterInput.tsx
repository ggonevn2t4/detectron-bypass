
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Info, PenLine, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface WriterInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  length: 'short' | 'medium' | 'long';
  setLength: (length: 'short' | 'medium' | 'long') => void;
  tone: 'formal' | 'casual' | 'professional';
  setTone: (tone: 'formal' | 'casual' | 'professional') => void;
  format: 'article' | 'blog' | 'essay' | 'story' | 'summary';
  setFormat: (format: 'article' | 'blog' | 'essay' | 'story' | 'summary') => void;
  audience: 'general' | 'technical' | 'business' | 'academic';
  setAudience: (audience: 'general' | 'technical' | 'business' | 'academic') => void;
  includeHeadings: boolean;
  setIncludeHeadings: (value: boolean) => void;
  includeFacts: boolean;
  setIncludeFacts: (value: boolean) => void;
  includeQuotes: boolean;
  setIncludeQuotes: (value: boolean) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const WriterInput: React.FC<WriterInputProps> = ({
  topic,
  setTopic,
  length,
  setLength,
  tone,
  setTone,
  format,
  setFormat,
  audience,
  setAudience,
  includeHeadings,
  setIncludeHeadings,
  includeFacts,
  setIncludeFacts,
  includeQuotes,
  setIncludeQuotes,
  isGenerating,
  onGenerate,
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = React.useState(false);
  
  const suggestedTopics = [
    "Tác động của trí tuệ nhân tạo đối với xã hội",
    "Cuộc sống bền vững trong các thành phố hiện đại",
    "Công nghệ đang thay đổi giáo dục như thế nào",
    "Tương lai của làm việc từ xa",
    "Nhận thức về sức khỏe tâm thần tại nơi làm việc"
  ];

  const handleSuggestedTopic = () => {
    const randomIndex = Math.floor(Math.random() * suggestedTopics.length);
    setTopic(suggestedTopics[randomIndex]);
  };

  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Tạo nội dung AI</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic" className="block mb-2 font-medium">Chủ đề hoặc tiêu đề</Label>
          <Textarea 
            id="topic"
            placeholder="Nhập chủ đề để viết về..."
            className="min-h-[100px] resize-none p-4 text-base border-border/60 focus:border-primary/40 transition-all duration-300"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/10 p-4 rounded-lg border border-border/40">
          <div className="space-y-2">
            <Label className="block font-medium">Độ dài nội dung</Label>
            <RadioGroup value={length} onValueChange={(value: 'short' | 'medium' | 'long') => setLength(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="length-short" />
                <Label htmlFor="length-short" className="cursor-pointer">Ngắn (250-350 từ)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="length-medium" />
                <Label htmlFor="length-medium" className="cursor-pointer">Trung bình (500-700 từ)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long" id="length-long" />
                <Label htmlFor="length-long" className="cursor-pointer">Dài (900-1500 từ)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label className="block font-medium">Giọng điệu</Label>
            <RadioGroup value={tone} onValueChange={(value: 'formal' | 'casual' | 'professional') => setTone(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formal" id="tone-formal" />
                <Label htmlFor="tone-formal" className="cursor-pointer">Trang trọng/Học thuật</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="tone-casual" />
                <Label htmlFor="tone-casual" className="cursor-pointer">Thân thiện/Trò chuyện</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="tone-professional" />
                <Label htmlFor="tone-professional" className="cursor-pointer">Chuyên nghiệp/Doanh nghiệp</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <Collapsible
          open={showAdvancedOptions}
          onOpenChange={setShowAdvancedOptions}
          className="bg-muted/10 p-4 rounded-lg border border-border/40"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <h4 className="font-medium text-sm">Tùy chọn nâng cao</h4>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                {showAdvancedOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="block font-medium text-sm">Định dạng</Label>
                <RadioGroup value={format} onValueChange={(value: 'article' | 'blog' | 'essay' | 'story' | 'summary') => setFormat(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="article" id="format-article" />
                    <Label htmlFor="format-article" className="cursor-pointer text-sm">Bài viết</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blog" id="format-blog" />
                    <Label htmlFor="format-blog" className="cursor-pointer text-sm">Blog</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="essay" id="format-essay" />
                    <Label htmlFor="format-essay" className="cursor-pointer text-sm">Bài luận</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="story" id="format-story" />
                    <Label htmlFor="format-story" className="cursor-pointer text-sm">Câu chuyện</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="summary" id="format-summary" />
                    <Label htmlFor="format-summary" className="cursor-pointer text-sm">Tóm tắt</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label className="block font-medium text-sm">Đối tượng</Label>
                <RadioGroup value={audience} onValueChange={(value: 'general' | 'technical' | 'business' | 'academic') => setAudience(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="audience-general" />
                    <Label htmlFor="audience-general" className="cursor-pointer text-sm">Chung</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="audience-technical" />
                    <Label htmlFor="audience-technical" className="cursor-pointer text-sm">Kỹ thuật</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="audience-business" />
                    <Label htmlFor="audience-business" className="cursor-pointer text-sm">Doanh nghiệp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic" id="audience-academic" />
                    <Label htmlFor="audience-academic" className="cursor-pointer text-sm">Học thuật</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label className="block font-medium text-sm mb-2">Tùy chọn nội dung</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-headings" 
                    checked={includeHeadings} 
                    onCheckedChange={(checked) => setIncludeHeadings(checked === true)} 
                  />
                  <Label htmlFor="include-headings" className="cursor-pointer text-sm">Bao gồm tiêu đề và phụ đề</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-facts" 
                    checked={includeFacts} 
                    onCheckedChange={(checked) => setIncludeFacts(checked === true)} 
                  />
                  <Label htmlFor="include-facts" className="cursor-pointer text-sm">Bao gồm sự kiện và thống kê</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-quotes" 
                    checked={includeQuotes} 
                    onCheckedChange={(checked) => setIncludeQuotes(checked === true)} 
                  />
                  <Label htmlFor="include-quotes" className="cursor-pointer text-sm">Bao gồm trích dẫn hoặc lời chứng thực</Label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-medium border-border/60 hover:bg-muted/80"
          onClick={handleSuggestedTopic}
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
      
      <div className="mt-4">
        <Button
          onClick={onGenerate}
          disabled={!topic.trim() || isGenerating}
          className="bg-primary hover:bg-primary/90 w-full font-medium"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Đang tạo...
            </>
          ) : (
            <>
              <PenLine className="mr-2 h-4 w-4" />
              Tạo nội dung
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default WriterInput;
