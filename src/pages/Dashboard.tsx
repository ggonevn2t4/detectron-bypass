
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, 
  BarChart3, 
  Clock, 
  CreditCard, 
  Activity, 
  Zap, 
  Users, 
  Target
} from 'lucide-react';
import { UsageStats } from '@/components/dashboard/UsageStats';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { SubscriptionStatus } from '@/components/dashboard/SubscriptionStatus';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container className="py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your account, track usage, and view recent activities.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="font-medium">Your Dashboard</span>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="usage" className="text-xs sm:text-sm">Usage</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <SubscriptionStatus loading={loading} />
              <UsageStats loading={loading} />
              <RecentActivities loading={loading} limit={isMobile ? 3 : 5} />
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Detailed Usage Statistics
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Track your API usage and resource consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-20 sm:h-32 w-full" />
                    <Skeleton className="h-3 sm:h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                          <span className="font-medium text-xs sm:text-sm">API Calls</span>
                        </div>
                        <span className="text-xs sm:text-sm">560 / 1000</span>
                      </div>
                      <Progress value={56} className="h-1.5 sm:h-2" />
                      <p className="text-xs text-muted-foreground">56% of monthly allowance used</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                          <span className="font-medium text-xs sm:text-sm">Team Members</span>
                        </div>
                        <span className="text-xs sm:text-sm">3 / 5</span>
                      </div>
                      <Progress value={60} className="h-1.5 sm:h-2" />
                      <p className="text-xs text-muted-foreground">3 of 5 team seats used</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                          <span className="font-medium text-xs sm:text-sm">Projects</span>
                        </div>
                        <span className="text-xs sm:text-sm">2 / 10</span>
                      </div>
                      <Progress value={20} className="h-1.5 sm:h-2" />
                      <p className="text-xs text-muted-foreground">2 of 10 projects created</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <RecentActivities loading={loading} limit={10} />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default Dashboard;
