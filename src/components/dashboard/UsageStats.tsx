
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Zap } from 'lucide-react';

interface UsageStatsProps {
  loading: boolean;
}

export function UsageStats({ loading }: UsageStatsProps) {
  // Mock usage data - in a real app, this would come from your API
  const usage = {
    apiCalls: {
      used: 382,
      total: 1000,
      percentage: 38
    },
    storage: {
      used: 2.1,
      total: 10,
      percentage: 21
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Usage Statistics
        </CardTitle>
        <CardDescription>
          Your current resource usage
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
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">API Calls</span>
                </div>
                <span>{usage.apiCalls.used} / {usage.apiCalls.total}</span>
              </div>
              <Progress value={usage.apiCalls.percentage} className="h-2" />
              <p className="text-sm text-muted-foreground">{usage.apiCalls.percentage}% of monthly allowance used</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-indigo-500">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="font-medium">Storage</span>
                </div>
                <span>{usage.storage.used}GB / {usage.storage.total}GB</span>
              </div>
              <Progress value={usage.storage.percentage} className="h-2" />
              <p className="text-sm text-muted-foreground">{usage.storage.percentage}% of storage limit used</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
