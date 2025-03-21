
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PenLine } from 'lucide-react';
import { Card } from '@/components/ui/card';
import WriterBasicOptions from './writer/WriterBasicOptions';
import WriterAdvancedOptions from './writer/WriterAdvancedOptions';
import WriterSuggestionsBar from './writer/WriterSuggestionsBar';

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
        
        {/* Basic Options Component */}
        <WriterBasicOptions 
          length={length}
          setLength={setLength}
          tone={tone}
          setTone={setTone}
        />
        
        {/* Advanced Options Component */}
        <WriterAdvancedOptions
          format={format}
          setFormat={setFormat}
          audience={audience}
          setAudience={setAudience}
          includeHeadings={includeHeadings}
          setIncludeHeadings={setIncludeHeadings}
          includeFacts={includeFacts}
          setIncludeFacts={setIncludeFacts}
          includeQuotes={includeQuotes}
          setIncludeQuotes={setIncludeQuotes}
        />
      </div>
      
      {/* Suggestions Bar Component */}
      <WriterSuggestionsBar onSuggestedTopic={handleSuggestedTopic} />
      
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
