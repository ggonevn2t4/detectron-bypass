
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Signal, Copy, Download, CheckCircle, AlertTriangle, 
  FileCheck, Sparkles, Lightbulb, ListChecks, ArrowRight,
  FileType, FileSpreadsheet, HelpCircle, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface DetectorOutputProps {
  score: number | null;
  analysis: string;
  confidence: 'high' | 'medium' | 'low';
  patterns?: string[];
  suggestions?: string[];
  isProcessing: boolean;
  onCopy: () => void;
  onDownload: (text: string, filename: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  copied: boolean;
}

const DetectorOutput: React.FC<DetectorOutputProps> = ({
  score,
  analysis,
  confidence,
  patterns = [],
  suggestions = [],
  isProcessing,
  onCopy,
  onDownload,
  onExportCSV,
  onExportPDF,
  copied
}) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getBadgeVariant = (score: number | null) => {
    if (score === null) return "secondary";
    if (score >= 80) return "destructive";
    if (score >= 60) return "warning";
    return "success";
  };

  const confidenceIcon = (confidence: string) => {
    return <Signal className={cn("h-4 w-4", getConfidenceColor(confidence))} />;
  };

  const getScoreHelp = (score: number) => {
    if (score >= 80) {
      return {
        color: "bg-red-50",
        title: "Văn bản có khả năng cao được viết bởi AI",
        description: "Văn bản này có các đặc điểm cấu trúc, ngôn ngữ và mẫu văn phong rất giống với nội dung AI tạo ra. Nếu bạn đang nộp công việc này, khả năng cao nó sẽ bị phát hiện là nội dung AI."
      };
    } else if (score >= 60) {
      return {
        color: "bg-amber-50",
        title: "Văn bản có thể chứa một số nội dung AI",
        description: "Văn bản này có một số đặc điểm giống AI nhưng cũng có các yếu tố con người. Bạn nên xem xét chỉnh sửa thêm để giảm điểm AI."
      };
    } else {
      return {
        color: "bg-green-50",
        title: "Văn bản có vẻ được viết bởi con người",
        description: "Văn bản này có các đặc điểm ngôn ngữ tự nhiên và biến thể mà AI thường không thể tạo ra. Khả năng cao nó sẽ vượt qua các công cụ phát hiện AI."
      };
    }
  };

  const getConfidenceHelp = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return "Hệ thống rất tự tin vào kết quả phân tích này, dựa trên nhiều mẫu AI nhất quán được phát hiện trong văn bản.";
      case 'medium':
        return "Có một số mẫu AI được phát hiện, nhưng không đủ để xác định chắc chắn. Đánh giá này có độ tin cậy trung bình.";
      case 'low':
        return "Có rất ít bằng chứng AI trong văn bản này, hoặc văn bản quá ngắn để phân tích chính xác. Đánh giá có độ tin cậy thấp.";
      default:
        return "Không có đủ dữ liệu để xác định độ tin cậy.";
    }
  };

  return (
    <TooltipProvider>
      <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Kết quả phân tích</h3>
          {confidence && score !== null && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={getBadgeVariant(score)} className="flex items-center gap-1 px-3 py-1 cursor-help">
                  {confidenceIcon(confidence)}
                  <span className="font-medium capitalize">Độ tin cậy {confidence === 'high' ? 'cao' : confidence === 'medium' ? 'trung bình' : 'thấp'}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="left" className="w-72 p-3 text-sm">
                <p>{getConfidenceHelp(confidence)}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {score !== null ? (
          <>
            <div className="bg-card/50 rounded-lg p-4 mb-4 border border-border/40">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">Điểm phát hiện AI</h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Điểm số từ 0-100 cho biết khả năng văn bản được tạo bởi AI. Điểm càng cao nghĩa là văn bản càng có nhiều đặc điểm của AI.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className={cn("text-xl font-bold", getScoreColor(score))}>
                    {score}%
                  </span>
                </div>
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div>
                      <Progress 
                        value={score} 
                        className="h-2 mb-1 cursor-help" 
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className={`w-80 p-0 overflow-hidden border-2 ${score >= 80 ? 'border-red-200' : score >= 60 ? 'border-yellow-200' : 'border-green-200'}`}>
                    <div className={`p-4 ${getScoreHelp(score).color}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4" />
                        <h5 className="font-semibold">{getScoreHelp(score).title}</h5>
                      </div>
                      <p className="text-sm">{getScoreHelp(score).description}</p>
                    </div>
                    <div className="p-3 bg-white">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 rounded bg-green-50">
                          <p className="font-semibold">0-39%</p>
                          <p>Con người</p>
                        </div>
                        <div className="text-center p-2 rounded bg-amber-50">
                          <p className="font-semibold">40-79%</p>
                          <p>Cần kiểm tra</p>
                        </div>
                        <div className="text-center p-2 rounded bg-red-50">
                          <p className="font-semibold">80-100%</p>
                          <p>Rất có thể AI</p>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <p className={cn("text-sm font-medium", getScoreColor(score))}>
                  {score >= 80 ? (
                    "Văn bản này rất có thể được viết bởi AI"
                  ) : score >= 60 ? (
                    "Văn bản này có một số đặc điểm của AI"
                  ) : (
                    "Văn bản này có vẻ được viết bởi con người"
                  )}
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <Accordion type="single" collapsible className="w-full mb-4">
                <AccordionItem value="analysis" className="border-border/40">
                  <AccordionTrigger className="text-sm font-medium py-2">
                    <span className="flex items-center">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Phân tích chi tiết
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground whitespace-pre-line p-4 bg-muted/5 border border-border/40 rounded-md min-h-[100px]">
                      {analysis}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="patterns" className="border-border/40">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AccordionTrigger className="text-sm font-medium py-2">
                        <span className="flex items-center">
                          <ListChecks className="mr-2 h-4 w-4" />
                          Mẫu phát hiện ({patterns.length})
                        </span>
                      </AccordionTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs">Các mẫu ngôn ngữ và cấu trúc đặc trưng của AI được phát hiện trong văn bản của bạn.</p>
                    </TooltipContent>
                  </Tooltip>
                  <AccordionContent>
                    <ul className="space-y-2 p-3 bg-muted/5 border border-border/40 rounded-md">
                      {patterns.map((pattern, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary/70" />
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="suggestions" className="border-border/40">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AccordionTrigger className="text-sm font-medium py-2">
                        <span className="flex items-center">
                          <Lightbulb className="mr-2 h-4 w-4" />
                          Gợi ý cải thiện ({suggestions.length})
                        </span>
                      </AccordionTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="text-xs">Đề xuất cách cải thiện văn bản để giảm đặc điểm AI và làm cho nó có vẻ tự nhiên hơn.</p>
                    </TooltipContent>
                  </Tooltip>
                  <AccordionContent>
                    <ul className="space-y-2 p-3 bg-muted/5 border border-border/40 rounded-md">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <Sparkles className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary/70" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5 font-medium"
                  onClick={onCopy}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Sao chép kết quả
                    </>
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5 font-medium"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Tải xuống báo cáo
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onDownload(analysis, 'ai-analysis.txt')}>
                      <FileType className="mr-2 h-4 w-4" />
                      <span>Văn bản (.txt)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onExportCSV}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      <span>Bảng tính (.csv)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onExportPDF}>
                      <FileCheck className="mr-2 h-4 w-4" />
                      <span>Tài liệu (.pdf)</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium mb-2">Chưa có phân tích</h4>
            <p className="text-muted-foreground">
              Nhập văn bản và nhấn phân tích để xem kết quả phát hiện AI
            </p>
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
};

export default DetectorOutput;
