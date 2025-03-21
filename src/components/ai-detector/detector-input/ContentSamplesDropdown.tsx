
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { SampleContent } from '../SampleContents';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ContentSamplesDropdownProps {
  sampleContents: SampleContent[];
  onSampleContent: (sample: SampleContent) => void;
}

const ContentSamplesDropdown: React.FC<ContentSamplesDropdownProps> = ({ sampleContents, onSampleContent }) => {
  return (
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
  );
};

export default ContentSamplesDropdown;
