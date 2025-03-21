
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/admin';

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch user emails from auth.users (you'll need an admin function for this in production)
      // For demo purposes, we'll use sample data
      const userProfiles = await Promise.all(
        profiles.map(async (profile) => {
          // Get subscription info
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('plan_id, status')
            .eq('user_id', profile.id)
            .maybeSingle();

          return {
            ...profile,
            // In production, you'd get this from auth.users
            email: `user_${profile.id.substring(0, 6)}@example.com`,
            subscription: subscription || null
          };
        })
      );

      setUsers(userProfiles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách người dùng',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.full_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: selectedUser.username,
          full_name: selectedUser.full_name,
          avatar_url: selectedUser.avatar_url,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update the local state
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));

      toast({
        title: 'Thành công',
        description: 'Thông tin người dùng đã được cập nhật',
      });
      
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin người dùng',
        variant: 'destructive',
      });
    }
  };

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    isEditDialogOpen,
    selectedUser,
    setSearchTerm,
    handleSearch,
    handleEditUser,
    setSelectedUser,
    setIsEditDialogOpen,
    handleSaveUser,
  };
};
