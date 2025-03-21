
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Zap } from 'lucide-react';
import { useUserLimits } from '@/hooks/useUserLimits';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function UsageStats() {
  const { limits, loading } = useUserLimits();

  // Tính toán phần trăm sử dụng
  const getHumanizationPercentage = () => {
    if (!limits || limits.isHumanizationUnlimited) return 0;
    if (!limits.humanizationLimit) return 0;
    return Math.min(Math.round((limits.humanizationWordsUsed / limits.humanizationLimit) * 100), 100);
  };

  const getContentGenerationPercentage = () => {
    if (!limits || !limits.contentGenerationLimit) return 0;
    return Math.min(Math.round((limits.contentGenerationsUsed / limits.contentGenerationLimit) * 100), 100);
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Thống kê sử dụng
        </CardTitle>
        <CardDescription>
          Lượng sử dụng hiện tại của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ) : limits ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Humanize</span>
                </div>
                <span>
                  {limits.humanizationWordsUsed} / {limits.isHumanizationUnlimited ? '∞' : limits.humanizationLimit}
                </span>
              </div>
              <Progress value={limits.isHumanizationUnlimited ? 10 : getHumanizationPercentage()} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {limits.isHumanizationUnlimited 
                  ? 'Không giới hạn số từ' 
                  : `${getHumanizationPercentage()}% lượng từ trong tháng đã sử dụng`}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-indigo-500">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span className="font-medium">AI Writer</span>
                </div>
                <span>{limits.contentGenerationsUsed} / {limits.contentGenerationLimit}</span>
              </div>
              <Progress value={getContentGenerationPercentage()} className="h-2" />
              <p className="text-sm text-muted-foreground">{getContentGenerationPercentage()}% lượt tạo nội dung đã sử dụng</p>
            </div>

            {(limits.hasReachedHumanizationLimit || limits.hasReachedContentGenerationLimit) && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800">
                <p className="font-medium">Bạn đã đạt giới hạn sử dụng của gói {limits.planName}</p>
                <p className="mt-1">Nâng cấp lên gói Pro để có thêm tính năng và giới hạn cao hơn.</p>
                <Button variant="outline" size="sm" className="mt-2 border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-50">
                  <Link to="/pricing">Xem các gói</Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>Không có dữ liệu sử dụng</p>
            <p className="text-sm mt-1">Đăng nhập để xem thông tin sử dụng của bạn</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
