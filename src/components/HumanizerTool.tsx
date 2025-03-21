
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, FileEdit, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import ModeSelector from './humanizer/ModeSelector';
import DetectorTool from './ai-detector/DetectorTool';
import WriterTool from './ai-writer/WriterTool';
import HumanizerTabContent from './humanizer/HumanizerTabContent';
import { useHumanizer } from '@/hooks/useHumanizer';

const HumanizerTool = () => {
  const [currentTab, setCurrentTab] = useState('humanizer');
  
  const {
    inputText,
    outputText,
    isProcessing,
    wordCount,
    humanScore,
    progressValue,
    usingRealAI,
    showAdvancedSettings,
    humanScoreTarget,
    humanizationApproach,
    autoOptimize,
    iterations,
    writingStyle,
    handleInputChange,
    handleSampleText,
    handleHumanize,
    handleOptimize,
    handleCopy,
    handleDownload,
    setUsingRealAI,
    setShowAdvancedSettings,
    setHumanScoreTarget,
    setHumanizationApproach,
    setAutoOptimize,
    setIterations,
    setWritingStyle
  } = useHumanizer();

  return (
    <section className="py-10 px-6 bg-background">
      <Container>
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <Tabs 
            defaultValue="humanizer" 
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <div className="border-b border-border">
              <div className="px-6 flex justify-between items-center">
                <TabsList className="bg-transparent h-16">
                  <TabsTrigger 
                    value="humanizer" 
                    className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg mr-2"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Humanizer
                  </TabsTrigger>
                  <TabsTrigger 
                    value="detector" 
                    className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg mr-2"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    AI Detector
                  </TabsTrigger>
                  <TabsTrigger 
                    value="writer" 
                    className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg"
                  >
                    <FileEdit className="mr-2 h-4 w-4" />
                    AI Writer
                  </TabsTrigger>
                </TabsList>
                
                <ModeSelector 
                  usingRealAI={usingRealAI}
                  onModeChange={setUsingRealAI}
                />
              </div>
            </div>
            
            <TabsContent value="humanizer" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <HumanizerTabContent
                inputText={inputText}
                outputText={outputText}
                wordCount={wordCount}
                isProcessing={isProcessing}
                showAdvancedSettings={showAdvancedSettings}
                humanScore={humanScore}
                progressValue={progressValue}
                humanScoreTarget={humanScoreTarget}
                humanizationApproach={humanizationApproach}
                autoOptimize={autoOptimize}
                iterations={iterations}
                writingStyle={writingStyle}
                onInputChange={handleInputChange}
                onSampleText={handleSampleText}
                onToggleSettings={() => setShowAdvancedSettings(!showAdvancedSettings)}
                onHumanize={handleHumanize}
                onOptimize={handleOptimize}
                onCopy={handleCopy}
                onDownload={handleDownload}
                setHumanScoreTarget={setHumanScoreTarget}
                setHumanizationApproach={setHumanizationApproach}
                setAutoOptimize={setAutoOptimize}
                setIterations={setIterations}
                setWritingStyle={setWritingStyle}
              />
            </TabsContent>
            
            <TabsContent value="detector">
              <DetectorTool />
            </TabsContent>
            
            <TabsContent value="writer">
              <WriterTool />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  );
};

export default HumanizerTool;
