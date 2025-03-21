
import React from 'react';
import { Container } from '@/components/ui/container';
import HumanizerTabs from './humanizer/HumanizerTabs';
import { useHumanizer } from '@/hooks/useHumanizer';

const HumanizerTool = () => {
  const { usingRealAI, setUsingRealAI } = useHumanizer();
  
  return (
    <section className="py-10 px-6 bg-background">
      <Container>
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <HumanizerTabs 
            usingRealAI={usingRealAI} 
            onModeChange={setUsingRealAI} 
          />
        </div>
      </Container>
    </section>
  );
};

export default HumanizerTool;
