// extractKeywords.js
import { techKeywords, keywordCategories } from './keywordDictionary';

export function extractKeywords(text, options = {}) {
  const {
    minWordLength = 2,
    maxWordLength = 30,
    scoreCapPerKeyword = 5,
    strictMode = false
  } = options;

  // Advanced text normalization
  const normalizedText = text
    .toLowerCase()
    // .replace(/[\/\(\)\-\+]/g, ' ')  // Handle special characters
    .replace(/\band\b|\bor\b|\bthe\b|\bfor\b|\bwith\b/g, ' ')  // Remove common connectors
    .replace(/\s+/g, ' ');  // Normalize whitespace

  const words = normalizedText.match(new RegExp(`\\b[a-z0-9+#]{${minWordLength},${maxWordLength}}\\b`, 'g')) || [];
  const frequency = {};
  const relevantKeywords = new Set();
  const categoryCounts = {};

  // Initialize category counts
  Object.keys(keywordCategories).forEach(category => {
    categoryCounts[category] = 0;
  });

  words.forEach(word => {
    // Handle common variations and compound terms
    const normalizedWord = word
      .replace(/\d+s$/, '')  // Remove plural 's' after numbers (e.g., aws3 -> aws)
      .replace(/s$/, '')    // Simple plural handling
      .replace(/[^a-z0-9+#]/g, '');  // Keep only alphanumeric and some special chars

    let matchedKeyword = null;

    // Check in order of priority: exact match > normalized > singular > compound
    if (techKeywords.has(word)) {
      matchedKeyword = word;
    } else if (techKeywords.has(normalizedWord)) {
      matchedKeyword = normalizedWord;
    } else if (!strictMode) {
      // Check for partial matches (e.g., "microservice" in "microservices")
      for (const keyword of techKeywords) {
        if (keyword.includes(normalizedWord) || normalizedWord.includes(keyword)) {
          matchedKeyword = keyword;
          break;
        }
      }
    }

    if (matchedKeyword) {
      frequency[matchedKeyword] = (frequency[matchedKeyword] || 0) + 1;
      relevantKeywords.add(matchedKeyword);
      
      // Update category counts
      for (const [category, keywords] of Object.entries(keywordCategories)) {
        if (keywords.has(matchedKeyword)) {
          categoryCounts[category]++;
        }
      }
    }
  });

  const score = calculateKeywordScore(frequency, scoreCapPerKeyword);
  const categoryPercentages = calculateCategoryPercentages(categoryCounts);

  return {
    keywords: Array.from(relevantKeywords).sort(),
    frequency,
    score,
    matches: relevantKeywords.size,
    categories: categoryPercentages,
    weightedScore: calculateWeightedScore(frequency, keywordCategories)
  };
}

function calculateKeywordScore(frequency, capPerKeyword) {
  return Object.values(frequency).reduce(
    (sum, count) => sum + Math.min(count, capPerKeyword), 
    0
  );
}

function calculateCategoryPercentages(categoryCounts) {
  const total = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  return Object.fromEntries(
    Object.entries(categoryCounts).map(([category, count]) => [
      category,
      total > 0 ? Math.round((count / total) * 100) : 0
    ])
  );
}

function calculateWeightedScore(frequency, keywordCategories) {
  let weightedScore = 0;
  const categoryWeights = {
    languages: 1.2,
    frameworks: 1.1,
    tools: 1.0,
    concepts: 0.9,
    // ... other category weights
  };

  for (const [keyword, count] of Object.entries(frequency)) {
    let maxWeight = 1.0;
    // Find the highest weight category this keyword belongs to
    for (const [category, keywords] of Object.entries(keywordCategories)) {
      if (keywords.has(keyword) && categoryWeights[category] > maxWeight) {
        maxWeight = categoryWeights[category];
      }
    }
    weightedScore += Math.min(count, 5) * maxWeight;
  }

  return Math.round(weightedScore);
}