
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, CheckCircle, XCircle } from 'lucide-react';

interface UserProfile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  payment_method: string;
  current_period_end: string;
  created_at: string;
  userProfile?: UserProfile;
}

const SubscriptionManagement = () => {
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
          .select('username, full_name, avatar_url')
          .eq('id', subscription.user_id)
          .single();

        // Add the subscription with profile data to our array
        enhancedSubscriptions.push({
          ...subscription,
          userProfile: profileError ? undefined : profileData
        });
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
      sub.userProfile?.full_name?.toLowerCase().includes(searchLower)
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

  const getInitials = (profile: any) => {
    if (!profile) return '?';
    if (profile.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    return profile.username ? profile.username.substring(0, 2).toUpperCase() : '?';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" /> Hoạt động
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="text-red-800">
            <XCircle className="mr-1 h-3 w-3" /> Đã hủy
          </Badge>
        );
      case 'trialing':
        return (
          <Badge variant="secondary">
            Dùng thử
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý thuê bao</CardTitle>
        <CardDescription>Xem và quản lý thuê bao của người dùng</CardDescription>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
          <Input 
            placeholder="Tìm kiếm thuê bao..." 
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Gói thuê bao</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phương thức thanh toán</TableHead>
                  <TableHead>Hết hạn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Không tìm thấy thuê bao nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={subscription.userProfile?.avatar_url || undefined} />
                            <AvatarFallback>{getInitials(subscription.userProfile)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{subscription.userProfile?.full_name || subscription.userProfile?.username || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">@{subscription.userProfile?.username || 'unnamed'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{subscription.plan_id}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscription.status)}
                      </TableCell>
                      <TableCell className="capitalize">{subscription.payment_method}</TableCell>
                      <TableCell>{new Date(subscription.current_period_end).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditSubscription(subscription)}>
                          Chỉnh sửa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Subscription Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thuê bao</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin thuê bao
              </DialogDescription>
            </DialogHeader>
            {selectedSubscription && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan" className="text-right">
                    Gói thuê bao
                  </Label>
                  <Select 
                    value={selectedSubscription.plan_id}
                    onValueChange={(value) => setSelectedSubscription({...selectedSubscription, plan_id: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn gói thuê bao" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Trạng thái
                  </Label>
                  <Select 
                    value={selectedSubscription.status}
                    onValueChange={(value) => setSelectedSubscription({...selectedSubscription, status: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="trialing">Dùng thử</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                      <SelectItem value="past_due">Quá hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment" className="text-right">
                    Phương thức thanh toán
                  </Label>
                  <Select 
                    value={selectedSubscription.payment_method}
                    onValueChange={(value) => setSelectedSubscription({...selectedSubscription, payment_method: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                      <SelectItem value="manual">Thủ công</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiry" className="text-right">
                    Ngày hết hạn
                  </Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={new Date(selectedSubscription.current_period_end).toISOString().split('T')[0]}
                    onChange={(e) => setSelectedSubscription({
                      ...selectedSubscription, 
                      current_period_end: new Date(e.target.value).toISOString()
                    })}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" onClick={handleSaveSubscription}>
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const getInitials = (profile: UserProfile | undefined) => {
  if (!profile) return '?';
  if (profile.full_name) {
    return profile.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }
  return profile.username ? profile.username.substring(0, 2).toUpperCase() : '?';
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="mr-1 h-3 w-3" /> Hoạt động
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="outline" className="text-red-800">
          <XCircle className="mr-1 h-3 w-3" /> Đã hủy
        </Badge>
      );
    case 'trialing':
      return (
        <Badge variant="secondary">
          Dùng thử
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

export default SubscriptionManagement;
