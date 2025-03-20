
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, GeminiResponse } from "./common";

export const calculateInitialAiScore = (text: string): number => {
  // More sophisticated AI pattern detection
  const patternScores = [
    // Repeated phrases (AI tends to repeat structures)
    (text.match(/(\b\w+\b)(?:\s+\w+\s+)(\1\b)/g)?.length || 0) * 3,
    
    // Consistent sentence structure (AI tends to be consistent)
    (text.match(/[.!?]\s+[A-Z]/g)?.length || 0) / (text.match(/[.!?]/g)?.length || 1) * 5,
    
    // Very long sentences (AI often writes long sentences)
    (text.match(/[^.!?]+[.!?]/g) || []).filter(s => s.length > 150).length * 8,
    
    // Formal transition words (AI loves these)
    (text.match(/\b(therefore|however|consequently|furthermore|moreover)\b/gi)?.length || 0) * 4,
    
    // Lack of contractions (AI tends to avoid contractions)
    (text.match(/\b(cannot|will not|do not|does not|is not)\b/gi)?.length || 0) * 5,
    
    // Perfect parallel structures (AI loves these)
    (text.match(/,\s*((?:\w+\s+){1,3}\w+,\s*){2,}/g)?.length || 0) * 7,
    
    // Very consistent punctuation (AI is consistent with punctuation)
    Math.abs(
      (text.match(/[.]/g)?.length || 0) - (text.match(/[!?]/g)?.length || 0) * 3
    ) * 0.5,
    
    // Perfectly balanced quotes (AI rarely makes mistakes with quote pairs)
    Math.abs(
      (text.match(/"/g)?.length || 0) % 2 === 0 ? 0 : 5
    ) + Math.abs(
      (text.match(/'/g)?.length || 0) % 2 === 0 ? 0 : 5
    ),
    
    // Few or no typos (AI makes fewer typos)
    Math.max(0, 8 - (text.match(/\b\w{1,2}\b|\s{2,}|[.,!?][a-z]|[A-Z]{2,}/g)?.length || 0))
  ];
  
  // Calculate base score with more sophisticated weighting
  let baseScore = Math.min(
    90, // Cap at 90 to leave room for random variation
    patternScores.reduce((sum, score) => sum + score, 0) + 
    Math.random() * 10
  );
  
  // Adjust by text length (shorter texts are harder to identify)
  if (text.length < 200) {
    baseScore = Math.max(40, baseScore * 0.9);
  }
  
  return Math.min(Math.floor(baseScore), 99);
};

export const analyzeAIScore = async (text: string): Promise<number> => {
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
                  text: `Analyze the following text and provide only a number from 0-100 indicating how likely it was written by AI (100 = definitely AI, 0 = definitely human).
                  Be extremely critical of perfect grammar, formal language, and structured writing patterns which are typical AI traits.
                  Look for human qualities like minor typos, informal language, contractions, personal anecdotes, or opinions.
                  Return ONLY the number, no other text or explanation.
                  
                  Text to analyze: "${text}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1, // Low temperature for more consistent scoring
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 16,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
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

    // If we couldn't get a proper score, use the local calculation
    return calculateInitialAiScore(text);
  } catch (error) {
    console.error("Error analyzing AI score:", error);
    // Use local calculation as fallback
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
