import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, FileEdit, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  humanizeTextWithGemini, analyzeAIScore, detectAIContent, 
  generateAIContent, humanizeTextLocally, calculateInitialAiScore 
} from '@/services/ai';
import { Container } from '@/components/ui/container';
import HumanizerInput from './humanizer/HumanizerInput';
import HumanizerOutput from './humanizer/HumanizerOutput';
import ModeSelector from './humanizer/ModeSelector';
import DetectorTool from './ai-detector/DetectorTool';
import WriterTool from './ai-writer/WriterTool';

const HumanizerTool = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [aiDetectionScore, setAiDetectionScore] = useState<number | null>(null);
  const [progressValue, setProgressValue] = useState(0);
  const [currentTab, setCurrentTab] = useState('humanizer');
  const [usingRealAI, setUsingRealAI] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  // Advanced settings
  const [humanScoreTarget, setHumanScoreTarget] = useState(95);
  const [humanizationApproach, setHumanizationApproach] = useState<'standard' | 'aggressive' | 'ultra'>('standard');
  const [iterations, setIterations] = useState(1);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [writingStyle, setWritingStyle] = useState('general');
  const [optimizationStage, setOptimizationStage] = useState(0);
  const [optimizationHistory, setOptimizationHistory] = useState<Array<{score: number, text: string}>>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    updateWordCount(text);
  };

  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleSampleText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setInputText(sampleTexts[randomIndex]);
    updateWordCount(sampleTexts[randomIndex]);
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to humanize",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setProgressValue(0);
    setOptimizationStage(0);
    setOptimizationHistory([]);
    
    try {
      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 10) + 1;
        });
      }, 300);
      
      let initialAiScore: number;
      if (usingRealAI) {
        initialAiScore = await analyzeAIScore(inputText);
      } else {
        initialAiScore = calculateInitialAiScore(inputText);
      }
      setAiDetectionScore(initialAiScore);
      
      let humanized: string;
      if (usingRealAI) {
        humanized = await humanizeTextWithGemini(
          inputText, 
          undefined, 
          {
            targetScore: humanScoreTarget,
            approach: humanizationApproach,
            style: writingStyle
          }
        );
      } else {
        humanized = humanizeTextLocally(inputText);
      }
      
      setOutputText(humanized);
      
      let finalHumanScore: number;
      if (usingRealAI) {
        const newAiScore = await analyzeAIScore(humanized);
        finalHumanScore = 100 - newAiScore;
      } else {
        finalHumanScore = 100 - calculateInitialAiScore(humanized);
      }
      
      setOptimizationHistory([{
        score: finalHumanScore,
        text: humanized
      }]);
      
      setHumanScore(finalHumanScore);
      
      if (autoOptimize && finalHumanScore < humanScoreTarget && iterations > 1) {
        await runOptimizationIterations(humanized, finalHumanScore, iterations - 1);
      } else {
        setProgressValue(100);
        
        toast({
          title: "Humanization Complete",
          description: `Your text is now ${finalHumanScore}% human-like`,
        });
      }
      
      clearInterval(progressInterval);
    } catch (error) {
      console.error("Error in humanization process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const runOptimizationIterations = async (text: string, currentScore: number, remainingIterations: number) => {
    if (remainingIterations <= 0 || currentScore >= humanScoreTarget) {
      setProgressValue(100);
      toast({
        title: "Optimization Complete",
        description: `Your text is now ${currentScore}% human-like after ${optimizationStage + 1} iterations`,
      });
      return;
    }
    
    try {
      setOptimizationStage(prev => prev + 1);
      
      let optimized: string;
      if (usingRealAI) {
        optimized = await humanizeTextWithGemini(
          text, 
          currentScore, 
          {
            targetScore: humanScoreTarget,
            approach: humanizationApproach,
            style: writingStyle,
            iterationCount: optimizationStage + 1
          }
        );
      } else {
        optimized = humanizeTextLocally(text);
      }
      
      let newHumanScore: number;
      if (usingRealAI) {
        const newAiScore = await analyzeAIScore(optimized);
        newHumanScore = 100 - newAiScore;
      } else {
        newHumanScore = 100 - calculateInitialAiScore(optimized);
      }
      
      setOutputText(optimized);
      setHumanScore(newHumanScore);
      
      setOptimizationHistory(prev => [...prev, {
        score: newHumanScore,
        text: optimized
      }]);
      
      if (newHumanScore < humanScoreTarget && remainingIterations > 1) {
        await runOptimizationIterations(optimized, newHumanScore, remainingIterations - 1);
      } else {
        setProgressValue(100);
        toast({
          title: "Optimization Complete",
          description: `Your text is now ${newHumanScore}% human-like after ${optimizationStage + 1} iterations`,
        });
      }
    } catch (error) {
      console.error("Error in optimization iteration:", error);
      throw error;
    }
  };

  const handleOptimize = async () => {
    if (!outputText.trim()) {
      toast({
        title: "No Text to Optimize",
        description: "Please humanize text first before optimizing",
        variant: "default",
      });
      return;
    }
    
    setIsProcessing(true);
    setProgressValue(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 8) + 1;
        });
      }, 300);
      
      setOptimizationStage(prev => prev + 1);
      
      const currentScore = humanScore || 0;
      
      let optimized: string;
      if (usingRealAI) {
        optimized = await humanizeTextWithGemini(
          outputText, 
          currentScore, 
          {
            targetScore: humanScoreTarget,
            approach: humanizationApproach,
            style: writingStyle,
            iterationCount: optimizationStage + 1
          }
        );
      } else {
        optimized = humanizeTextLocally(outputText);
      }
      
      let newHumanScore: number;
      if (usingRealAI) {
        const newAiScore = await analyzeAIScore(optimized);
        newHumanScore = 100 - newAiScore;
      } else {
        newHumanScore = 100 - calculateInitialAiScore(optimized);
      }
      
      setOptimizationHistory(prev => [...prev, {
        score: newHumanScore,
        text: optimized
      }]);
      
      setOutputText(optimized);
      setHumanScore(newHumanScore);
      setProgressValue(100);
      
      clearInterval(progressInterval);
      
      toast({
        title: "Optimization Complete",
        description: `Your text is now ${newHumanScore}% human-like`,
      });
    } catch (error) {
      console.error("Error in optimization process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    });
  };
  
  const handleDownload = (text: string, filename: string) => {
    if (!text) return;
    
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download complete",
      description: `Your text has been downloaded as ${filename}`,
    });
  };

  useEffect(() => {
    if (inputText !== "") {
      setHumanScore(null);
      setAiDetectionScore(null);
      setOptimizationHistory([]);
      setOptimizationStage(0);
    }
  }, [inputText]);

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
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HumanizerInput 
                    inputText={inputText}
                    wordCount={wordCount}
                    isProcessing={isProcessing}
                    showAdvancedSettings={showAdvancedSettings}
                    onInputChange={handleInputChange}
                    onSampleText={handleSampleText}
                    onToggleSettings={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    onHumanize={handleHumanize}
                    humanScoreTarget={humanScoreTarget}
                    setHumanScoreTarget={setHumanScoreTarget}
                    humanizationApproach={humanizationApproach}
                    setHumanizationApproach={setHumanizationApproach}
                    autoOptimize={autoOptimize}
                    setAutoOptimize={setAutoOptimize}
                    iterations={iterations}
                    setIterations={setIterations}
                    writingStyle={writingStyle}
                    setWritingStyle={setWritingStyle}
                  />
                  
                  <HumanizerOutput 
                    outputText={outputText}
                    humanScore={humanScore}
                    isProcessing={isProcessing}
                    progressValue={progressValue}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                    onOptimize={handleOptimize}
                  />
                </div>
              </div>
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
