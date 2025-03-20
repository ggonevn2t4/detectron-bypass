
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
import PlaceholderTab from './humanizer/PlaceholderTab';
import { sampleTexts } from './humanizer/SampleTexts';

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
  const [humanScoreTarget, setHumanScoreTarget] = useState(95);
  const [humanizationApproach, setHumanizationApproach] = useState<'standard' | 'aggressive' | 'ultra'>('standard');
  const [iterations, setIterations] = useState(1);
  const [autoRun, setAutoRun] = useState(false);
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
      // Show progress animation
      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 10) + 1;
        });
      }, 300);
      
      // Analyze initial AI score
      let initialAiScore: number;
      if (usingRealAI) {
        initialAiScore = await analyzeAIScore(inputText);
      } else {
        initialAiScore = calculateInitialAiScore(inputText);
      }
      setAiDetectionScore(initialAiScore);
      
      // First humanization pass
      let humanized: string;
      if (usingRealAI) {
        humanized = await humanizeTextWithGemini(inputText);
      } else {
        humanized = humanizeTextLocally(inputText);
      }
      
      // Set initial output
      setOutputText(humanized);
      
      // Get human score after first pass
      let finalHumanScore: number;
      if (usingRealAI) {
        const newAiScore = await analyzeAIScore(humanized);
        finalHumanScore = 100 - newAiScore;
      } else {
        finalHumanScore = 100 - calculateInitialAiScore(humanized);
      }
      
      // Add to history
      setOptimizationHistory([{
        score: finalHumanScore,
        text: humanized
      }]);
      
      setHumanScore(finalHumanScore);
      setProgressValue(100);
      
      clearInterval(progressInterval);
      
      toast({
        title: "Humanization Complete",
        description: `Your text is now ${finalHumanScore}% human-like`,
      });
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
      // Progress animation
      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 8) + 1;
        });
      }, 300);
      
      // Get current human score
      const currentScore = humanScore || 0;
      
      // Try to optimize further
      let optimized: string;
      if (usingRealAI) {
        optimized = await humanizeTextWithGemini(outputText, currentScore);
      } else {
        optimized = humanizeTextLocally(outputText);
      }
      
      // Calculate new score
      let newHumanScore: number;
      if (usingRealAI) {
        const newAiScore = await analyzeAIScore(optimized);
        newHumanScore = 100 - newAiScore;
      } else {
        newHumanScore = 100 - calculateInitialAiScore(optimized);
      }
      
      // Update display
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
                  {/* Left Column - Input */}
                  <HumanizerInput 
                    inputText={inputText}
                    wordCount={wordCount}
                    isProcessing={isProcessing}
                    showAdvancedSettings={showAdvancedSettings}
                    onInputChange={handleInputChange}
                    onSampleText={handleSampleText}
                    onToggleSettings={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    onHumanize={handleHumanize}
                  />
                  
                  {/* Right Column - Output */}
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
            
            {/* Detector Tab Content - Simplified placeholder */}
            <TabsContent value="detector">
              <PlaceholderTab 
                title="AI Detector Feature" 
                description="Analyze text to determine if it was written by AI or a human."
              />
            </TabsContent>
            
            {/* Writer Tab Content - Simplified placeholder */}
            <TabsContent value="writer">
              <PlaceholderTab 
                title="AI Writer Feature" 
                description="Generate high-quality content on any topic."
              />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  );
};

export default HumanizerTool;
