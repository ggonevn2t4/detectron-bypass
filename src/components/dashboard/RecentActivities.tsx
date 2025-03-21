import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentActivitiesProps {
  loading: boolean;
  limit?: number;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ loading, limit = 5 }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Recent Activities
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Your recent actions and usage history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div>
            <p>Activities data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
