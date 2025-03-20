
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Info, PenLine } from 'lucide-react';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';

interface WriterInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  length: 'short' | 'medium' | 'long';
  setLength: (length: 'short' | 'medium' | 'long') => void;
  tone: 'formal' | 'casual' | 'professional';
  setTone: (tone: 'formal' | 'casual' | 'professional') => void;
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
  isGenerating,
  onGenerate,
}) => {
  const suggestedTopics = [
    "The Impact of Artificial Intelligence on Society",
    "Sustainable Living in Modern Cities",
    "How Technology is Changing Education",
    "The Future of Remote Work",
    "Mental Health Awareness in the Workplace"
  ];

  const handleSuggestedTopic = () => {
    const randomIndex = Math.floor(Math.random() * suggestedTopics.length);
    setTopic(suggestedTopics[randomIndex]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Generate AI Content</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic" className="block mb-2">Topic or Title</Label>
          <Textarea 
            id="topic"
            placeholder="Enter a topic to write about..."
            className="min-h-[100px] resize-none p-4 text-base border-border/60"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="block">Content Length</Label>
            <RadioGroup value={length} onValueChange={(value: 'short' | 'medium' | 'long') => setLength(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="length-short" />
                <Label htmlFor="length-short" className="cursor-pointer">Short (200-300 words)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="length-medium" />
                <Label htmlFor="length-medium" className="cursor-pointer">Medium (400-600 words)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long" id="length-long" />
                <Label htmlFor="length-long" className="cursor-pointer">Long (800-1200 words)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label className="block">Writing Tone</Label>
            <RadioGroup value={tone} onValueChange={(value: 'formal' | 'casual' | 'professional') => setTone(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formal" id="tone-formal" />
                <Label htmlFor="tone-formal" className="cursor-pointer">Formal/Academic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="tone-casual" />
                <Label htmlFor="tone-casual" className="cursor-pointer">Casual/Conversational</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="tone-professional" />
                <Label htmlFor="tone-professional" className="cursor-pointer">Professional/Business</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      
      <div className="flex items-center mt-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={handleSuggestedTopic}
        >
          <FileText className="mr-2 h-3 w-3" />
          Suggested Topic
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Info className="mr-2 h-3 w-3" />
              Tips
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Tips for best results:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Be specific with your topic for more focused content</li>
                <li>Include key points you want covered in your description</li>
                <li>Choose a tone that matches your target audience</li>
                <li>After generating, you can humanize the content using our AI Humanizer tool</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="mt-4">
        <Button
          onClick={onGenerate}
          disabled={!topic.trim() || isGenerating}
          className="bg-primary hover:bg-primary/90 w-full flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              Generating...
            </>
          ) : (
            <>
              <PenLine className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WriterInput;
