
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, CheckCircle, RefreshCw, Award, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WriterOutputProps {
  content: string;
  isGenerating: boolean;
  contentScore?: number | null;
  onCopy: (text: string) => void;
  onDownload: (text: string, filename: string) => void;
  onRegenerate?: () => void;
}

const WriterOutput: React.FC<WriterOutputProps> = ({ 
  content, 
  isGenerating, 
  contentScore, 
  onCopy, 
  onDownload,
  onRegenerate
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    onCopy(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Generated Content</h3>
        {contentScore !== undefined && contentScore !== null && !isGenerating && (
          <Badge variant="success" className="flex items-center gap-1 px-3 py-1">
            <Award className="h-3.5 w-3.5 mr-1" />
            <span className="font-medium">{contentScore}% Quality</span>
          </Badge>
        )}
      </div>
      
      <div className="relative group">
        <Textarea 
          placeholder="Your generated content will appear here..."
          className="min-h-[280px] resize-none p-4 text-base border-border/60 bg-muted/5 font-medium transition-all duration-300 focus:border-primary/40 focus:bg-white"
          value={content}
          readOnly
        />
        
        {content && (
          <div className="absolute bottom-3 right-3 flex space-x-2 bg-background/80 backdrop-blur-sm rounded p-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 text-xs hover:bg-primary/10 hover:text-primary"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCircle className="mr-1 h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      {!content && !isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium mb-2">No Content Generated Yet</h4>
          <p className="text-muted-foreground">
            Fill in the topic and options, then click Generate to create content
          </p>
        </div>
      )}
      
      <div className="mt-5 flex items-center gap-2">
        <Button
          variant="outline"
          className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5 font-medium"
          disabled={!content || isGenerating}
          onClick={() => onDownload(content, 'generated-content.txt')}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        
        {onRegenerate && content && (
          <Button
            variant="default"
            className="ml-auto"
            onClick={onRegenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default WriterOutput;
