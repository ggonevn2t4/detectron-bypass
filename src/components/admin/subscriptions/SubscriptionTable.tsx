
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Subscription } from '@/types/admin';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  loading: boolean;
  onEditSubscription: (subscription: Subscription) => void;
}

const SubscriptionTable = ({ subscriptions, loading, onEditSubscription }: SubscriptionTableProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
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
          {subscriptions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Không tìm thấy thuê bao nào
              </TableCell>
            </TableRow>
          ) : (
            subscriptions.map((subscription) => (
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
                  <Button variant="ghost" size="sm" onClick={() => onEditSubscription(subscription)}>
                    Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
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

export default SubscriptionTable;
