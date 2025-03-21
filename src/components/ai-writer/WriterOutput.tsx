
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, CheckCircle, RefreshCw, Award } from 'lucide-react';

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
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Generated Content</h3>
        {contentScore !== null && !isGenerating && (
          <div className="flex items-center px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-600">
            <Award className="h-3 w-3 mr-1" />
            {contentScore}% Quality
          </div>
        )}
      </div>
      
      <div className="relative">
        <Textarea 
          placeholder="Your generated content will appear here..."
          className="min-h-[280px] resize-none p-4 text-base border-border/60 bg-muted/10"
          value={content}
          readOnly
        />
        {content && (
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5"
          disabled={!content || isGenerating}
          onClick={() => onDownload(content, 'generated-content.txt')}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        
        {onRegenerate && content && (
          <Button
            variant="outline"
            className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5"
            onClick={onRegenerate}
            disabled={isGenerating}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        )}
      </div>
    </div>
  );
};

export default WriterOutput;
