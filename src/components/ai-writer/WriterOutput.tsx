
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Copy, Download, CheckCircle, RefreshCw, Award, 
  AlertTriangle, Bookmark, MessageSquare, FileText, Edit
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from '@/components/ui/input';

interface WriterOutputProps {
  content: string;
  title?: string;
  estimatedWordCount?: number;
  isGenerating: boolean;
  contentScore?: number | null;
  onCopy: (text: string) => void;
  onDownload: (text: string, filename: string) => void;
  onRegenerate?: () => void;
  onSave?: () => void;
  onContentEdit?: (newContent: string) => void;
  onTitleEdit?: (newTitle: string) => void;
}

const WriterOutput: React.FC<WriterOutputProps> = ({ 
  content, 
  title,
  estimatedWordCount,
  isGenerating, 
  contentScore, 
  onCopy, 
  onDownload,
  onRegenerate,
  onSave,
  onContentEdit,
  onTitleEdit
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedTitle, setEditedTitle] = useState(title || '');
  
  const handleCopy = () => {
    const fullContent = title ? `${title}\n\n${content}` : content;
    onCopy(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const readingTimeMin = Math.ceil(words / 200); // Average reading speed of 200 words per minute
    return readingTimeMin;
  };

  const handleStartEditing = () => {
    setEditedContent(content);
    setEditedTitle(title || '');
    setIsEditing(true);
  };

  const handleSaveEdits = () => {
    if (onContentEdit) {
      onContentEdit(editedContent);
    }
    if (onTitleEdit && title) {
      onTitleEdit(editedTitle);
    }
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Nội dung đã tạo</h3>
        <div className="flex items-center gap-2">
          {contentScore !== undefined && contentScore !== null && !isGenerating && (
            <Badge variant="success" className="flex items-center gap-1 px-3 py-1">
              <Award className="h-3.5 w-3.5 mr-1" />
              <span className="font-medium">{contentScore}% Chất lượng</span>
            </Badge>
          )}
          
          {estimatedWordCount && !isGenerating && (
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <FileText className="h-3.5 w-3.5 mr-1" />
              <span className="font-medium">{estimatedWordCount} từ</span>
            </Badge>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <>
          {title && (
            <div className="mb-3">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="font-bold text-lg mb-2"
                placeholder="Tiêu đề..."
              />
            </div>
          )}
          <Textarea 
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[280px] resize-none p-4 text-base border-border/60 bg-muted/5 font-medium transition-all duration-300 focus:border-primary/40 focus:bg-white"
          />
          <div className="mt-3 flex items-center gap-2">
            <Button 
              onClick={handleSaveEdits} 
              variant="default"
              className="border-border/60 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Lưu thay đổi
            </Button>
            <Button 
              onClick={handleCancelEditing} 
              variant="outline"
              className="border-border/60"
            >
              Hủy
            </Button>
          </div>
        </>
      ) : (
        <>
          {title && content && (
            <div className="mb-3 px-3 py-2 border-l-4 border-primary/60 bg-primary/5 rounded">
              <h2 className="font-bold text-lg">{title}</h2>
              {estimatedWordCount && (
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>Thời gian đọc: khoảng {getReadingTime(content)} phút</span>
                </div>
              )}
            </div>
          )}
          
          <div className="relative group">
            <Textarea 
              placeholder="Nội dung đã tạo sẽ xuất hiện ở đây..."
              className="min-h-[280px] resize-none p-4 text-base border-border/60 bg-muted/5 font-medium transition-all duration-300 focus:border-primary/40 focus:bg-white"
              value={content}
              readOnly
            />
            
            {content && (
              <div className="absolute bottom-3 right-3 flex space-x-2 bg-background/80 backdrop-blur-sm rounded p-1 opacity-90 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2.5 text-xs hover:bg-primary/10 hover:text-primary"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                            Đã sao chép
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3.5 w-3.5" />
                            Sao chép
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sao chép nội dung vào clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2.5 text-xs hover:bg-primary/10 hover:text-primary"
                        onClick={handleStartEditing}
                      >
                        <Edit className="mr-1 h-3.5 w-3.5" />
                        Chỉnh sửa
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chỉnh sửa nội dung</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {onSave && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2.5 text-xs hover:bg-primary/10 hover:text-primary"
                          onClick={onSave}
                        >
                          <Bookmark className="mr-1 h-3.5 w-3.5" />
                          Lưu
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lưu nội dung này vào tài khoản của bạn</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
          
          {!content && !isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium mb-2">Chưa có nội dung được tạo</h4>
              <p className="text-muted-foreground">
                Điền chủ đề và tùy chọn, sau đó nhấn Tạo nội dung
              </p>
            </div>
          )}
          
          <div className="mt-5 flex items-center gap-2">
            <Button
              variant="outline"
              className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5 font-medium"
              disabled={!content || isGenerating}
              onClick={() => onDownload(content, 'noi-dung-da-tao.txt')}
            >
              <Download className="mr-2 h-4 w-4" />
              Xuất file
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
                    Đang tạo lại...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tạo lại
                  </>
                )}
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default WriterOutput;
