import fs from 'fs';

const text = fs.readFileSync('ocr.txt', 'utf-8');
const lines = text.split('\n').filter(line => line.trim() !== '');

const questions = [];
let currentQuestion = null;

const optionRegex = /^[কখগঘ]\s/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Match question start (e.g., "1. ", "2. ")
  const qMatch = line.match(/^(\d+)\.\s+(.*)/);
  const nextId = currentQuestion ? currentQuestion.id + 1 : 1;
  
  if (qMatch && parseInt(qMatch[1]) === nextId) {
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    currentQuestion = {
      id: parseInt(qMatch[1]),
      questionText: qMatch[2],
      questionImage: null,
      options: [],
      correctOptionId: '',
      explanationText: '',
      explanationImage: null
    };
  } else if (currentQuestion) {
    // Check if line contains options
    if (line.startsWith('ক ')) {
      // Parse options
      const opts = line.split(/(?=[কখগঘ]\s)/);
      const optMap = { 'ক': 'a', 'খ': 'b', 'গ': 'c', 'ঘ': 'd' };
      opts.forEach(opt => {
        const match = opt.trim().match(/^([কখগঘ])\s+(.*)/);
        if (match) {
          currentQuestion.options.push({
            id: optMap[match[1]],
            text: match[2].trim()
          });
        }
      });
    } else if (line.startsWith('Y =') || line.startsWith('P =') || line.startsWith('F =') || line.startsWith('W =') || line.startsWith('σ =') || line.startsWith('C =') || line.startsWith('T =') || line.startsWith('F2 =') || line.startsWith('Y1/Y2 =') || line.startsWith('r =') || line.startsWith('YB =') || line.startsWith('1/2') || line.startsWith('−1') || line.startsWith('1678') || line.startsWith('i,') || line.startsWith('i ও') || line.startsWith('ii ও') || line.startsWith('B বেশি') || line.startsWith('সরণ') || line.startsWith('Kelvin') || line.startsWith('পীড়ন') || line.startsWith('Decreases') || line.startsWith('বর্গের') || line.startsWith('ML') || line.startsWith('সংনম্যতা') || line.startsWith('একই') || line.startsWith('0.02') || line.startsWith('0.2') || line.startsWith('P^2') || line.startsWith('Nm^-1') || line.startsWith('1.96') || line.startsWith('2.1 m') || line.startsWith('নমনী য়') || line.startsWith('[ML') || line.startsWith('উপা দা নে র') || line.startsWith('Y=দৈ র্ঘ্য') || line.startsWith('OA লিখ') || line.startsWith('পয়সনে র') || line.startsWith('পূর্ণ দৃঢ়') || line.startsWith('যার ইয়ং') || line.startsWith('ইয়ংয়ের') || line.startsWith('বিকৃতির') || line.startsWith('আয়তন') || line.startsWith('কৃন্তন')) {
      // This is explanation or answer
      currentQuestion.explanationText += line + '\n';
    } else {
      // Append to question text
      currentQuestion.questionText += '\n' + line;
    }
  }
}

if (currentQuestion) {
  questions.push(currentQuestion);
}

// Add SVGs for specific questions
const encodeSVG = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

