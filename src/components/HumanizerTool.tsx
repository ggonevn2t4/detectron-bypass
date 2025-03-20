
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, Download, FileText, InfoIcon, 
  Sparkles, Eye, FileEdit, RefreshCw, Copy, CheckCircle, AlertCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  humanizeTextWithGemini, analyzeAIScore, detectAIContent, 
  generateAIContent, humanizeTextLocally, calculateInitialAiScore 
} from '@/services/gemini';
import { Container } from '@/components/ui/container';

const sampleTexts = [
  `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.`,
  
  `The global climate crisis represents one of the most significant challenges facing humanity today. Rising temperatures, extreme weather events, and sea level rise are all consequences of human-induced climate change. Immediate action is required to mitigate these effects and transition to a sustainable future.`,
  
  `Recent advances in quantum computing have revolutionized the field of computational science. Quantum computers leverage quantum mechanical phenomena to perform calculations at speeds unattainable by classical computers. This technology holds promise for solving complex problems in cryptography, material science, and drug discovery.`
];

const HumanizerTool = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [aiDetectionScore, setAiDetectionScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
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
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
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
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={usingRealAI ? "default" : "outline"} 
                    className="cursor-pointer" 
                    onClick={() => setUsingRealAI(true)}
                  >
                    Advanced Mode
                  </Badge>
                  <Badge 
                    variant={!usingRealAI ? "default" : "outline"} 
                    className="cursor-pointer" 
                    onClick={() => setUsingRealAI(false)}
                  >
                    Demo Mode
                  </Badge>
                </div>
              </div>
            </div>
            
            <TabsContent value="humanizer" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">AI-Generated Text</h3>
                      <span className="text-sm text-muted-foreground">{wordCount} words</span>
                    </div>
                    <div className="relative">
                      <Textarea 
                        placeholder="Paste your AI-generated content here..."
                        className="min-h-[280px] resize-none p-4 text-base border-border/60"
                        value={inputText}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex items-center mt-4 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={handleSampleText}
                      >
                        <FileText className="mr-2 h-3 w-3" />
                        Sample Text
                      </Button>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs">
                            <InfoIcon className="mr-2 h-3 w-3" />
                            Tips
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 text-sm">
                          <div className="space-y-2">
                            <h4 className="font-medium">Tips for best results:</h4>
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Use text with at least 50 words for better results</li>
                              <li>For extremely human scores, run multiple iterations</li>
                              <li>Smaller chunks of text (200-500 words) work best</li>
                            </ul>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex items-center ml-auto">
                        <button
                          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Advanced Settings
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        onClick={handleHumanize}
                        disabled={!inputText.trim() || isProcessing}
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Humanizing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Humanize Text
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Right Column - Output */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">Humanized Result</h3>
                      {humanScore !== null && (
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                          humanScore >= 95 
                            ? 'bg-green-500/20 text-green-600' 
                            : humanScore >= 90
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {humanScore >= 95 ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {humanScore}% Human
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {humanScore}% Human
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {isProcessing && (
                      <div className="mb-3">
                        <Progress value={progressValue} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          {progressValue < 30 
                            ? 'Analyzing text...' 
                            : progressValue < 60
                            ? 'Applying humanization...'
                            : progressValue < 95
                            ? 'Finalizing changes...'
                            : 'Complete!'}
                        </p>
                      </div>
                    )}
                    
                    <div className="relative">
                      <Textarea 
                        placeholder="Your humanized content will appear here..."
                        className="min-h-[280px] resize-none p-4 text-base border-border/60 bg-muted/10"
                        value={outputText}
                        readOnly
                      />
                      {outputText && (
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleCopy(outputText)}
                          >
                            {copied ? (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="mr-1 h-3 w-3" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex">
                      <Button
                        variant="outline"
                        className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5"
                        disabled={!outputText}
                        onClick={() => handleDownload(outputText, 'humanized-text.txt')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      
                      {outputText && (
                        <Button
                          variant="ghost"
                          className="ml-auto text-muted-foreground hover:text-foreground"
                          onClick={handleOptimize}
                        >
                          Click Optimize for a higher score
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Detector Tab Content - Simplified placeholder */}
            <TabsContent value="detector" className="p-6 text-center text-muted-foreground">
              <div className="py-16">
                <h3 className="text-xl mb-4">AI Detector Feature</h3>
                <p>Analyze text to determine if it was written by AI or a human.</p>
                <p className="mt-2">Switch to this tab to use the AI detection features.</p>
              </div>
            </TabsContent>
            
            {/* Writer Tab Content - Simplified placeholder */}
            <TabsContent value="writer" className="p-6 text-center text-muted-foreground">
              <div className="py-16">
                <h3 className="text-xl mb-4">AI Writer Feature</h3>
                <p>Generate high-quality content on any topic.</p>
                <p className="mt-2">Switch to this tab to use the AI writing features.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  );
};

export default HumanizerTool;
