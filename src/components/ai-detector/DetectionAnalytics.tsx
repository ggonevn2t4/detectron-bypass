
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { HistoryItem } from './hooks/useDetectorState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DetectionAnalyticsProps {
  history: HistoryItem[];
}

const DetectionAnalytics: React.FC<DetectionAnalyticsProps> = ({ history }) => {
  // Skip if no history
  if (!history || history.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Phân tích lịch sử</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Chưa có đủ dữ liệu để phân tích. Hãy phân tích nhiều nội dung hơn.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Create score distribution data
  const scoreDistribution = history.reduce((acc, item) => {
    const scoreRange = Math.floor(item.result.score / 10) * 10;
    const rangeKey = `${scoreRange}-${scoreRange + 9}`;
    
    if (!acc[rangeKey]) {
      acc[rangeKey] = 0;
    }
    
    acc[rangeKey]++;
    return acc;
  }, {} as Record<string, number>);

  const distributionData = Object.entries(scoreDistribution).map(([range, count]) => ({
    range,
    count
  }));

  // Create detection category data
  const detectionCategories = {
    'AI Generated': history.filter(item => item.result.score >= 85).length,
    'Possibly AI': history.filter(item => item.result.score >= 60 && item.result.score < 85).length,
    'Likely Human': history.filter(item => item.result.score < 60).length,
  };

  const categoryData = Object.entries(detectionCategories).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for pie chart
  const COLORS = ['#ff4d4f', '#faad14', '#52c41a'];

  // Calculate average score
  const averageScore = history.reduce((sum, item) => sum + item.result.score, 0) / history.length;

  // Get recent results
  const recentResults = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Identify common patterns
  const allPatterns = history.flatMap(item => item.result.patterns || []);
  const patternCount: Record<string, number> = {};
  
  allPatterns.forEach(pattern => {
    if (!patternCount[pattern]) {
      patternCount[pattern] = 0;
    }
    patternCount[pattern]++;
  });
  
  const topPatterns = Object.entries(patternCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern, count]) => ({ pattern, count }));

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Phân tích lịch sử</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="distribution">Phân phối điểm</TabsTrigger>
            <TabsTrigger value="patterns">Đặc điểm phổ biến</TabsTrigger>
            <TabsTrigger value="recent">Kết quả gần đây</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Số lượng phân tích</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{history.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Văn bản AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {history.filter(item => item.result.score >= 85).length} 
                    <span className="text-sm text-muted-foreground ml-1">
                      ({((history.filter(item => item.result.score >= 85).length / history.length) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Phân loại văn bản</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ChartContainer 
                    config={{
                      'AI Generated': { color: COLORS[0] },
                      'Possibly AI': { color: COLORS[1] },
                      'Likely Human': { color: COLORS[2] }
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Đặc điểm phổ biến</CardTitle>
                </CardHeader>
                <CardContent>
                  {topPatterns.length > 0 ? (
                    <div className="space-y-4">
                      {topPatterns.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-full">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{item.pattern}</span>
                              <span className="text-sm font-medium">{item.count}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(item.count / history.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Chưa có đủ dữ liệu về các đặc điểm.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Phân phối điểm số</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer 
                  config={{
                    count: { 
                      theme: { 
                        light: 'hsl(215, 90%, 52%)',
                        dark: 'hsl(215, 90%, 52%)'
                      }
                    }
                  }}
                >
                  <BarChart data={distributionData}>
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patterns">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Phân tích đặc điểm</CardTitle>
              </CardHeader>
              <CardContent>
                {topPatterns.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Đặc điểm</TableHead>
                        <TableHead className="text-right">Số lần xuất hiện</TableHead>
                        <TableHead className="text-right">Tỷ lệ (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPatterns.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.pattern}</TableCell>
                          <TableCell className="text-right">{item.count}</TableCell>
                          <TableCell className="text-right">
                            {((item.count / history.length) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Chưa có đủ dữ liệu về các đặc điểm.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Kết quả phân tích gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Nội dung</TableHead>
                      <TableHead className="text-right">Điểm số</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentResults.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{item.text}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${
                            item.result.score >= 85 
                              ? 'text-red-500' 
                              : item.result.score >= 60 
                                ? 'text-amber-500' 
                                : 'text-green-500'
                          }`}>
                            {item.result.score}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetectionAnalytics;
