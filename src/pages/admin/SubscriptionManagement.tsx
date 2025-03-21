
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SubscriptionTable from '@/components/admin/subscriptions/SubscriptionTable';
import SubscriptionEditDialog from '@/components/admin/subscriptions/SubscriptionEditDialog';
import SubscriptionSearch from '@/components/admin/subscriptions/SubscriptionSearch';
import { useSubscriptionManagement } from '@/hooks/admin/useSubscriptionManagement';

const SubscriptionManagement = () => {
  const {
    subscriptions,
    loading,
    searchTerm,
    isEditDialogOpen,
    selectedSubscription,
    handleSearch,
    handleEditSubscription,
    setSelectedSubscription,
    setIsEditDialogOpen,
    handleSaveSubscription,
  } = useSubscriptionManagement();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý thuê bao</CardTitle>
        <CardDescription>Xem và quản lý thuê bao của người dùng</CardDescription>
        <SubscriptionSearch 
          searchTerm={searchTerm} 
          onSearchChange={handleSearch} 
        />
      </CardHeader>
      <CardContent>
        <SubscriptionTable 
          subscriptions={subscriptions} 
          loading={loading} 
          onEditSubscription={handleEditSubscription} 
        />

        <SubscriptionEditDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          selectedSubscription={selectedSubscription}
          onSelectedSubscriptionChange={setSelectedSubscription}
          onSave={handleSaveSubscription}
        />
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
