
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'T1', users: 40, subscriptions: 24, revenue: 2400 },
  { name: 'T2', users: 60, subscriptions: 32, revenue: 3200 },
  { name: 'T3', users: 85, subscriptions: 45, revenue: 4500 },
  { name: 'T4', users: 90, subscriptions: 50, revenue: 5000 },
  { name: 'T5', users: 120, subscriptions: 65, revenue: 6500 },
  { name: 'T6', users: 145, subscriptions: 80, revenue: 8000 },
  { name: 'T7', users: 160, subscriptions: 90, revenue: 9000 },
  { name: 'T8', users: 190, subscriptions: 110, revenue: 11000 },
  { name: 'T9', users: 220, subscriptions: 130, revenue: 13000 },
  { name: 'T10', users: 240, subscriptions: 145, revenue: 14500 },
  { name: 'T11', users: 265, subscriptions: 155, revenue: 15500 },
  { name: 'T12', users: 290, subscriptions: 170, revenue: 17000 },
];

const usageData = [
  { name: 'T1', humanizer: 1200, detector: 800, writer: 450 },
  { name: 'T2', humanizer: 1500, detector: 950, writer: 600 },
  { name: 'T3', humanizer: 1800, detector: 1100, writer: 750 },
  { name: 'T4', humanizer: 2000, detector: 1300, writer: 900 },
  { name: 'T5', humanizer: 2300, detector: 1500, writer: 1100 },
  { name: 'T6', humanizer: 2600, detector: 1700, writer: 1300 },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('growth');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân tích dữ liệu</CardTitle>
        <CardDescription>Thống kê và biểu đồ về người dùng và thuê bao</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 max-w-[400px]">
            <TabsTrigger value="growth">Tăng trưởng</TabsTrigger>
            <TabsTrigger value="usage">Mức sử dụng</TabsTrigger>
          </TabsList>
          
          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">290</div>
                  <p className="text-xs text-muted-foreground">+24.5% so với tháng trước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Người dùng trả phí</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">170</div>
                  <p className="text-xs text-muted-foreground">+15.2% so với tháng trước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">17,000,000đ</div>
                  <p className="text-xs text-muted-foreground">+10.3% so với tháng trước</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-[300px] mt-6">
              <h3 className="font-medium mb-2">Tăng trưởng theo tháng</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Người dùng" />
                  <Line type="monotone" dataKey="subscriptions" stroke="#82ca9d" name="Thuê bao" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-[300px] mt-6">
              <h3 className="font-medium mb-2">Doanh thu theo tháng (nghìn đồng)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="usage">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tổng lượt sử dụng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,600</div>
                  <p className="text-xs text-muted-foreground">+12.8% so với tháng trước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.2 phút</div>
                  <p className="text-xs text-muted-foreground">+0.8 phút so với tháng trước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tính năng phổ biến</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Humanizer</div>
                  <p className="text-xs text-muted-foreground">46% lượt sử dụng</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-[300px] mt-6">
              <h3 className="font-medium mb-2">Mức sử dụng tính năng</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="humanizer" stroke="#8884d8" name="Humanizer" />
                  <Line type="monotone" dataKey="detector" stroke="#82ca9d" name="AI Detector" />
                  <Line type="monotone" dataKey="writer" stroke="#ffc658" name="AI Writer" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-4">Thống kê chi tiết</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Tỷ lệ chuyển đổi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">12.4%</div>
                    <p className="text-xs text-muted-foreground">Người dùng miễn phí lên trả phí</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Thời gian giữ chân</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">4.2 tháng</div>
                    <p className="text-xs text-muted-foreground">Thời gian trung bình</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Analytics;
