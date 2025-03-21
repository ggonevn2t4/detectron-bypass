
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeftRight,
  FileText,
  BarChart,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { TextAnalysisResult, analyzeText } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';

interface TextComparisonProps {
  originalText: string;
  humanizedText: string;
  humanScore: number | null;
}

const TextComparison: React.FC<TextComparisonProps> = ({
  originalText,
  humanizedText,
  humanScore
}) => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'split' | 'diff'>('split');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [originalAnalysis, setOriginalAnalysis] = useState<TextAnalysisResult | null>(null);
  const [humanizedAnalysis, setHumanizedAnalysis] = useState<TextAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!originalText || !humanizedText) {
      toast({
        title: "Không thể phân tích",
        description: "Cần có cả văn bản gốc và văn bản đã humanize",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Phân tích đồng thời cả hai văn bản
      const [originalResult, humanizedResult] = await Promise.all([
        analyzeText(originalText),
        analyzeText(humanizedText)
      ]);
      
      setOriginalAnalysis(originalResult);
      setHumanizedAnalysis(humanizedResult);
      
      toast({
        title: "Phân tích hoàn tất",
        description: "Đã phân tích chi tiết cả hai văn bản",
      });
    } catch (error) {
      console.error("Lỗi khi phân tích văn bản:", error);
      toast({
        title: "Lỗi phân tích",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Hiển thị khác biệt giữa hai văn bản
  const renderDiffView = () => {
    // Đơn giản hiển thị hai văn bản song song với highlight
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-muted/30">
          <div className="text-sm font-medium text-muted-foreground mb-2">Văn bản gốc</div>
          <div className="whitespace-pre-wrap">{originalText}</div>
        </div>
        <div className="border rounded-md p-3 bg-muted/30">
          <div className="text-sm font-medium text-muted-foreground mb-2">Văn bản đã humanize</div>
          <div className="whitespace-pre-wrap">{humanizedText}</div>
        </div>
      </div>
    );
  };

  // Hiển thị phân tích
  const renderAnalysisView = () => {
    if (isAnalyzing) {
      return (
        <div className="flex items-center justify-center p-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
            <p className="text-muted-foreground text-sm">Đang phân tích văn bản...</p>
          </div>
        </div>
      );
    }

    if (!originalAnalysis || !humanizedAnalysis) {
      return (
        <div className="flex flex-col items-center justify-center p-10 space-y-4">
          <Lightbulb className="h-12 w-12 text-muted" />
          <p className="text-center text-muted-foreground">
            Nhấn vào nút "Phân tích chi tiết" để xem phân tích độ đọc, độ phức tạp và tính nhất quán của cả hai văn bản.
          </p>
          <Button onClick={handleAnalyze} variant="default" className="mt-3">
            <BarChart className="mr-2 h-4 w-4" />
            Phân tích chi tiết
          </Button>
        </div>
      );
    }

    const renderMeter = (value: number, label: string, min = 0, max = 100) => (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">{label}</span>
          <span className="text-xs font-bold">{value}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2" 
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    );

    const renderComparison = (
      originalScore: number,
      humanizedScore: number,
      label: string,
      higherIsBetter = true
    ) => {
      const difference = humanizedScore - originalScore;
      const isImproved = higherIsBetter ? difference > 0 : difference < 0;
      
      return (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1">{label}</div>
          <div className="flex items-center gap-1">
            <Badge variant={isImproved ? "success" : "destructive"} className="text-xs">
              {originalScore} → {humanizedScore}
              <span className="ml-1">
                {isImproved ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
              </span>
            </Badge>
          </div>
        </div>
      );
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Văn bản gốc</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                Độ đọc
              </h4>
              {renderMeter(originalAnalysis.readability.score, "Điểm đọc")}
              <div className="text-sm text-muted-foreground">
                Cấp độ: <Badge variant="outline">{originalAnalysis.readability.grade}</Badge>
                <span className="mx-2">•</span>
                Độ dài câu TB: <Badge variant="outline">{originalAnalysis.readability.averageSentenceLength}</Badge>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-primary" />
                Độ phức tạp
              </h4>
              {renderMeter(originalAnalysis.complexity.score, "Điểm phức tạp")}
              <div className="text-sm text-muted-foreground">
                Từ vựng phong phú: <Badge variant="outline">{originalAnalysis.complexity.vocabularyRichness}%</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                Tính nhất quán
              </h4>
              {renderMeter(originalAnalysis.consistency.score, "Điểm nhất quán")}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Văn bản đã humanize</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                Độ đọc
              </h4>
              {renderMeter(humanizedAnalysis.readability.score, "Điểm đọc")}
              <div className="text-sm text-muted-foreground">
                Cấp độ: <Badge variant="outline">{humanizedAnalysis.readability.grade}</Badge>
                <span className="mx-2">•</span>
                Độ dài câu TB: <Badge variant="outline">{humanizedAnalysis.readability.averageSentenceLength}</Badge>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-primary" />
                Độ phức tạp
              </h4>
              {renderMeter(humanizedAnalysis.complexity.score, "Điểm phức tạp")}
              <div className="text-sm text-muted-foreground">
                Từ vựng phong phú: <Badge variant="outline">{humanizedAnalysis.complexity.vocabularyRichness}%</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                Tính nhất quán
              </h4>
              {renderMeter(humanizedAnalysis.consistency.score, "Điểm nhất quán")}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">So sánh và gợi ý</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Thay đổi chính</h4>
              {renderComparison(
                originalAnalysis.readability.score,
                humanizedAnalysis.readability.score,
                "Độ đọc",
                true
              )}
              {renderComparison(
                originalAnalysis.complexity.score,
                humanizedAnalysis.complexity.score,
                "Độ phức tạp",
                false
              )}
              {renderComparison(
                originalAnalysis.consistency.score,
                humanizedAnalysis.consistency.score,
                "Tính nhất quán",
                true
              )}
              {humanScore !== null && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1">Điểm human</div>
                  <div>
                    <Badge variant="secondary" className="px-2.5 py-1">
                      {humanScore}%
                    </Badge>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Đánh giá tổng quát</h4>
              <p className="text-sm text-muted-foreground mb-2">{humanizedAnalysis.summary}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Gợi ý cải thiện</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                {humanizedAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">So sánh văn bản</h3>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !originalText || !humanizedText}
              className="mr-2"
            >
              <BarChart className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Đang phân tích...' : 'Phân tích chi tiết'}
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="text" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Văn bản
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Phân tích
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-0">
            <div className="flex items-center justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView(activeView === 'split' ? 'diff' : 'split')}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                {activeView === 'split' ? 'Xem đối chiếu' : 'Xem tách biệt'}
              </Button>
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              {renderDiffView()}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0">
            <ScrollArea className="h-[500px] pr-4">
              {renderAnalysisView()}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TextComparison;
