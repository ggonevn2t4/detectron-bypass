
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Copy, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const HumanizerTool = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleHumanize = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // This is where the actual humanization would happen
      // For now, just create a more "human-like" version by adding variety
      const humanized = simulateHumanization(inputText);
      setOutputText(humanized);
      setHumanScore(Math.floor(Math.random() * 15) + 85); // Random score between 85-99
      setIsProcessing(false);
    }, 2000);
  };

  const simulateHumanization = (text: string) => {
    // This is just a simple simulation
    // A real implementation would use NLP and advanced techniques
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const humanizedSentences = sentences.map(sentence => {
      // Add some variety in sentence structure
      const rand = Math.random();
      if (rand < 0.3 && sentence.length > 10) {
        // Add a comma somewhere in the middle
        const midpoint = Math.floor(sentence.length / 2);
        const insertPoint = Math.floor(midpoint - 5 + Math.random() * 10);
        return sentence.slice(0, insertPoint) + ", " + sentence.slice(insertPoint);
      } else if (rand < 0.5) {
        // Replace some common words
        return sentence
          .replace(/very/g, "extremely")
          .replace(/good/g, "excellent")
          .replace(/bad/g, "poor")
          .replace(/important/g, "crucial");
      } else {
        return sentence;
      }
    });
    
    return humanizedSentences.join(" ");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <Tabs defaultValue="humanizer" className="w-full">
            <div className="border-b border-border">
              <div className="px-6">
                <TabsList className="bg-transparent h-16">
                  <TabsTrigger value="humanizer" className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg mr-2">
                    AI Humanizer
                  </TabsTrigger>
                  <TabsTrigger value="detector" className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg mr-2">
                    AI Detector
                  </TabsTrigger>
                  <TabsTrigger value="writer" className="data-[state=active]:bg-background/40 data-[state=active]:shadow-none rounded-lg">
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
                      <span className="text-sm text-muted-foreground">{wordCount} words</span>
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
                          "Humanize Text"
                        )}
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <FileText className="mr-2 h-3 w-3" />
                          Sample Text
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-medium">Humanized Result</h3>
                      {humanScore && (
                        <div className="flex items-center bg-green-500/10 text-green-600 px-2 py-1 rounded-full text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {humanScore}% Human Score
                        </div>
                      )}
                    </div>
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
            
            <TabsContent value="detector" className="p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="text-center p-12">
                <h3 className="text-xl font-medium mb-2">AI Detector</h3>
                <p className="text-muted-foreground mb-6">
                  Check if your content will be flagged by AI detection tools.
                </p>
                <Button className="bg-primary hover:bg-primary/90">Coming Soon</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="writer" className="p-6 focus-visible:outline-none focus-visible:ring-0">
              <div className="text-center p-12">
                <h3 className="text-xl font-medium mb-2">AI Writer</h3>
                <p className="text-muted-foreground mb-6">
                  Generate human-like content with custom citations.
                </p>
                <Button className="bg-primary hover:bg-primary/90">Coming Soon</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default HumanizerTool;
