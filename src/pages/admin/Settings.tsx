
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { API_KEY } from '@/services/ai/common';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  const [apiSettings, setApiSettings] = useState({
    deepseekApiKey: API_KEY || '',
    maxTokens: '4000',
    temperature: '0.7',
  });

  const handleSaveGeneral = () => {
    toast({
      title: "Cài đặt đã được lưu",
      description: "Các thay đổi đã được áp dụng thành công.",
    });
  };

  const handleSaveApi = () => {
    // In a real app, this would update the API key in a secure way
    toast({
      title: "Cài đặt API đã được lưu",
      description: "Cấu hình API đã được cập nhật thành công.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cài đặt hệ thống</CardTitle>
        <CardDescription>Quản lý cấu hình và các thiết lập của ứng dụng</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 max-w-[400px]">
            <TabsTrigger value="general">Chung</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Tên trang web</Label>
                <Input id="site-name" defaultValue="HumanizeAI" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Mô tả</Label>
                <Textarea 
                  id="site-description" 
                  defaultValue="Platform giúp người dùng biến văn bản AI thành văn bản tự nhiên hơn, đồng thời cung cấp công cụ phát hiện nội dung AI."
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
                  <Switch id="maintenance-mode" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Khi bật, người dùng sẽ thấy thông báo bảo trì khi truy cập trang web.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="registration">Cho phép đăng ký mới</Label>
                  <Switch id="registration" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">
                  Bật/tắt khả năng đăng ký người dùng mới.
                </p>
              </div>
            </div>
            
            <Button onClick={handleSaveGeneral} className="mt-6">Lưu thay đổi</Button>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="deepseek-api-key">DeepSeek API Key</Label>
                <Input 
                  id="deepseek-api-key" 
                  value={apiSettings.deepseekApiKey} 
                  onChange={(e) => setApiSettings({...apiSettings, deepseekApiKey: e.target.value})}
                  type="password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input 
                  id="max-tokens" 
                  value={apiSettings.maxTokens}
                  onChange={(e) => setApiSettings({...apiSettings, maxTokens: e.target.value})}
                  type="number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input 
                  id="temperature" 
                  value={apiSettings.temperature}
                  onChange={(e) => setApiSettings({...apiSettings, temperature: e.target.value})}
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                />
                <p className="text-xs text-muted-foreground">
                  Giá trị từ 0 đến 1. Giá trị thấp hơn tạo ra kết quả nhất quán hơn, cao hơn tạo ra kết quả đa dạng hơn.
                </p>
              </div>
            </div>
            
            <Button onClick={handleSaveApi} className="mt-6">Lưu thay đổi API</Button>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Gửi thông báo qua email</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">
                  Gửi email thông báo khi có người dùng mới đăng ký.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="subscription-alerts">Cảnh báo thuê bao</Label>
                  <Switch id="subscription-alerts" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">
                  Nhận thông báo khi có thuê bao hết hạn hoặc bị hủy.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email quản trị viên</Label>
                <Input id="admin-email" defaultValue="admin@humanizeai.cloud" />
              </div>
            </div>
            
            <Button onClick={handleSaveGeneral} className="mt-6">Lưu cài đặt thông báo</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Settings;
