
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Clock, 
  Activity, 
  Zap, 
  Users, 
  Target
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Giả lập dữ liệu thống kê
const mockUsageData = [
  { month: '01/2023', humanizer: 2500, detector: 1200, writer: 800 },
  { month: '02/2023', humanizer: 3200, detector: 1800, writer: 950 },
  { month: '03/2023', humanizer: 4000, detector: 2100, writer: 1100 },
  { month: '04/2023', humanizer: 3800, detector: 2300, writer: 1300 },
  { month: '05/2023', humanizer: 4500, detector: 2700, writer: 1500 },
  { month: '06/2023', humanizer: 5200, detector: 3100, writer: 1800 },
];

const mockActivityData = [
  { date: '20/05/2023', humanizationCount: 5, detectionCount: 3, generationCount: 1 },
  { date: '21/05/2023', humanizationCount: 8, detectionCount: 4, generationCount: 2 },
  { date: '22/05/2023', humanizationCount: 6, detectionCount: 5, generationCount: 0 },
  { date: '23/05/2023', humanizationCount: 9, detectionCount: 2, generationCount: 3 },
  { date: '24/05/2023', humanizationCount: 7, detectionCount: 6, generationCount: 1 },
  { date: '25/05/2023', humanizationCount: 12, detectionCount: 5, generationCount: 4 },
  { date: '26/05/2023', humanizationCount: 10, detectionCount: 7, generationCount: 2 },
];

const UsageStatistics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập tải dữ liệu
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container className="py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Thống kê sử dụng</h1>
            <p className="text-muted-foreground mt-1">
              Theo dõi chi tiết hoạt động và mức sử dụng của bạn
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full shadow-sm border">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-medium">Chi tiết phân tích</span>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="detailed">Chi tiết</TabsTrigger>
            <TabsTrigger value="activity">Hoạt động</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Thống kê tổng quát */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tổng từ đã xử lý</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">125,450</div>
                  <p className="text-xs text-muted-foreground">+14.5% so với tháng trước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Số lần phân tích</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">243</div>
                  <p className="text-xs text-muted-foreground">+32.8% so với tháng trước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Thời gian sử dụng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48 giờ</div>
                  <p className="text-xs text-muted-foreground">+8.3% so với tháng trước</p>
                </CardContent>
              </Card>
            </div>

            {/* Biểu đồ sử dụng */}
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng sử dụng</CardTitle>
                <CardDescription>Số từ đã xử lý theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="humanizer" stroke="#8884d8" name="Humanizer" />
                      <Line type="monotone" dataKey="detector" stroke="#82ca9d" name="Detector" />
                      <Line type="monotone" dataKey="writer" stroke="#ffc658" name="Writer" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Mức sử dụng */}
            <Card>
              <CardHeader>
                <CardTitle>Giới hạn sử dụng</CardTitle>
                <CardDescription>Tổng quan về giới hạn và mức sử dụng hiện tại</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">Humanization</span>
                      </div>
                      <span>2,450 / 5,000 từ</span>
                    </div>
                    <Progress value={49} className="h-2" />
                    <p className="text-xs text-muted-foreground">49% giới hạn tháng đã sử dụng</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Content Generation</span>
                      </div>
                      <span>3 / 10 lần</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <p className="text-xs text-muted-foreground">30% giới hạn tháng đã sử dụng</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Advanced Analysis</span>
                      </div>
                      <span>8 / 20 lần</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    <p className="text-xs text-muted-foreground">40% giới hạn tháng đã sử dụng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê chi tiết</CardTitle>
                <CardDescription>Phân tích chi tiết việc sử dụng các tính năng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Biểu đồ phân bổ sử dụng */}
                  <div>
                    <h3 className="font-medium mb-4">Phân bổ sử dụng theo tính năng</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockUsageData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="humanizer" fill="#8884d8" name="Humanizer" />
                          <Bar dataKey="detector" fill="#82ca9d" name="Detector" />
                          <Bar dataKey="writer" fill="#ffc658" name="Writer" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <Separator />

                  {/* Thông tin chi tiết */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Chi tiết Humanizer</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Từ đã xử lý</span>
                          <span className="font-medium">75,230</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Điểm trung bình</span>
                          <span className="font-medium">92.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tỷ lệ tối ưu hóa</span>
                          <span className="font-medium">68%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Chi tiết Detector</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Lần phân tích</span>
                          <span className="font-medium">143</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Phát hiện AI</span>
                          <span className="font-medium">78.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Độ chính xác</span>
                          <span className="font-medium">95.8%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Chi tiết Writer</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Nội dung tạo ra</span>
                          <span className="font-medium">37</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tổng từ</span>
                          <span className="font-medium">42,650</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Điểm chất lượng</span>
                          <span className="font-medium">89.3%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Biểu đồ hoạt động trong 7 ngày qua</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="humanizationCount" fill="#8884d8" name="Humanization" />
                      <Bar dataKey="detectionCount" fill="#82ca9d" name="Detection" />
                      <Bar dataKey="generationCount" fill="#ffc658" name="Generation" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách hoạt động</CardTitle>
                <CardDescription>10 hoạt động gần đây nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Danh sách hoạt động */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        index % 3 === 0 ? 'bg-purple-100 text-purple-600' : 
                        index % 3 === 1 ? 'bg-green-100 text-green-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {index % 3 === 0 ? <Zap className="h-4 w-4" /> : 
                         index % 3 === 1 ? <Activity className="h-4 w-4" /> : 
                         <Clock className="h-4 w-4" />}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {index % 3 === 0 ? 'Humanized content' : 
                             index % 3 === 1 ? 'Detected AI content' : 
                             'Generated content'}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {new Date(Date.now() - index * 3600000).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {index % 3 === 0 ? '1,250 words processed' : 
                           index % 3 === 1 ? 'AI score: 82%' : 
                           '850 words generated'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default UsageStatistics;
