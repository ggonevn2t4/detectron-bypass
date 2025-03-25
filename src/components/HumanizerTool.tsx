
import React, { Suspense, lazy, useState } from 'react';
import { Container } from '@/components/ui/container';
import { useHumanizer } from '@/hooks/useHumanizer';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import NavBar from '@/components/NavBar';
import { ArrowUpRight, History, Sparkles } from 'lucide-react';
import HumanizerHistory from './humanizer/HumanizerHistory';

// Lazy load the tabs component
const HumanizerTabs = lazy(() => import('./humanizer/HumanizerTabs'));

// Loading fallback component
const TabsLoadingSkeleton = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-10 w-full" />
    <div className="space-y-4 mt-4">
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  </div>
);

const HumanizerTool = () => {
  const { usingRealAI, setUsingRealAI } = useHumanizer();
  const [activeTab, setActiveTab] = useState<string>('humanizer');
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <section className="py-8 px-6 bg-background">
          <Container>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Humanizer Tool
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                    <Sparkles className="h-3.5 w-3.5 mr-1" /> AI Powered
                  </Badge>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Transform AI-generated text to pass as human-written content with advanced humanization algorithms
                </p>
              </div>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 mb-6">
                <TabsTrigger value="humanizer" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Humanizer</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="humanizer" className="mt-0">
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                  <Suspense fallback={<TabsLoadingSkeleton />}>
                    <HumanizerTabs 
                      usingRealAI={usingRealAI} 
                      onModeChange={setUsingRealAI} 
                    />
                  </Suspense>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <HumanizerHistory />
              </TabsContent>
            </Tabs>
          </Container>
        </section>
      </main>
    </div>
  );
};

export default HumanizerTool;
