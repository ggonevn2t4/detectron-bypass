
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface UsageStatsProps {
  loading: boolean;
}

export const UsageStats: React.FC<UsageStatsProps> = ({ loading }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Usage Statistics
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Your current usage and limits
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 sm:h-4 w-3/4 mt-4" />
            <Skeleton className="h-2 w-full" />
          </div>
        ) : (
          <div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-medium text-xs sm:text-sm">Humanization</span>
                </div>
                <span className="text-xs sm:text-sm">2,450 / 5,000 words</span>
              </div>
              <Progress value={49} className="h-1.5 sm:h-2" />
              <p className="text-xs text-muted-foreground">49% of monthly allowance used</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium text-xs sm:text-sm">Content Generation</span>
                </div>
                <span className="text-xs sm:text-sm">3 / 10 generations</span>
              </div>
              <Progress value={30} className="h-1.5 sm:h-2" />
              <p className="text-xs text-muted-foreground">30% of monthly allowance used</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
