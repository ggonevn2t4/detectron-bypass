
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Info, Activity, BookOpen, ListFilter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { SampleContent } from './SampleContents';
import { SampleText } from '../humanizer/SampleTexts';

interface DetectorInputProps {
  inputText: string;
  wordCount: number;
  isProcessing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSampleText: (category?: string) => void;
  onSampleContent: (sample: SampleContent) => void;
  onAnalyze: () => void;
  sampleContents: SampleContent[];
  sampleTexts: SampleText[];
}

const DetectorInput: React.FC<DetectorInputProps> = ({
  inputText,
  wordCount,
  isProcessing,
  onInputChange,
  onSampleText,
  onSampleContent,
  onAnalyze,
  sampleContents,
  sampleTexts
}) => {
  const textCategories = [
    { value: 'academic', label: 'Academic' },
    { value: 'business', label: 'Business' },
    { value: 'creative', label: 'Creative' },
    { value: 'technical', label: 'Technical' },
    { value: 'news', label: 'News' },
    { value: 'social', label: 'Social Media' },
    { value: 'personal', label: 'Personal Writing' }
  ];

  const textLengths = [
    { value: 'short', label: 'Short (50-150 words)' },
    { value: 'medium', label: 'Medium (150-300 words)' },
    { value: 'long', label: 'Long (300+ words)' }
  ];

  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Text to Analyze</h3>
        <Badge variant="info" className="px-3 py-1">
          <span className="font-medium">{wordCount} words</span>
        </Badge>
      </div>
      
      <div className="relative group">
        <Textarea 
          placeholder="Paste your text here to analyze..."
          className="min-h-[280px] resize-none p-4 text-base border-border/60 focus:border-primary/40 transition-all duration-300"
          value={inputText}
          onChange={onInputChange}
        />
      </div>
      
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium border-border/60 hover:bg-muted/80"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Sample Text
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuLabel>Choose a sample text</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onSampleText()} className="cursor-pointer">
              Random Sample
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ListFilter className="mr-2 h-4 w-4" />
                <span>By Category</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {textCategories.map(category => (
                  <DropdownMenuItem 
                    key={category.value}
                    onClick={() => onSampleText(category.value)}
                    className="cursor-pointer"
                  >
                    {category.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              {textCategories.map(category => {
                const categoryTexts = sampleTexts.filter(text => text.category === category.value);
                if (categoryTexts.length === 0) return null;
                
                return (
                  <React.Fragment key={category.value}>
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                      {category.label}
                    </DropdownMenuLabel>
                    {categoryTexts.slice(0, 3).map(text => (
                      <DropdownMenuItem 
                        key={text.id}
                        onClick={() => onSampleText(text.category)}
                        className="cursor-pointer"
                      >
                        <span className="truncate">{text.title}</span>
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          {text.length}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                    {category.value !== textCategories[textCategories.length - 1].value && (
                      <DropdownMenuSeparator />
                    )}
                  </React.Fragment>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs font-medium border-border/60 hover:bg-muted/80"
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Content Samples
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuLabel>Choose a sample by topic</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Academic</DropdownMenuLabel>
              {sampleContents
                .filter(sample => sample.category === 'academic')
                .map(sample => (
                  <DropdownMenuItem 
                    key={sample.id} 
                    onClick={() => onSampleContent(sample)}
                    className="cursor-pointer"
                  >
                    {sample.title}
                  </DropdownMenuItem>
                ))
              }
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Business</DropdownMenuLabel>
              {sampleContents
                .filter(sample => sample.category === 'business')
                .map(sample => (
                  <DropdownMenuItem 
                    key={sample.id} 
                    onClick={() => onSampleContent(sample)}
                    className="cursor-pointer"
                  >
                    {sample.title}
                  </DropdownMenuItem>
                ))
              }
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Creative</DropdownMenuLabel>
              {sampleContents
                .filter(sample => sample.category === 'creative')
                .map(sample => (
                  <DropdownMenuItem 
                    key={sample.id} 
                    onClick={() => onSampleContent(sample)}
                    className="cursor-pointer"
                  >
                    {sample.title}
                  </DropdownMenuItem>
                ))
              }
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Technical</DropdownMenuLabel>
              {sampleContents
                .filter(sample => sample.category === 'technical')
                .map(sample => (
                  <DropdownMenuItem 
                    key={sample.id} 
                    onClick={() => onSampleContent(sample)}
                    className="cursor-pointer"
                  >
                    {sample.title}
                  </DropdownMenuItem>
                ))
              }
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs font-medium border-border/60 hover:bg-muted/80">
              <Info className="mr-1.5 h-3.5 w-3.5" />
              Tips
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Tips for best results:</h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Use text with at least 50 words for better accuracy</li>
                <li>Include both simple and complex sentences</li>
                <li>Text samples between 200-1000 words work best</li>
                <li>Make sure to include proper punctuation</li>
                <li>Try different categories to compare detection rates</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="mt-4">
        <Button
          onClick={onAnalyze}
          disabled={!inputText.trim() || isProcessing}
          className="bg-primary hover:bg-primary/90 w-full font-medium"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Analyzing...
            </>
          ) : (
            <>
              <Activity className="mr-2 h-4 w-4" />
              Analyze Text
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default DetectorInput;
