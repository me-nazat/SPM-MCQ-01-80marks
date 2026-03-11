import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fixText() {
  const data = JSON.parse(fs.readFileSync('src/data/questions.json', 'utf8'));
  
  // We'll process in batches to avoid rate limits and context length issues
  const batchSize = 10;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(data.length / batchSize)}`);
    
    const prompt = `
Fix the spacing issues in the following JSON array of multiple-choice questions. 
The Bengali text has incorrect spaces inserted inside words (e.g., "স্থি তি স্থা পক" should be "স্থিতিস্থাপক", "পী ড়ন" should be "পীড়ন", "বি কৃতি" should be "বিকৃতি", "হুকে র" should be "হুকের").
Remove these incorrect spaces to form proper Bengali words. 
Do NOT change any math formulas, English words, numbers, or the structure of the JSON. Only fix the Bengali text spacing.
Return the exact same JSON structure with the text fixed.

JSON:
${JSON.stringify(batch, null, 2)}
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      
      const fixedBatch = JSON.parse(response.text);
      for (let j = 0; j < fixedBatch.length; j++) {
        data[i + j] = fixedBatch[j];
      }
    } catch (e) {
      console.error(`Error processing batch ${i / batchSize + 1}:`, e);
    }
  }
  
  fs.writeFileSync('src/data/questions.json', JSON.stringify(data, null, 2));
  console.log('Done!');
}

fixText();
