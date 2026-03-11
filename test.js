console.log('1.96 x 10^{8} Nm^{-2}'.replace(/(\d+\.?\d*\s*(?:x|\*)\s*10\^\{[-\d]+\}\s*[a-zA-Z^{}-]*)/g, (match, p1) => {
  console.log('p1:', p1);
  return '$' + p1 + '$';
}));
