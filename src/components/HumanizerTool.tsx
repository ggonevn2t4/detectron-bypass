
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, Copy, Download, FileText, CheckCircle, AlertCircle, 
  Sparkles, Eye, FileEdit, Zap, Settings, Book, Undo, FileCheck,
  MessageSquare, PenTool, Search, ScrollText, Repeat, ArrowRight
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { humanizeTextWithGemini, analyzeAIScore, detectAIContent, generateAIContent, humanizeTextLocally, calculateInitialAiScore } from '@/services/gemini';

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

  const [writerTopic, setWriterTopic] = useState('');
  const [writerLength, setWriterLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [writerTone, setWriterTone] = useState<'formal' | 'casual' | 'professional'>('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [detectorText, setDetectorText] = useState('');
  const [detectorWordCount, setDetectorWordCount] = useState(0);
  const [detectionResult, setDetectionResult] = useState<{
    score: number;
    analysis: string;
    confidence: 'high' | 'medium' | 'low';
  } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const [iterations, setIterations] = useState(1);
  const [autoRun, setAutoRun] = useState(false);
  const [optimizationStage, setOptimizationStage] = useState(0);
  const [optimizationHistory, setOptimizationHistory] = useState<Array<{score: number, text: string}>>([]);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [humanScoreTarget, setHumanScoreTarget] = useState(95);
  const [humanizationApproach, setHumanizationApproach] = useState<'standard' | 'aggressive' | 'ultra'>('standard');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    updateWordCount(text);
  };

  const handleDetectorTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDetectorText(text);
    updateDetectorWordCount(text);
  };

  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const updateDetectorWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setDetectorWordCount(words);
  };

  const handleSampleText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setInputText(sampleTexts[randomIndex]);
    updateWordCount(sampleTexts[randomIndex]);
  };

  const handleDetectorSample = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setDetectorText(sampleTexts[randomIndex]);
    updateDetectorWordCount(sampleTexts[randomIndex]);
  };

  const calculateInitialScore = (text: string) => {
    return calculateInitialAiScore(text);
  };

  const customHumanizeText = (text: string, approach: 'standard' | 'aggressive' | 'ultra'): string => {
    let result = humanizeTextLocally(text);
    
    // For aggressive mode, run it twice
    if (approach === 'aggressive' || approach === 'ultra') {
      result = humanizeTextLocally(result);
    }
    
    // For ultra mode, do some extra humanization
    if (approach === 'ultra') {
      // Insert some personal opinions
      const opinions = [
        "I think ",
        "In my opinion, ",
        "I feel like ",
        "Not sure about this, but ",
        "From what I've seen, ",
      ];
      
      const sentences = result.split(/(?<=[.!?])\s+/);
      if (sentences.length > 3) {
        const randomIndex = Math.floor(Math.random() * (sentences.length - 2)) + 1;
        const opinion = opinions[Math.floor(Math.random() * opinions.length)];
        sentences[randomIndex] = opinion + sentences[randomIndex].charAt(0).toLowerCase() + sentences[randomIndex].slice(1);
        result = sentences.join(" ");
      }
      
      // Add some self-correction
      if (result.length > 100 && Math.random() < 0.7) {
        const words = result.split(" ");
        if (words.length > 10) {
          const randomIndex = Math.floor(Math.random() * (words.length - 6)) + 3;
          words.splice(randomIndex, 0, "— wait, no —");
          result = words.join(" ");
        }
      }
      
      // Run it through one more time for good measure
      result = humanizeTextLocally(result);
    }
    
    return result;
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
        initialAiScore = calculateInitialScore(inputText);
      }
      setAiDetectionScore(initialAiScore);
      
      // First humanization pass
      let humanized: string;
      if (usingRealAI) {
        humanized = await humanizeTextWithGemini(inputText);
      } else {
        humanized = customHumanizeText(inputText, humanizationApproach);
      }
      
      // Set initial output
      setOutputText(humanized);
      
      // Get human score after first pass
      let finalHumanScore: number;
      if (usingRealAI) {
        const newAiScore = await analyzeAIScore(humanized);
        finalHumanScore = 100 - newAiScore;
      } else {
        finalHumanScore = 100 - calculateInitialScore(humanized);
      }
      
      // Add to history
      setOptimizationHistory([{
        score: finalHumanScore,
        text: humanized
      }]);
      
      setHumanScore(finalHumanScore);
      setProgressValue(100);
      
      clearInterval(progressInterval);
      
      // If we need multiple iterations or autorun is enabled, continue optimizing
      if ((iterations > 1 || autoRun) && finalHumanScore < humanScoreTarget) {
        handleOptimize();
      } else {
        toast({
          title: "Humanization Complete",
          description: `Your text is now ${finalHumanScore}% human-like`,
        });
      }
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
      
      // Increase optimization stage
      setOptimizationStage(prev => prev + 1);
      
      // Get current human score
      const currentScore = humanScore || 0;
      
      // Try to optimize further
      let optimized: string;
      if (usingRealAI) {
        optimized = await humanizeTextWithGemini(outputText, currentScore);
      } else {
        optimized = customHumanizeText(outputText, 'ultra');
      }
      
      // Calculate new score
      let newHumanScore: number;
      if (usingRealAI) {
        const newAiScore = await analyzeAIScore(optimized);
        newHumanScore = 100 - newAiScore;
      } else {
        newHumanScore = 100 - calculateInitialScore(optimized);
      }
      
      // Add to history
      setOptimizationHistory(prev => [...prev, {
        score: newHumanScore,
        text: optimized
      }]);
      
      // Update display
      setOutputText(optimized);
      setHumanScore(newHumanScore);
      setProgressValue(100);
      
      clearInterval(progressInterval);
      
      // Check if we should continue optimizing
      const reachedTarget = newHumanScore >= humanScoreTarget;
      const reachedMaxIterations = optimizationStage >= iterations - 1;
      const improved = newHumanScore > currentScore + 2; // Only continue if we improved by at least 2%
      
      if (autoRun && !reachedTarget && !reachedMaxIterations && improved) {
        // Wait a moment before next iteration
        setTimeout(() => {
          handleOptimize();
        }, 1000);
      } else {
        const message = reachedTarget 
          ? `Target achieved! Your text is now ${newHumanScore}% human-like`
          : !improved 
            ? `Optimization plateau reached at ${newHumanScore}% human-like`
            : `Optimization complete: ${newHumanScore}% human-like`;
            
        toast({
          title: "Optimization Complete",
          description: message,
        });
      }
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
  
  const handleUndoOptimization = () => {
    if (optimizationHistory.length <= 1) {
      return;
    }
    
    // Remove the last item from history
    const newHistory = [...optimizationHistory];
    newHistory.pop();
    
    // Get the previous state
    const previousState = newHistory[newHistory.length - 1];
    
    // Update display
    setOutputText(previousState.text);
    setHumanScore(previousState.score);
    setOptimizationHistory(newHistory);
    setOptimizationStage(prev => prev - 1);
    
    toast({
      title: "Undo Complete",
      description: `Reverted to previous version (${previousState.score}% human-like)`,
    });
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
  
  // Add missing handleDetect function
  const handleDetect = async () => {
    if (!detectorText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }
    
    setIsDetecting(true);
    setProgressValue(0);
    
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
      }, 200);
      
      // Analyze the text
      let result;
      if (usingRealAI) {
        result = await detectAIContent(detectorText);
      } else {
        const aiScore = calculateInitialAiScore(detectorText);
        const confidence = aiScore > 75 ? 'high' : aiScore > 40 ? 'medium' : 'low';
        result = {
          score: aiScore,
          analysis: aiScore > 75 
            ? 'The text shows strong patterns of AI generation.'
            : aiScore > 40
            ? 'The text shows some patterns that may indicate AI generation.'
            : 'The text appears to be primarily human-written.',
          confidence: confidence as 'high' | 'medium' | 'low'
        };
      }
      
      setDetectionResult(result);
      setProgressValue(100);
      
      clearInterval(progressInterval);
    } catch (error) {
      console.error("Error in detection process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDetecting(false);
    }
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
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
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
                    <FileText className="mr-2 h-4 w-4" />
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">AI-Generated Text</h3>
                      <div className="flex items-center space-x-2">
                        {aiDetectionScore !== null && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive">
                            {aiDetectionScore}% AI
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">{wordCount} words</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Textarea 
                        placeholder="Paste your AI-generated content here..."
                        className="min-h-[300px] resize-none p-4 text-base"
                        value={inputText}
                        onChange={handleInputChange}
                      />
                      {inputText && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute bottom-3 right-3 h-8 px-2 text-xs"
                          onClick={() => setInputText('')}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    
                    {/* Advanced Settings */}
                    <div className="mt-4">
                      <div 
                        className="flex items-center mb-2 cursor-pointer"
                        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Advanced Settings</span>
                        <ArrowRight className={`ml-2 h-3 w-3 transition-transform ${showAdvancedSettings ? 'rotate-90' : ''}`} />
                      </div>
                      
                      {showAdvancedSettings && (
                        <div className="bg-muted/30 p-3 rounded-md mb-3 grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="target" className="text-xs">Human Score Target</Label>
                              <Select 
                                value={humanScoreTarget.toString()}
                                onValueChange={(v) => setHumanScoreTarget(parseInt(v))}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Target Score" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="90">90% Human</SelectItem>
                                  <SelectItem value="95">95% Human</SelectItem>
                                  <SelectItem value="97">97% Human</SelectItem>
                                  <SelectItem value="99">99% Human</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="approach" className="text-xs">Humanization Level</Label>
                              <Select 
                                value={humanizationApproach}
                                onValueChange={(v) => setHumanizationApproach(v as any)}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Approach" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="aggressive">Aggressive</SelectItem>
                                  <SelectItem value="ultra">Ultra-Human</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="iterations" className="text-xs">Max Iterations</Label>
                              <div className="flex items-center gap-2">
                                <Input 
                                  id="iterations"
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={iterations}
                                  onChange={(e) => setIterations(parseInt(e.target.value))}
                                  className="h-8 text-xs"
                                />
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id="autorun"
                                    checked={autoRun}
                                    onChange={() => setAutoRun(!autoRun)}
                                    className="mr-2"
                                  />
                                  <Label htmlFor="autorun" className="text-xs">Auto-run</Label>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-end">
                              {optimizationHistory.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={handleUndoOptimization}
                                >
                                  <Undo className="mr-1 h-3 w-3" />
                                  Undo Last Pass
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button
                        onClick={handleHumanize}
                        disabled={!inputText.trim() || isProcessing}
                        className="bg-primary hover:bg-primary/90"
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
                      <div className="flex gap-2">
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
                              <AlertCircle className="mr-2 h-3 w-3" />
                              Tips
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 text-sm">
                            <div className="space-y-2">
                              <h4 className="font-medium">Tips for best results:</h4>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Use text with at least 50 words for better results</li>
                                <li>{usingRealAI ? 'Advanced mode works best with English text' : 'The demo works best with formal, academic text'}</li>
                                <li>For extremely human scores, run multiple iterations</li>
                                <li>Ultra-Human mode adds more natural language patterns</li>
                                <li>Smaller chunks of text (200-500 words) work best</li>
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">Humanized Result</h3>
                      <div className="flex items-center gap-2">
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
                        
                        {optimizationStage > 0 && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Pass {optimizationStage + 1}/{iterations}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {isProcessing && (
                      <div className="mb-4">
                        <Progress value={progressValue} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {progressValue === 100 
                            ? 'Processing complete...' 
                            : optimizationStage > 0 
                              ? `Optimization pass ${optimizationStage + 1}...` 
                              : 'Processing text...'}
                        </p>
                      </div>
                    )}
                    
                    <div className="relative">
                      <Textarea 
                        placeholder="Your humanized content will appear here..."
                        className="min-h-[300px] resize-none p-4 text-base"
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
                    
                    <div className="mt-4 flex justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-primary/20 text-foreground hover:border-primary/40 hover:bg-primary/5"
                          disabled={!outputText}
                          onClick={() => handleDownload(outputText, 'humanized-text.txt')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                        
                        {outputText && humanScore !== null && humanScore < 95 && (
                          <Button
                            variant="default"
                            className="bg-primary hover:bg-primary/90"
                            onClick={handleOptimize}
                            disabled={isProcessing}
                          >
                            <Repeat className="mr-2 h-4 w-4" />
                            Optimize More
                          </Button>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground flex items-center">
                        {humanScore !== null && humanScore >= 95 ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {humanScore >= 99 ? 'Ultra-human result achieved!' : 'High human score achieved!'}
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {optimizationStage > 0 ? 'Try another optimization pass' : 'Click Optimize for a higher score'}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="detector" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">Text to Analyze</h3>
                      <span className="text-sm text-muted-foreground">{detectorWordCount} words</span>
                    </div>
                    <div className="relative">
                      <Textarea 
                        placeholder="Paste the text you want to analyze for AI detection..."
                        className="min-h-[300px] resize-none p-4 text-base"
                        value={detectorText}
                        onChange={handleDetectorTextChange}
                      />
                      {detectorText && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute bottom-3 right-3 h-8 px-2 text-xs"
                          onClick={() => setDetectorText('')}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button
                        onClick={handleDetect}
                        disabled={!detectorText.trim() || isDetecting}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isDetecting ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Detect AI Content
                          </>
                        )}
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={handleDetectorSample}
                        >
                          <FileText className="mr-2 h-3 w-3" />
                          Sample Text
                        </Button>
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs">
                              <AlertCircle className="mr-2 h-3 w-3" />
                              Tips
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 text-sm">
                            <div className="space-y-2">
                              <h4 className="font-medium">Tips for best analysis:</h4>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Use at least 100 words for more accurate detection</li>
                                <li>Results are most accurate for English text</li>
                                <li>The tool works best on complete paragraphs rather than fragments</li>
                                <li>No detection method is 100% accurate</li>
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">Analysis Results</h3>
                      {detectionResult && (
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                          detectionResult.score > 75 
                            ? 'bg-destructive/10 text-destructive' 
                            : detectionResult.score > 40
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-green-500/10 text-green-600'
                        }`}>
                          {detectionResult.score > 75 ? (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              High AI probability
                            </>
                          ) : detectionResult.score > 40 ? (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Medium AI probability
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Likely human-written
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {isDetecting && (
                      <div className="mb-4">
                        <Progress value={progressValue} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {progressValue === 100 ? 'Analysis complete...' : 'Analyzing text...'}
                        </p>
                      </div>
                    )}
                    
                    {detectionResult ? (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex justify-between items-center">
                              AI Detection Score
                              <Badge 
                                className={`text-lg font-bold ${
                                  detectionResult.score > 75 
                                    ? 'bg-destructive text-destructive-foreground' 
                                    : detectionResult.score > 40
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-green-500 text-white'
                                }`}
                              >
                                {detectionResult.score}%
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {detectionResult.score > 75 
                                ? 'This text is highly likely to be AI-generated' 
                                : detectionResult.score > 40
                                ? 'This text shows some AI-like patterns'
                                : 'This text appears to be human-written'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  detectionResult.score > 75
                                    ? 'bg-destructive'
                                    : detectionResult.score > 40
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${detectionResult.score}%` }}
                              />
                            </div>
                            
                            <div className="mt-4 p-3 bg-muted/30 rounded-md text-sm">
                              <h4 className="font-medium mb-2">Analysis:</h4>
                              <p>{detectionResult.analysis}</p>
                              
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Confidence</span>
                                  <Badge variant={
                                    detectionResult.confidence === 'high' 
                                      ? 'default' 
                                      : detectionResult.confidence === 'medium'
                                      ? 'outline'
                                      : 'secondary'
                                  }>
                                    {detectionResult.confidence}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => handleCopy(detectorText)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Text
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="border-primary/20 text-foreground hover:border-primary/40 hover:bg-primary/5"
                            onClick={() => {
                              setInputText(detectorText);
                              updateWordCount(detectorText);
                              setCurrentTab('humanizer');
                            }}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Humanize This Text
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-border rounded-md p-6">
                        <Eye className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h4 className="text-lg font-medium mb-2">No Analysis Yet</h4>
                        <p className="text-center text-muted-foreground mb-4">
                          Enter text on the left and click "Detect AI Content" to analyze the text for AI patterns.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="writer" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">Generate AI Content</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="topic" className="mb-2 block">Topic or Prompt</Label>
                        <Textarea 
                          id="topic"
                          placeholder="Describe what you want to write about..."
                          className="resize-none min-h-[100px]"
                          value={writerTopic}
                          onChange={(e) => setWriterTopic(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="length" className="mb-2 block">Length</Label>
                          <Select
                            value={writerLength}
                            onValueChange={(v) => setWriterLength(v as any)}
                          >
                            <SelectTrigger id="length">
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short (~100 words)</SelectItem>
                              <SelectItem value="medium">Medium (~250 words)</SelectItem>
                              <SelectItem value="long">Long (~500 words)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="tone" className="mb-2 block">Tone</Label>
                          <Select
                            value={writerTone}
                            onValueChange={(v) => setWriterTone(v as any)}
                          >
                            <SelectTrigger id="tone">
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="formal">Formal</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={!writerTopic.trim() || isGenerating}
                        onClick={() => {
                          setIsGenerating(true);
                          setProgressValue(0);
                          
                          // Progress animation
                          const progressInterval = setInterval(() => {
                            setProgressValue(prev => {
                              if (prev >= 95) {
                                clearInterval(progressInterval);
                                return 95;
                              }
                              return prev + Math.floor(Math.random() * 5) + 1;
                            });
                          }, 300);
                          
                          // Generate content
                          generateAIContent(writerTopic, writerLength, writerTone)
                            .then(content => {
                              setGeneratedContent(content);
                              clearInterval(progressInterval);
                              setProgressValue(100);
                              
                              toast({
                                title: "Content Generated",
                                description: "AI content has been generated successfully",
                              });
                            })
                            .catch(error => {
                              console.error("Error generating content:", error);
                              toast({
                                title: "Error",
                                description: error instanceof Error ? error.message : "An unexpected error occurred",
                                variant: "destructive",
                              });
                            })
                            .finally(() => {
                              setIsGenerating(false);
                            });
                        }}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Generate Content
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">Generated Content</h3>
                    </div>
                    
                    {isGenerating && (
                      <div className="mb-4">
                        <Progress value={progressValue} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {progressValue < 30 
                            ? 'Analyzing topic...' 
                            : progressValue < 60
                            ? 'Crafting content...'
                            : progressValue < 95
                            ? 'Refining output...'
                            : 'Finalizing content...'}
                        </p>
                      </div>
                    )}
                    
                    <div className="relative">
                      <Textarea 
                        placeholder="Generated content will appear here..."
                        className="min-h-[300px] resize-none p-4 text-base"
                        value={generatedContent}
                        readOnly
                      />
                      {generatedContent && (
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleCopy(generatedContent)}
                          >
                            <Copy className="mr-1 h-3 w-3" />
                            Copy
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {generatedContent && (
                      <div className="mt-4 flex justify-between">
                        <Button
                          variant="outline"
                          className="border-primary/20 text-foreground hover:border-primary/40 hover:bg-primary/5"
                          onClick={() => handleDownload(generatedContent, 'ai-content.txt')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                        
                        <Button
                          variant="default"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => {
                            setInputText(generatedContent);
                            updateWordCount(generatedContent);
                            setCurrentTab('humanizer');
                            
                            toast({
                              title: "Content Transferred",
                              description: "You can now humanize the generated content",
                            });
                          }}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Humanize This
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default HumanizerTool;