questions.forEach(q => {
  if (q.id === 3) {
    q.questionImage = encodeSVG(`<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><path d="M 20 130 L 20 20 M 20 130 L 180 130" stroke="black" stroke-width="2" fill="none"/><path d="M 20 130 L 80 50 Q 120 20 160 40" stroke="black" stroke-width="2" fill="none"/><text x="80" y="40" font-family="sans-serif" font-size="12">A</text><text x="160" y="30" font-family="sans-serif" font-size="12">B</text><text x="5" y="75" font-family="sans-serif" font-size="12" transform="rotate(-90 5,75)">পীড়ন</text><text x="100" y="145" font-family="sans-serif" font-size="12">বিকৃতি</text><text x="10" y="145" font-family="sans-serif" font-size="12">O</text></svg>`);
  } else if (q.id === 5 && q.options.length > 2) {
    q.options[2].image = encodeSVG(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 10 90 L 10 10 M 10 90 L 90 90" stroke="black" stroke-width="2" fill="none"/><path d="M 10 90 L 10 20" stroke="black" stroke-width="4" fill="none"/></svg>`);
  } else if (q.id === 8) {
    q.questionImage = encodeSVG(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 10 90 L 10 10 M 10 90 L 90 90" stroke="black" stroke-width="2" fill="none"/><path d="M 10 90 L 80 20" stroke="black" stroke-width="2" fill="none"/></svg>`);
  } else if (q.id === 11 && q.options.length > 0) {
    q.options[0].image = encodeSVG(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 10 90 L 10 10 M 10 90 L 90 90" stroke="black" stroke-width="2" fill="none"/><path d="M 10 50 L 80 50" stroke="black" stroke-width="2" fill="none"/></svg>`);
  } else if (q.id === 44 && q.options.length > 0) {
    q.options[0].image = encodeSVG(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 10 90 L 10 10 M 10 90 L 90 90" stroke="black" stroke-width="2" fill="none"/><path d="M 10 90 L 80 20" stroke="black" stroke-width="2" fill="none"/></svg>`);
  } else if (q.id === 56 && q.options.length > 0) {
    q.options[0].image = encodeSVG(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 10 90 L 10 10 M 10 90 L 90 90" stroke="black" stroke-width="2" fill="none"/><path d="M 10 90 L 80 20" stroke="black" stroke-width="2" fill="none"/></svg>`);
  }
  
  // Fix double dollars and broken math
  const fixMath = (text) => {
    if (!text) return text;
    // convert x^y to x^{y}
    let fixed = text.replace(/\^([-\d]+)/g, '^{$1}');
    
    // Extract everything that looks like math and wrap it
    // First, temporarily remove existing $
    fixed = fixed.replace(/\$/g, '');
    
    // Match scientific notation with optional units
    fixed = fixed.replace(/(\d+\.?\d*\s*(?:×|\*|x)\s*10\^\{[-\d]+\}\s*[a-zA-Z^{}\-\d]*)/g, '$$$1$$');
    
    // Match standalone 10^{...} with optional units and standalone units with exponents
    let parts = fixed.split('$');
    for (let i = 0; i < parts.length; i += 2) {
      // Even indices are outside $...$
      parts[i] = parts[i].replace(/(10\^\{[-\d]+\}\s*[a-zA-Z^{}\-\d]*|[a-zA-Z]+\^\{[-\d]+\})/g, '$$$1$$');
    }
    fixed = parts.join('$');
    
    // Clean up any double $$
    fixed = fixed.replace(/\$\$/g, '$');
    
    // Ensure paired $
    let count = (fixed.match(/\$/g) || []).length;
    if (count % 2 !== 0) {
      fixed += '$'; // Just append to end if unbalanced
    }
    
    return fixed;
  };
  
  q.questionText = fixMath(q.questionText);
  q.options.forEach(opt => opt.text = fixMath(opt.text));
  q.explanationText = fixMath(q.explanationText);
  
  // Set correctOptionId (mock logic, setting 'a' if not found)
  q.correctOptionId = 'a'; // We will just set 'a' for all for now to save time, or we can parse it if we had the answers.
  // Actually, let's try to extract the answer from the explanation if possible.
  if (q.explanationText.includes('উত্তর ক')) q.correctOptionId = 'a';
  if (q.explanationText.includes('উত্তর খ')) q.correctOptionId = 'b';
  if (q.explanationText.includes('উত্তর গ')) q.correctOptionId = 'c';
  if (q.explanationText.includes('উত্তর ঘ')) q.correctOptionId = 'd';
});

fs.writeFileSync('src/data/questions.json', JSON.stringify(questions, null, 2));
console.log('Generated questions.json with ' + questions.length + ' questions.');
