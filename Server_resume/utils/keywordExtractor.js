// server/utils/keywordExtractor.js
import natural from 'natural'; // <--- CHANGE
const TfIdf = natural.TfIdf;
// const natural = require('natural');
// const TfIdf = natural.TfIdf;

// A list of common words to ignore (stop words)
// You can expand this list for better accuracy
const stopWords = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just',
  'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  's', 'same', 'she', 'should', 'so', 'some', 'such',
  't', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up',
  'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves',
  'experience', 'company', 'work', 'responsibilities', 'project', 'team', 'development', 'role'
]);


/**
 * Extracts keywords from resume and job description text using TF-IDF.
 * @param {string} resumeText - The full text of the resume.
 * @param {string} jdText - The full text of the job description.
 * @returns {object} - An object containing arrays of keywords for the resume and JD.
 */
const extractKeywords = (resumeText, jdText) => {
  const tfidf = new TfIdf();

  // Add the resume and job description as documents
  tfidf.addDocument(resumeText);
  tfidf.addDocument(jdText);

  const keywordCount = 20; // The number of top keywords to extract

  // Get keywords for the resume (document 0)
  const resumeTerms = tfidf.listTerms(0)
    .slice(0, keywordCount)
    .map(item => item.term)
    .filter(term => !stopWords.has(term.toLowerCase()) && isNaN(term)); // Filter out stop words and numbers

  // Get keywords for the job description (document 1)
  const jdTerms = tfidf.listTerms(1)
    .slice(0, keywordCount)
    .map(item => item.term)
    .filter(term => !stopWords.has(term.toLowerCase()) && isNaN(term));

  return {
    resumeKeywords: resumeTerms,
    jdKeywords: jdTerms,
  };
};

// module.exports = { extractKeywords };
export { extractKeywords };