
import { toast } from "@/components/ui/use-toast";

// Local AI score calculation as a fallback for API failures
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
