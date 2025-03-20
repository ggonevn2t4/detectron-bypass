import { toast } from "@/hooks/use-toast";

// API key is typically stored in environment variables, but for quick demo we're using it directly
const API_KEY = "AIzaSyCAUUzlCkSxc8cTBWQdVGCvOxIQGSEnsIE";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

// Backup humanization function that works client-side when API is unavailable
const clientSideHumanize = (text: string): string => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  const humanizedSentences = sentences.map(sentence => {
    let humanized = sentence;
    
    // Apply contractions
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
    
    // Randomly add breaks, commas, or filler phrases
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
    
    // Replace formal words with more casual equivalents
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
    
    // Add filler words sometimes
    if (Math.random() < 0.25) {
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

// Calculate a local AI score without API call
const calculateInitialAiScore = (text: string): number => {
  const patternScores = [
    text.match(/(\b\w+\b)(?:\s+\w+\s+)(\1\b)/g)?.length || 0, // Repeated words
    (text.match(/[.!?]\s+[A-Z]/g)?.length || 0) / (text.match(/[.!?]/g)?.length || 1), // Sentence patterns
    (text.match(/[^.!?]+[.!?]/g) || []).filter(s => s.length > 150).length, // Long sentences
    (text.match(/\b(therefore|however|consequently|furthermore|moreover)\b/gi)?.length || 0), // Formal transitions
    (text.match(/\b(cannot|will not|do not|does not|is not)\b/gi)?.length || 0), // Lack of contractions
  ];
  
  const baseScore = Math.min(
    85,
    patternScores.reduce((sum, score) => sum + score, 0) * 5 + 
    Math.random() * 15
  );
  
  return Math.min(Math.floor(baseScore), 99);
};

export const humanizeTextWithGemini = async (text: string): Promise<string> => {
  try {
    console.log("Attempting to humanize text with Gemini API");
    const response = await fetch(
      `${BASE_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Please rewrite the following text to sound more human-written and less AI-generated. 
                  Make it more conversational, use contractions, vary sentence structure, and add some natural language patterns.
                  Important: Keep all the facts intact, don't change any information, just make the style more human-like.
                  
                  Text to humanize: "${text}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("API error:", errorData);
      // Handle quota errors specifically
      if (errorData.error?.message?.includes("quota") || errorData.error?.message?.includes("exhausted")) {
        console.log("API quota exhausted, using fallback client-side humanization");
        return clientSideHumanize(text);
      }
      throw new Error(errorData.error?.message || "Error calling AI service");
    }

    const data: GeminiResponse = await response.json();

    // Check for safety blocks
    if (data.promptFeedback?.blockReason) {
      console.log("Content blocked by API safety filters, using fallback");
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    // Get the generated text
    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      return generatedText.trim();
    }

    throw new Error("No response generated");
  } catch (error) {
    console.error("Error humanizing text:", error);
    toast({
      title: "Using Local Humanization",
      description: "We've switched to local processing due to API limits",
      variant: "warning",
    });
    // Fallback to client-side humanization when API fails
    return clientSideHumanize(text);
  }
};

export const analyzeAIScore = async (text: string): Promise<number> => {
  try {
    console.log("Attempting AI detection score analysis");
    const response = await fetch(
      `${BASE_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following text and provide only a number from 0-100 indicating how likely it was written by AI (100 = definitely AI, 0 = definitely human).
                  Return ONLY the number, no other text or explanation.
                  
                  Text to analyze: "${text}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 16,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("AI score analysis API error:", errorData);
      // Fall back to client-side analysis
      if (errorData.error?.message?.includes("quota") || errorData.error?.message?.includes("exhausted")) {
        console.log("API quota exhausted, using fallback client-side AI score calculation");
        return calculateInitialAiScore(text);
      }
      throw new Error(errorData.error?.message || "Error analyzing text");
    }

    const data: GeminiResponse = await response.json();

    // Get the generated score
    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      const scoreMatch = generatedText.match(/\d+/);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[0], 10);
        return Math.min(Math.max(score, 0), 100); // Ensure between 0-100
      }
    }

    // If we couldn't get a proper score, return a calculated one
    return calculateInitialAiScore(text);
  } catch (error) {
    console.error("Error analyzing AI score:", error);
    // Return a calculated score between 60-85 on error as fallback
    return calculateInitialAiScore(text);
  }
};

export const detectAIContent = async (text: string): Promise<{
  score: number;
  analysis: string;
  confidence: "high" | "medium" | "low";
}> => {
  try {
    const response = await fetch(
      `${BASE_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following text to determine if it was written by AI or a human.
                  
                  Return your response in the format:
                  SCORE: [numeric score from 0-100 where 100 means definitely AI-generated]
                  CONFIDENCE: [high|medium|low]
                  ANALYSIS: [2-3 sentences explaining why you think the text is AI-generated or human-written, noting specific patterns or features]
                  
                  Text to analyze: "${text}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error analyzing text");
    }

    const data: GeminiResponse = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const analysisText = data.candidates[0].content.parts[0].text;
      
      // Extract the score
      const scoreMatch = analysisText.match(/SCORE:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
      
      // Extract the confidence
      const confidenceMatch = analysisText.match(/CONFIDENCE:\s*(high|medium|low)/i);
      const confidence = (confidenceMatch ? confidenceMatch[1].toLowerCase() : "medium") as "high" | "medium" | "low";
      
      // Extract the analysis
      const analysisMatch = analysisText.match(/ANALYSIS:\s*([\s\S]+)(?:\n|$)/i);
      const analysis = analysisMatch ? analysisMatch[1].trim() : "Unable to provide detailed analysis.";
      
      return {
        score: Math.min(Math.max(score, 0), 100),
        confidence,
        analysis
      };
    }

    throw new Error("Failed to analyze the text");
  } catch (error) {
    console.error("Error running AI detection:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    
    // Return fallback values
    return {
      score: Math.floor(Math.random() * 40) + 30, // Random score between 30-70
      confidence: "low",
      analysis: "Unable to perform analysis due to an error. Please try again later."
    };
  }
};

export const generateAIContent = async (
  topic: string,
  length: "short" | "medium" | "long",
  tone: "formal" | "casual" | "professional"
): Promise<string> => {
  try {
    const wordCount = length === "short" ? "200-300" : length === "medium" ? "400-600" : "800-1200";
    
    const response = await fetch(
      `${BASE_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write an article about "${topic}".
                  Make it about ${wordCount} words long.
                  Use a ${tone} tone.
                  Include a title for the article.
                  Make the content informative, well-structured with paragraphs, and include some facts if relevant.
                  Output ONLY the article text without any other explanation.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 4096,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error generating content");
    }

    const data: GeminiResponse = await response.json();

    // Check for safety blocks
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    // Get the generated text
    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      return generatedText.trim();
    }

    throw new Error("No content generated");
  } catch (error) {
    console.error("Error generating AI content:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return ""; // Return empty string on error
  }
};
