
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Check } from 'lucide-react';
import { useUserLimits } from '@/hooks/useUserLimits';
import { Link } from 'react-router-dom';

export function SubscriptionStatus() {
  const { limits, loading } = useUserLimits();

  // Các tính năng của từng gói
  const getFeatures = (plan: string) => {
    switch (plan) {
      case 'free':
        return [
          'Giới hạn 550 từ cho humanization',
          'Giới hạn 3 lượt tạo nội dung',
          'Xử lý tối đa 1,000 từ mỗi lần',
          'Phân tích AI cơ bản'
        ];
      case 'pro':
        return [
          'Không giới hạn từ cho humanization',
          '15 lượt tạo nội dung mỗi tháng',
          'Xử lý tối đa 2,500 từ mỗi lần',
          'Phân tích AI nâng cao',
          'Hỗ trợ ưu tiên',
        ];
      case 'admin':
        return [
          'Không giới hạn từ cho humanization',
          'Không giới hạn lượt tạo nội dung',
          'Xử lý tối đa 10,000 từ mỗi lần',
          'Phân tích AI nâng cao',
          'Truy cập quản trị viên',
          'Tất cả tính năng hiện tại và sắp ra mắt'
        ];
      default:
        return [
          'Giới hạn 550 từ cho humanization',
          'Giới hạn 3 lượt tạo nội dung',
          'Xử lý tối đa 1,000 từ mỗi lần',
          'Phân tích AI cơ bản'
        ];
    }
  };

  return (
    <Card className="col-span-1 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Trạng thái đăng ký
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Thông tin gói hiện tại và thanh toán
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-3 sm:h-4 w-3/4" />
            <Skeleton className="h-3 sm:h-4 w-1/2" />
            <Skeleton className="h-3 sm:h-4 w-5/6" />
            <div className="space-y-1 sm:space-y-2 mt-3 sm:mt-4">
              <Skeleton className="h-2 sm:h-3 w-full" />
              <Skeleton className="h-2 sm:h-3 w-full" />
              <Skeleton className="h-2 sm:h-3 w-3/4" />
            </div>
          </div>
        ) : limits ? (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-2xs sm:text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                {limits.planName}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Trạng thái: <span className="text-green-600 font-medium">Đang hoạt động</span>
              </p>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium">Tính năng bao gồm trong gói của bạn:</p>
              <ul className="space-y-0.5 sm:space-y-1">
                {getFeatures(limits.plan).map((feature, index) => (
                  <li key={index} className="text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5">
                    <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            <p>Không có thông tin gói</p>
            <p className="text-sm mt-1">Đăng nhập để xem thông tin gói của bạn</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm py-1.5 sm:py-2">
          <Link to="/pricing">Quản lý gói đăng ký</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
