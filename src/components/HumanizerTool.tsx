
import React, { Suspense, lazy } from 'react';
import { Container } from '@/components/ui/container';
import { useHumanizer } from '@/hooks/useHumanizer';
import { Skeleton } from '@/components/ui/skeleton';

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
  
  return (
    <section className="py-10 px-6 bg-background">
      <Container>
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <Suspense fallback={<TabsLoadingSkeleton />}>
            <HumanizerTabs 
              usingRealAI={usingRealAI} 
              onModeChange={setUsingRealAI} 
            />
          </Suspense>
        </div>
      </Container>
    </section>
  );
};

export default HumanizerTool;
