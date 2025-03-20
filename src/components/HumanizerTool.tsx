
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Copy, Download, FileText, CheckCircle, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Sample AI text for demonstration purposes
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

  const handleHumanize = () => {
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
    
    // Simulate processing with progress updates
    const totalSteps = 5;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      setProgressValue(Math.floor((currentStep / totalSteps) * 100));
      
      if (currentStep >= totalSteps) {
        clearInterval(progressInterval);
        const humanized = humanizeText(inputText);
        setOutputText(humanized);
        
        // Calculate scores
        const initialAiScore = calculateInitialAiScore(inputText);
        const finalHumanScore = 100 - calculateInitialAiScore(humanized);
        
        setAiDetectionScore(initialAiScore);
        setHumanScore(finalHumanScore);
        
        setIsProcessing(false);
        
        toast({
          title: "Humanization Complete",
          description: `Your text is now ${finalHumanScore}% human-like`,
        });
      }
    }, 500);
  };

  const calculateInitialAiScore = (text: string) => {
    // This is a simplified simulation of AI detection
    // A real implementation would use NLP techniques
    
    // Check for patterns common in AI text
    const patternScores = [
      // Repetitive phrases
      text.match(/(?:\b\w+\b)(?:\s+\w+\s+)(?:\1\b)/g)?.length || 0,
      
      // Perfect grammar and punctuation
      (text.match(/[.!?]\s+[A-Z]/g)?.length || 0) / (text.match(/[.!?]/g)?.length || 1),
      
      // Long, complex sentences
      (text.match(/[^.!?]+[.!?]/g) || []).filter(s => s.length > 150).length,
      
      // Formal language patterns
      (text.match(/\b(therefore|however|consequently|furthermore|moreover)\b/gi)?.length || 0),
      
      // Lack of contractions
      (text.match(/\b(cannot|will not|do not|does not|is not)\b/gi)?.length || 0),
    ];
    
    // Calculate a weighted score (0-100)
    const baseScore = Math.min(
      85,
      patternScores.reduce((sum, score) => sum + score, 0) * 5 + 
      Math.random() * 15 // Add some randomness to seem more realistic
    );
    
    return Math.min(Math.floor(baseScore), 99);
  };

  const humanizeText = (text: string) => {
    // Break text into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const humanizedSentences = sentences.map(sentence => {
      // Apply various humanization techniques
      let humanized = sentence;
      
      // 1. Add contractions
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
      
      // 2. Add variety to sentence structure
      const rand = Math.random();
      if (rand < 0.2 && humanized.length > 15) {
        // Add a comma somewhere in the middle
        const midpoint = Math.floor(humanized.length / 2);
        const insertPoint = Math.floor(midpoint - 8 + Math.random() * 16);
        humanized = humanized.slice(0, insertPoint) + ", " + humanized.slice(insertPoint);
      } else if (rand < 0.35 && humanized.length > 40) {
        // Break into two sentences occasionally
        const midpoint = Math.floor(humanized.length / 2);
        const breakRange = Math.floor(midpoint / 2);
        const breakPoint = midpoint - breakRange + Math.floor(Math.random() * (breakRange * 2));
        
        // Find a good spot to break (after a word)
        let actualBreakPoint = humanized.indexOf(' ', breakPoint);
        if (actualBreakPoint === -1) actualBreakPoint = breakPoint;
        
        // Capitalize the first letter after the break
        const secondPart = humanized.slice(actualBreakPoint).trim();
        if (secondPart) {
          humanized = humanized.slice(0, actualBreakPoint) + ". " + 
                     secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
        }
      }
      
      // 3. Replace formal words with more conversational alternatives
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
      
      // 4. Add filler words occasionally
      if (Math.random() < 0.3) {
        const fillers = ["actually", "basically", "honestly", "I mean", "you know", "kind of", "pretty much"];
        const filler = fillers[Math.floor(Math.random() * fillers.length)];
        
        // Add at beginning or middle
        if (Math.random() < 0.5 && humanized.length > 10) {
          humanized = filler + ", " + humanized.charAt(0).toLowerCase() + humanized.slice(1);
        } else {
          const insertPoint = Math.floor(humanized.length / 3 + Math.random() * (humanized.length / 3));
          humanized = humanized.slice(0, insertPoint) + " " + filler + " " + humanized.slice(insertPoint);
        }
      }
      
      return humanized;
    });
    
    // Join sentences, ensuring proper spacing
    return humanizedSentences.join(" ").replace(/\s{2,}/g, " ");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The humanized text has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    if (!outputText) return;
    
    const element = document.createElement('a');
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'humanized-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download complete",
      description: "Your humanized text has been downloaded as a text file",
    });
  };

  // Effect to reset scores when input changes
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
              <div className="px-6">
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
                                <li>The humanizer works best with formal, academic text</li>
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
                            onClick={handleCopy}
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
                        onClick={handleDownload}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        AI detection avoidance not guaranteed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="detector" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="p-6">
                <div className="bg-primary/5 rounded-lg p-8 text-center">
                  <Eye className="h-16 w-16 mx-auto mb-6 text-primary/60" />
                  <h3 className="text-xl font-medium mb-3">AI Detector</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Check if your content will be flagged by AI detection tools like Turnitin, GPTZero, and others.
                  </p>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setCurrentTab('humanizer')}
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Try Humanizer First
                  </Button>
                  <p className="mt-6 text-sm text-muted-foreground">
                    Coming soon: Upload a document to scan for AI content
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="writer" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="p-6">
                <div className="bg-primary/5 rounded-lg p-8 text-center">
                  <FileText className="h-16 w-16 mx-auto mb-6 text-primary/60" />
                  <h3 className="text-xl font-medium mb-3">AI Writer</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Generate human-like content with custom citations and references. Perfect for academic writing.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90">
                    Coming Soon
                  </Button>
                  <p className="mt-6 text-sm text-muted-foreground">
                    Join our waitlist to get early access to our AI Writer feature
                  </p>
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
