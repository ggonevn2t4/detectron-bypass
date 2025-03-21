
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import HumanizerTabsHeader from './HumanizerTabsHeader';
import HumanizerTab from './tabs/HumanizerTab';
import DetectorTool from '../ai-detector/DetectorTool';
import WriterTool from '../ai-writer/WriterTool';
import TranslationTool from '../translation/TranslationTool';

interface HumanizerTabsProps {
  usingRealAI: boolean;
  onModeChange: (value: boolean) => void;
}

const HumanizerTabs: React.FC<HumanizerTabsProps> = ({
  usingRealAI,
  onModeChange
}) => {
  const [currentTab, setCurrentTab] = useState('humanizer');

  return (
    <Tabs 
      defaultValue="humanizer" 
      value={currentTab}
      onValueChange={setCurrentTab}
      className="w-full"
    >
      <HumanizerTabsHeader 
        usingRealAI={usingRealAI} 
        onModeChange={onModeChange} 
      />
      
      <TabsContent value="humanizer" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
        <HumanizerTab />
      </TabsContent>
      
      <TabsContent value="detector">
        <DetectorTool />
      </TabsContent>
      
      <TabsContent value="writer">
        <WriterTool />
      </TabsContent>
      
      <TabsContent value="translator">
        <TranslationTool />
      </TabsContent>
    </Tabs>
  );
};

export default HumanizerTabs;
