
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Search, Settings, Info } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { useToast } from '@/hooks/use-toast';
import { analyzeAPI } from '@/services/ai/api';

interface AnalysisResult {
  readability: {
    score: number;
    grade: string;
    averageSentenceLength: number;
    complexWords: number;
  };
  complexity: {
    score: number;
    vocabularyRichness: number;
    technicalTerms: number;
    advancedStructures: number;
  };
  consistency: {
    score: number;
    toneShifts: number;
    styleBreaks: number;
    themeCoherence: number;
  };
  summary: string;
  suggestions: string[];
}

const TextAnalysis = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyzeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Văn bản trống",
        description: "Vui lòng nhập văn bản để phân tích",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await analyzeAPI(inputText);
      if (response.success) {
        setAnalysisResult(response.data);
        toast({
          title: "Phân tích hoàn tất",
          description: "Văn bản đã được phân tích thành công",
        });
      } else {
        toast({
          title: "Lỗi phân tích",
          description: response.error || "Đã xảy ra lỗi khi phân tích văn bản",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Format data for the bar chart
  const chartData = analysisResult ? [
    { name: 'Dễ đọc', score: analysisResult.readability.score },
    { name: 'Độ phức tạp', score: analysisResult.complexity.score },
    { name: 'Tính nhất quán', score: analysisResult.consistency.score },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container className="py-10">
        <div className="mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Phân tích văn bản nâng cao</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Nhập văn bản
                </CardTitle>
                <CardDescription>Nhập văn bản để phân tích chi tiết</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập văn bản cần phân tích vào đây..."
                  className="min-h-[200px]"
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {inputText.trim().split(/\s+/).filter(Boolean).length} từ
                  </span>
                  <Button 
                    onClick={handleAnalyzeText} 
                    disabled={isAnalyzing || !inputText.trim()}
                  >
                    {isAnalyzing ? "Đang phân tích..." : "Phân tích ngay"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {analysisResult ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="details">Chi tiết</TabsTrigger>
                  <TabsTrigger value="suggestions">Gợi ý</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Phân tích tổng quan</CardTitle>
                      <CardDescription>{analysisResult.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="score" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <Card className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">Dễ đọc</h3>
                              <Badge variant={analysisResult.readability.score > 70 ? "success" : "secondary"}>
                                {analysisResult.readability.score}/100
                              </Badge>
                            </div>
                            <Progress value={analysisResult.readability.score} className="h-2" />
                            <p className="text-xs mt-2 text-muted-foreground">Cấp độ: {analysisResult.readability.grade}</p>
                          </Card>
                          
                          <Card className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">Độ phức tạp</h3>
                              <Badge variant="secondary">{analysisResult.complexity.score}/100</Badge>
                            </div>
                            <Progress value={analysisResult.complexity.score} className="h-2" />
                            <p className="text-xs mt-2 text-muted-foreground">Từ vựng: {analysisResult.complexity.vocabularyRichness}/100</p>
                          </Card>
                          
                          <Card className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">Tính nhất quán</h3>
                              <Badge variant={analysisResult.consistency.score > 70 ? "success" : "secondary"}>
                                {analysisResult.consistency.score}/100
                              </Badge>
                            </div>
                            <Progress value={analysisResult.consistency.score} className="h-2" />
                            <p className="text-xs mt-2 text-muted-foreground">Chủ đề: {analysisResult.consistency.themeCoherence}/100</p>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Phân tích chi tiết</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Độ dễ đọc</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-4">
                              <h4 className="font-medium mb-1">Độ dài câu trung bình</h4>
                              <p className="text-2xl font-bold">{analysisResult.readability.averageSentenceLength.toFixed(1)} từ</p>
                            </Card>
                            <Card className="p-4">
                              <h4 className="font-medium mb-1">Số từ phức tạp</h4>
                              <p className="text-2xl font-bold">{analysisResult.readability.complexWords}</p>
                            </Card>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-2">Độ phức tạp</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-4">
                              <h4 className="font-medium mb-1">Thuật ngữ kỹ thuật</h4>
                              <p className="text-2xl font-bold">{analysisResult.complexity.technicalTerms}</p>
                            </Card>
                            <Card className="p-4">
                              <h4 className="font-medium mb-1">Cấu trúc nâng cao</h4>
                              <p className="text-2xl font-bold">{analysisResult.complexity.advancedStructures}</p>
                            </Card>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-2">Tính nhất quán</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="p-4">
                              <h4 className="font-medium mb-1">Thay đổi giọng điệu</h4>
                              <p className="text-2xl font-bold">{analysisResult.consistency.toneShifts}</p>
                            </Card>
                            <Card className="p-4">
                              <h4 className="font-medium mb-1">Thay đổi phong cách</h4>
                              <p className="text-2xl font-bold">{analysisResult.consistency.styleBreaks}</p>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="suggestions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gợi ý cải thiện</CardTitle>
                      <CardDescription>Dựa trên phân tích văn bản của bạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex gap-2 p-3 border rounded-lg">
                            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center p-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chưa có phân tích</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Nhập văn bản và bấm "Phân tích ngay" để nhận được phân tích chi tiết về văn bản của bạn.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TextAnalysis;
