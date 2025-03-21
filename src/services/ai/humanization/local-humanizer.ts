
// Local humanization function as backup for API failures
export const humanizeTextLocally = (text: string): string => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  const humanizedSentences = sentences.map(sentence => {
    let humanized = sentence;
    
    // Use contractions
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
    
    // Add comma splices (common human error)
    const rand = Math.random();
    if (rand < 0.3 && humanized.length > 15) {
      const midpoint = Math.floor(humanized.length / 2);
      const insertPoint = Math.floor(midpoint - 8 + Math.random() * 16);
      humanized = humanized.slice(0, insertPoint) + ", " + humanized.slice(insertPoint);
    }
    
    // Sometimes break sentences unnaturally (human tendency)
    else if (rand < 0.4 && humanized.length > 40) {
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
    
    // Replace formal words with more casual alternatives
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
      .replace(/\b(sufficient)\b/gi, "enough")
      .replace(/\b(regarding)\b/gi, "about")
      .replace(/\b(additional)\b/gi, "more")
      .replace(/\b(currently)\b/gi, "now")
      .replace(/\b(numerous)\b/gi, "many")
      .replace(/\b(obtain)\b/gi, "get")
      .replace(/\b(require)\b/gi, "need");
    
    // Add filler words (very human)
    if (Math.random() < 0.35) {
      const fillers = ["actually", "basically", "honestly", "I mean", "you know", "kind of", "pretty much", "like", "sort of", "just", "really", "literally"];
      const filler = fillers[Math.floor(Math.random() * fillers.length)];
      
      if (Math.random() < 0.5 && humanized.length > 10) {
        humanized = filler + ", " + humanized.charAt(0).toLowerCase() + humanized.slice(1);
      } else {
        const insertPoint = Math.floor(humanized.length / 3 + Math.random() * (humanized.length / 3));
        humanized = humanized.slice(0, insertPoint) + " " + filler + " " + humanized.slice(insertPoint);
      }
    }
    
    // Add occasional typos (very human)
    if (Math.random() < 0.15) {
      const words = humanized.split(" ");
      if (words.length > 3) {
        const randomWordIndex = Math.floor(Math.random() * words.length);
        const word = words[randomWordIndex];
        if (word.length > 3) {
          // Possible typo types: character swap, missing letter, double letter
          const typoType = Math.floor(Math.random() * 3);
          
          if (typoType === 0 && word.length > 4) {
            // Swap two adjacent characters
            const swapIndex = Math.floor(Math.random() * (word.length - 2)) + 1;
            words[randomWordIndex] = word.substring(0, swapIndex) + 
                                    word.charAt(swapIndex + 1) + 
                                    word.charAt(swapIndex) + 
                                    word.substring(swapIndex + 2);
          } else if (typoType === 1) {
            // Miss a letter
            const missIndex = Math.floor(Math.random() * (word.length - 1)) + 1;
            words[randomWordIndex] = word.substring(0, missIndex) + word.substring(missIndex + 1);
          } else {
            // Double a letter
            const doubleIndex = Math.floor(Math.random() * (word.length - 1)) + 1;
            words[randomWordIndex] = word.substring(0, doubleIndex) + 
                                    word.charAt(doubleIndex) + 
                                    word.substring(doubleIndex);
          }
        }
        humanized = words.join(" ");
      }
    }
    
    return humanized;
  });
  
  // Join sentences, occasionally with improper spacing (human error)
  let result = humanizedSentences.join(" ");
  
  // Add an occasional redundant word (human mistake)
  if (Math.random() < 0.2) {
    const words = result.split(" ");
    if (words.length > 10) {
      const randomWordIndex = Math.floor(Math.random() * (words.length - 5)) + 5;
      if (["the", "a", "an", "in", "of", "for", "with"].includes(words[randomWordIndex])) {
        words.splice(randomWordIndex, 0, words[randomWordIndex]);
        result = words.join(" ");
      }
    }
  }
  
  return result.replace(/\s{2,}/g, " ");
};
