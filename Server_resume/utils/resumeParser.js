
/**
 * A simple heuristic-based parser for splitting resume text into sections.
 * @param {string} text - The full text content of the resume.
 * @returns {object} - An object where keys are section titles and values are the content of those sections.
 */
const parseResumeText = (text) => {
  // 1. Define the known section headers. Order matters for matching.
  // We include common variations and use case-insensitivity later.
    const sectionHeaders = [
        'summary', 'objective', 'profile',
        'experience', 'work experience', 'professional experience',
        'education', 'academic background',
        'skills', 'technical skills', 'competencies',
        'projects', 'personal projects',
        'certifications', 'licenses & certifications',
        'awards', 'honors and awards',
        'publications',
        'references'
    ];

    // 2. Initialize the object to hold our parsed sections.
    const parsedSections = {
        contactInfo: '', // To store text before the first recognized section
    };
    
    // 3. Create a dynamic, case-insensitive regular expression to find our headers.
    // This regex looks for a header at the beginning of a line.
    const headerRegex = new RegExp(`^\\s*(${sectionHeaders.join('|')})\\s*$`, 'gim');
    
    let lastIndex = 0;
    let firstSectionFound = false;

    // 4. Find all matches of the headers in the text.
    const matches = [...text.matchAll(headerRegex)];

    // 5. Iterate through the found headers to slice the text into sections.
    matches.forEach((match, i) => {
        const sectionTitle = match[1].toLowerCase().trim(); // e.g., "work experience"
        const startIndex = match.index;

        // The text before the first matched section is likely contact info and name.
        if (!firstSectionFound) {
        parsedSections.contactInfo = text.substring(0, startIndex).trim();
        firstSectionFound = true;
        }

        // The content of the previous section ends where the current one begins.
        if (i > 0) {
        const prevMatch = matches[i - 1];
        const prevSectionTitle = prevMatch[1].toLowerCase().trim();
        const contentEndIndex = startIndex;
        const contentStartIndex = prevMatch.index + prevMatch[0].length;
        parsedSections[prevSectionTitle] = text.substring(contentStartIndex, contentEndIndex).trim();
        }
        
        // Handle the last section, which goes from the last header to the end of the text.
        if (i === matches.length - 1) {
        const contentStartIndex = startIndex + match[0].length;
        parsedSections[sectionTitle] = text.substring(contentStartIndex).trim();
        }
    });

    // If no sections were found, assume the entire text is one block.
    if (matches.length === 0) {
        parsedSections.fullText = text;
    }

    // 6. Clean up section titles to be consistent (e.g., 'work experience' -> 'experience')
    const finalSections = {};
    for (const [key, value] of Object.entries(parsedSections)) {
        if (['work experience', 'professional experience'].includes(key)) {
        finalSections['experience'] = value;
        } else if (['technical skills', 'competencies'].includes(key)) {
        finalSections['skills'] = value;
        } else {
        finalSections[key] = value;
        }
    }

    return finalSections;
};

// Export the function so we can use it in other files
// module.exports = { parseResumeText };
export { parseResumeText };