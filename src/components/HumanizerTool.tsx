
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, Copy, Download, FileText, CheckCircle, AlertCircle, 
  Sparkles, Eye, FileEdit, Zap, Settings, Book, Undo, FileCheck,
  MessageSquare, PenTool, Search, ScrollText
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
import { humanizeTextWithGemini, analyzeAIScore, detectAIContent, generateAIContent } from '@/services/gemini';

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

  const calculateInitialAiScore = (text: string) => {
    const patternScores = [
      text.match(/(\b\w+\b)(?:\s+\w+\s+)(\1\b)/g)?.length || 0,
      (text.match(/[.!?]\s+[A-Z]/g)?.length || 0) / (text.match(/[.!?]/g)?.length || 1),
      (text.match(/[^.!?]+[.!?]/g) || []).filter(s => s.length > 150).length,
      (text.match(/\b(therefore|however|consequently|furthermore|moreover)\b/gi)?.length || 0),
      (text.match(/\b(cannot|will not|do not|does not|is not)\b/gi)?.length || 0),
    ];
    
    const baseScore = Math.min(
      85,
      patternScores.reduce((sum, score) => sum + score, 0) * 5 + 
      Math.random() * 15
    );
    
    return Math.min(Math.floor(baseScore), 99);
  };

  const humanizeText = (text: string) => {
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const humanizedSentences = sentences.map(sentence => {
      let humanized = sentence;
      
      humanized = humanized
        .replace(/\b(cannot)\b/gi, "can't")
        .replace(/\b(will not)\b/gi, "won't")
        .replace(/\b(do not)\b/gi, "don't")
        .replace(/\b(does not)\b/gi, "doesn't")
        .replace(/\b(is not)\b/gi, "isn't")
        .replace(/\b(are not)\b/gi, "aren't")
        .replace(/\b(would not)\b/gi, "wouldn't")
        .replace(/\b(could not)\b/gi, "couldn't")
        .replace(/\b(should not)\b/gi, "shouldn't");
      
      const rand = Math.random();
      if (rand < 0.2 && humanized.length > 15) {
        const midpoint = Math.floor(humanized.length / 2);
        const insertPoint = Math.floor(midpoint - 8 + Math.random() * 16);
        humanized = humanized.slice(0, insertPoint) + ", " + humanized.slice(insertPoint);
      } else if (rand < 0.35 && humanized.length > 40) {
        const midpoint = Math.floor(humanized.length / 2);
        const breakRange = Math.floor(midpoint / 2);
        const breakPoint = midpoint - breakRange + Math.floor(Math.random() * (breakRange * 2));
        
        let actualBreakPoint = humanized.indexOf(' ', breakPoint);
        if (actualBreakPoint === -1) actualBreakPoint = breakPoint;
        
        const firstPart = humanized.slice(0, actualBreakPoint);
        const secondPart = humanized.slice(actualBreakPoint + 1);
        
        humanized = firstPart + ". " + 
                   secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
      }
      
      humanized = humanized
        .replace(/\b(utilize)\b/gi, "use")
        .replace(/\b(therefore)\b/gi, "so")
        .replace(/\b(subsequently)\b/gi, "then")
        .replace(/\b(nevertheless)\b/gi, "still")
        .replace(/\b(commence)\b/gi, "start")
        .replace(/\b(terminate)\b/gi, "end")
        .replace(/\b(attempt)\b/gi, "try")
        .replace(/\b(however)\b/gi, () => Math.random() > 0.5 ? "but" : "though")
        .replace(/\b(approximately)\b/gi, "about")
        .replace(/\b(sufficient)\b/gi, "enough");
      
      if (Math.random() < 0.3) {
        const fillers = ["actually", "basically", "honestly", "I mean", "you know", "kind of", "pretty much"];
        const filler = fillers[Math.floor(Math.random() * fillers.length)];
        
        if (Math.random() < 0.5 && humanized.length > 10) {
          humanized = filler + ", " + humanized.charAt(0).toLowerCase() + humanized.slice(1);
        } else {
          const insertPoint = Math.floor(humanized.length / 3 + Math.random() * (humanized.length / 3));
          humanized = humanized.slice(0, insertPoint) + " " + filler + " " + humanized.slice(insertPoint);
        }
      }
      
      return humanized;
    });
    
    return humanizedSentences.join(" ").replace(/\s{2,}/g, " ");
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
        humanized = await humanizeTextWithGemini(inputText);
      } else {
        humanized = humanizeText(inputText);
      }
      
      let finalHumanScore: number;
      if (usingRealAI) {
        const newAiScore = await analyzeAIScore(humanized);
        finalHumanScore = 100 - newAiScore;
      } else {
        finalHumanScore = 100 - calculateInitialAiScore(humanized);
      }
      
      setOutputText(humanized);
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

  const handleDetect = async () => {
    if (!detectorText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }
    
    if (detectorWordCount < 50) {
      toast({
        title: "Text Too Short",
        description: "Please enter at least 50 words for accurate analysis",
        // Change from "warning" to "default" variant
        variant: "default",
      });
    }
    
    setIsDetecting(true);
    setProgressValue(0);
    
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
      
      let result;
      if (usingRealAI) {
        result = await detectAIContent(detectorText);
      } else {
        const demoScore = calculateInitialAiScore(detectorText);
        result = {
          score: demoScore,
          confidence: demoScore > 80 ? 'high' : demoScore > 50 ? 'medium' : 'low',
          analysis: `This text appears to be ${demoScore > 70 ? 'likely AI-generated' : 'possibly human-written'}. ${
            demoScore > 70 
              ? 'It shows patterns typical of AI writing such as formal language and predictable sentence structure.' 
              : 'It has some variety in sentence structure and tone, though some phrases suggest possible AI influence.'
          }`
        } as const;
      }
      
      setDetectionResult(result);
      setProgressValue(100);
      
      clearInterval(progressInterval);
      
      toast({
        title: "Analysis Complete",
        description: `Your text is ${result.score}% likely to be detected as AI-generated`,
      });
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

  const handleGenerateContent = async () => {
    if (!writerTopic.trim()) {
      toast({
        title: "Empty Topic",
        description: "Please enter a topic to generate content about",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setProgressValue(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 500);

      let content;
      if (usingRealAI) {
        content = await generateAIContent(writerTopic, writerLength, writerTone);
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        content = `# ${writerTopic.toUpperCase()}\n\nThis is a sample ${writerLength} article about ${writerTopic} written in a ${writerTone} tone. In demo mode, we generate placeholder content to demonstrate the interface without using the actual AI service.\n\nThe real functionality will generate informative articles about your selected topic with proper structure, factual information, and the appropriate tone you've selected. It's perfect for creating first drafts that you can then customize further.\n\nTry the advanced mode for actual AI-generated content based on your specific requirements!`;
      }
      
      setGeneratedContent(content);
      setProgressValue(100);
      
      clearInterval(progressInterval);
      
      toast({
        title: "Content Generated",
        description: `Your ${writerLength} article has been created successfully`,
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
                                <li>Check the output for any factual changes</li>
                                <li>For higher human scores, run the text through multiple times</li>
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
                      {humanScore !== null && (
                        <div className="flex items-center bg-green-500/10 text-green-600 px-2 py-1 rounded-full text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {humanScore}% Human Score
                        </div>
                      )}
                    </div>
                    {isProcessing && (
                      <div className="mb-4">
                        <Progress value={progressValue} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {progressValue === 100 ? 'Processing complete...' : 'Processing text...'}
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
                      <Button
                        variant="outline"
                        className="border-primary/20 text-foreground hover:border-primary/40 hover:bg-primary/5"
                        disabled={!outputText}
                        onClick={() => handleDownload(outputText, 'humanized-text.txt')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {usingRealAI ? 'Using enhanced AI technology' : 'AI detection avoidance not guaranteed'}
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
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                              <span>Human</span>
                              <span>AI</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Analysis Details
                              <Badge className="ml-2">{detectionResult.confidence} confidence</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              {detectionResult.analysis}
                            </p>
                          </CardContent>
                        </Card>
                        
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCurrentTab('humanizer');
                              setInputText(detectorText);
                              updateWordCount(detectorText);
                            }}
                            className="text-sm"
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Humanize This Text
                          </Button>
                          
                          <div className="text-xs text-muted-foreground flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            No AI detection is 100% accurate
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[300px] bg-muted/20 border border-border rounded-md flex items-center justify-center flex-col p-6 space-y-3">
                        <Eye className="h-12 w-12 text-muted" />
                        <h3 className="text-xl font-medium">AI Content Detector</h3>
                        <p className="text-center text-muted-foreground max-w-md">
                          Paste your text and click "Detect AI Content" to analyze if it was written by AI or a human.
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
                    <div className="mb-2">
                      <h3 className="text-lg font-medium">Content Generator</h3>
                      <p className="text-sm text-muted-foreground">
                        Generate AI content that you can then humanize for essays, blog posts, or articles
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="topic">Topic or Title</Label>
                        <Input 
                          id="topic" 
                          value={writerTopic} 
                          onChange={(e) => setWriterTopic(e.target.value)}
                          placeholder="Enter a topic or title for your content"
                          className="mt-1.5"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="length">Content Length</Label>
                          <Select 
                            value={writerLength} 
                            onValueChange={(value) => setWriterLength(value as 'short' | 'medium' | 'long')}
                          >
                            <SelectTrigger id="length" className="mt-1.5">
                              <SelectValue placeholder="Select Length" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short (200-300 words)</SelectItem>
                              <SelectItem value="medium">Medium (400-600 words)</SelectItem>
                              <SelectItem value="long">Long (800-1200 words)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="tone">Writing Tone</Label>
                          <Select 
                            value={writerTone} 
                            onValueChange={(value) => setWriterTone(value as 'formal' | 'casual' | 'professional')}
                          >
                            <SelectTrigger id="tone" className="mt-1.5">
                              <SelectValue placeholder="Select Tone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="formal">Formal</SelectItem>
                              <SelectItem value="casual">Conversational</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          onClick={handleGenerateContent}
                          disabled={!writerTopic.trim() || isGenerating}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <PenTool className="mr-2 h-4 w-4" />
                              Generate Content
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Settings className="mr-2 h-3 w-3" />
                              Advanced Options
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm">Coming Soon</h4>
                              <p className="text-xs text-muted-foreground">
                                Future updates will include options for:
                              </p>
                              <ul className="text-xs text-muted-foreground space-y-2">
                                <li className="flex items-center">
                                  <Book className="h-3 w-3 mr-2" />
                                  Citation formats (APA, MLA, Chicago)
                                </li>
                                <li className="flex items-center">
                                  <Search className="h-3 w-3 mr-2" />
                                  Specific research sources
                                </li>
                                <li className="flex items-center">
                                  <ScrollText className="h-3 w-3 mr-2" />
                                  Content templates and outlines
                                </li>
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">Generated Content</h3>
                      {generatedContent && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {writerLength === "short" ? "Short" : writerLength === "medium" ? "Medium" : "Long"} • {writerTone}
                        </Badge>
                      )}
                    </div>
                    
                    {isGenerating && (
                      <div className="mb-4">
                        <Progress value={progressValue} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {progressValue === 100 ? 'Generation complete...' : `Creating ${writerLength} content...`}
                        </p>
                      </div>
                    )}
                    
                    <div className="relative">
                      <Textarea 
                        placeholder="Your generated content will appear here..."
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
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                            onClick={() => handleDownload(generatedContent, `${writerTopic.toLowerCase().replace(/\s+/g, '-')}.txt`)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                          
                          <Button
                            variant="default"
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => {
                              setCurrentTab('humanizer');
                              setInputText(generatedContent);
                              updateWordCount(generatedContent);
                            }}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Humanize
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground flex items-center">
                          <FileCheck className="h-3 w-3 mr-1" />
                          Always verify facts and review content
                        </div>
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
