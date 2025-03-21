
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Subscription, UserProfile } from '@/types/admin';

export const useSubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      // Fetch all subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*');

      if (subscriptionsError) throw subscriptionsError;

      // Create an array to store the enhanced subscriptions
      const enhancedSubscriptions: Subscription[] = [];

      // For each subscription, fetch the corresponding user profile
      for (const subscription of subscriptionsData || []) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')  // Select all fields to ensure we get id, created_at, etc.
          .eq('id', subscription.user_id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Add subscription without profile data
          enhancedSubscriptions.push(subscription);
        } else {
          // Create a proper UserProfile object from the profile data
          const userProfile: UserProfile = {
            id: profileData.id,
            email: '', // We don't have email in profiles table, but it's required by UserProfile
            username: profileData.username,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
            created_at: profileData.created_at
          };

          // Add the subscription with profile data to our array
          enhancedSubscriptions.push({
            ...subscription,
            userProfile
          });
        }
      }

      setSubscriptions(enhancedSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách thuê bao',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sub.plan_id.toLowerCase().includes(searchLower) ||
      sub.status.toLowerCase().includes(searchLower) ||
      sub.userProfile?.username?.toLowerCase().includes(searchLower) ||
      sub.userProfile?.full_name?.toLowerCase().includes(searchLower) ||
      sub.payment_method.toLowerCase().includes(searchLower)
    );
  });

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  const handleSaveSubscription = async () => {
    if (!selectedSubscription) return;
    
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_id: selectedSubscription.plan_id,
          status: selectedSubscription.status,
          payment_method: selectedSubscription.payment_method,
          current_period_end: selectedSubscription.current_period_end,
        })
        .eq('id', selectedSubscription.id);

      if (error) throw error;

      // Update the local state
      setSubscriptions(subscriptions.map(sub => 
        sub.id === selectedSubscription.id ? selectedSubscription : sub
      ));

      toast({
        title: 'Thành công',
        description: 'Thông tin thuê bao đã được cập nhật',
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin thuê bao',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', subscriptionId);
        
      if (error) throw error;
      
      // Update local state by removing the deleted subscription
      setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
      
      toast({
        title: 'Thành công',
        description: 'Thuê bao đã được xóa thành công',
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa thuê bao',
        variant: 'destructive',
      });
    }
  };

  return {
    subscriptions: filteredSubscriptions,
    loading,
    searchTerm,
    isEditDialogOpen,
    selectedSubscription,
    handleSearch,
    handleEditSubscription,
    setSelectedSubscription,
    setIsEditDialogOpen,
    handleSaveSubscription,
    handleDeleteSubscription,
  };
};
