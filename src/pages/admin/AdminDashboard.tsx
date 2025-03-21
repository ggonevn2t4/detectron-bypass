
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from './UserManagement';
import SubscriptionManagement from './SubscriptionManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Quản trị viên</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Quản lý người dùng và thuê bao
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="users" className="text-xs sm:text-sm">Người dùng</TabsTrigger>
            <TabsTrigger value="subscriptions" className="text-xs sm:text-sm">Thuê bao</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionManagement />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default AdminDashboard;
