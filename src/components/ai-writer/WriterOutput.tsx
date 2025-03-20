
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy, Download } from 'lucide-react';

interface WriterOutputProps {
  content: string;
  isGenerating: boolean;
  onCopy: (text: string) => void;
  onDownload: (text: string, filename: string) => void;
}

const WriterOutput: React.FC<WriterOutputProps> = ({
  content,
  isGenerating,
  onCopy,
  onDownload,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Generated Content</h3>
        {content && !isGenerating && (
          <div className="text-xs text-muted-foreground">
            {content.split(/\s+/).filter(Boolean).length} words
          </div>
        )}
      </div>
      
      <Card className="min-h-[400px] relative overflow-hidden">
        <div className="p-4 h-[400px] overflow-y-auto">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full flex-col">
              <div className="animate-pulse flex flex-col items-center text-muted-foreground">
                <div className="h-2 bg-muted-foreground/30 rounded w-1/3 mb-4"></div>
                <div className="h-2 bg-muted-foreground/30 rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-muted-foreground/30 rounded w-2/3 mb-4"></div>
                <div className="h-2 bg-muted-foreground/30 rounded w-1/4 mb-4"></div>
                <div className="h-2 bg-muted-foreground/30 rounded w-1/2 mb-4"></div>
                <div className="text-sm mt-4">Creating your content...</div>
              </div>
            </div>
          ) : content ? (
            <div className="prose prose-sm max-w-none">
              {content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ) : <br key={index} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-center p-6">
              <div>
                <p className="mb-2">Your generated content will appear here</p>
                <p className="text-sm">Enter a topic and click "Generate Content" to start</p>
              </div>
            </div>
          )}
        </div>
        
        {content && !isGenerating && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-background/90 backdrop-blur-sm border-t border-border flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(content)}
            >
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(content, 'generated-content.txt')}
            >
              <Download className="h-3.5 w-3.5 mr-2" />
              Download
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WriterOutput;
