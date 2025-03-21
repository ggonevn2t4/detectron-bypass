
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface WriterAdvancedOptionsProps {
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
}

const WriterAdvancedOptions: React.FC<WriterAdvancedOptionsProps> = ({
  format,
  setFormat,
  audience,
  setAudience,
  includeHeadings,
  setIncludeHeadings,
  includeFacts,
  setIncludeFacts,
  includeQuotes,
  setIncludeQuotes
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = React.useState(false);

  return (
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
  );
};

export default WriterAdvancedOptions;
