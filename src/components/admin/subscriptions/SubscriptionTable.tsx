
import React, { useState } from 'react';
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
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ArrowUp, 
  ArrowDown, 
  Trash, 
  AlertTriangle 
} from 'lucide-react';
import { Subscription } from '@/types/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  loading: boolean;
  onEditSubscription: (subscription: Subscription) => void;
  onDeleteSubscription: (subscriptionId: string) => void;
}

type SortField = 'username' | 'plan_id' | 'status' | 'payment_method' | 'current_period_end';
type SortDirection = 'asc' | 'desc';

const SubscriptionTable = ({ 
  subscriptions, 
  loading, 
  onEditSubscription,
  onDeleteSubscription 
}: SubscriptionTableProps) => {
  const [sortField, setSortField] = useState<SortField>('username');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    if (sortField === 'username') {
      valueA = a.userProfile?.username || a.userProfile?.full_name || '';
      valueB = b.userProfile?.username || b.userProfile?.full_name || '';
    } else if (sortField === 'current_period_end') {
      valueA = new Date(a[sortField]).getTime();
      valueB = new Date(b[sortField]).getTime();
    } else {
      valueA = a[sortField];
      valueB = b[sortField];
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-1 h-4 w-4" /> : 
      <ArrowDown className="ml-1 h-4 w-4" />;
  };

  const confirmDelete = (subscription: Subscription) => {
    setSubscriptionToDelete(subscription);
  };

  const handleDeleteConfirmed = () => {
    if (subscriptionToDelete) {
      onDeleteSubscription(subscriptionToDelete.id);
      setSubscriptionToDelete(null);
    }
  };

  const handleDeleteCancelled = () => {
    setSubscriptionToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('username')}
              >
                <div className="flex items-center">
                  Người dùng
                  {getSortIcon('username')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('plan_id')}
              >
                <div className="flex items-center">
                  Gói thuê bao
                  {getSortIcon('plan_id')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Trạng thái
                  {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('payment_method')}
              >
                <div className="flex items-center">
                  Phương thức thanh toán
                  {getSortIcon('payment_method')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('current_period_end')}
              >
                <div className="flex items-center">
                  Hết hạn
                  {getSortIcon('current_period_end')}
                </div>
              </TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Không tìm thấy thuê bao nào
                </TableCell>
              </TableRow>
            ) : (
              sortedSubscriptions.map((subscription) => (
                <TableRow key={subscription.id} className="group">
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
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => onEditSubscription(subscription)}>
                        Chỉnh sửa
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive" 
                        onClick={() => confirmDelete(subscription)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!subscriptionToDelete} onOpenChange={() => setSubscriptionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thuê bao</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thuê bao này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancelled}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirmed}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash className="h-4 w-4 mr-2" /> Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
