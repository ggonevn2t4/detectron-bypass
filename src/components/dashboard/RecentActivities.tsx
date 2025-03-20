
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, MessageSquare, FileText, Upload, Download, User } from 'lucide-react';

interface RecentActivitiesProps {
  loading: boolean;
  limit?: number;
}

export function RecentActivities({ loading, limit = 5 }: RecentActivitiesProps) {
  // Mock activity data - in a real app, this would come from your API
  const activities = [
    {
      id: 1,
      type: 'message',
      description: 'New message sent to AI assistant',
      date: '1 hour ago',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: 2,
      type: 'document',
      description: 'Document "Project Plan.pdf" processed',
      date: '3 hours ago',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 3,
      type: 'upload',
      description: 'Uploaded new profile picture',
      date: 'Yesterday, 4:30 PM',
      icon: <Upload className="h-4 w-4" />
    },
    {
      id: 4,
      type: 'download',
      description: 'Downloaded report "Q3 Analysis"',
      date: 'Yesterday, 2:15 PM',
      icon: <Download className="h-4 w-4" />
    },
    {
      id: 5,
      type: 'profile',
      description: 'Updated account information',
      date: '2 days ago',
      icon: <User className="h-4 w-4" />
    },
    {
      id: 6,
      type: 'message',
      description: 'Sent feedback to support team',
      date: '2 days ago',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: 7,
      type: 'document',
      description: 'Created new document "Meeting Notes"',
      date: '3 days ago',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 8,
      type: 'upload',
      description: 'Uploaded training data',
      date: '3 days ago',
      icon: <Upload className="h-4 w-4" />
    },
    {
      id: 9,
      type: 'download',
      description: 'Downloaded AI model results',
      date: '4 days ago',
      icon: <Download className="h-4 w-4" />
    },
    {
      id: 10,
      type: 'profile',
      description: 'Changed password',
      date: '5 days ago',
      icon: <User className="h-4 w-4" />
    }
  ].slice(0, limit);

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'text-blue-500';
      case 'document':
        return 'text-amber-500';
      case 'upload':
        return 'text-green-500';
      case 'download':
        return 'text-purple-500';
      case 'profile':
        return 'text-indigo-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={limit === 5 ? "col-span-1 lg:col-span-1" : "col-span-full"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activities
        </CardTitle>
        <CardDescription>
          Your latest interactions and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(limit).fill(0).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`rounded-full p-1.5 ${getActivityIconColor(activity.type)} bg-opacity-10 bg-current`}>
                  {React.cloneElement(activity.icon as React.ReactElement, { 
                    className: `h-4 w-4 ${getActivityIconColor(activity.type)}` 
                  })}
                </div>
                <div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
