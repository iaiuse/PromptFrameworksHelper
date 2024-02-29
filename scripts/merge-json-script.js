const fs = require('fs');
const path = require('path');

const frameworksDir = './frameworks';
const outputFile = './prompthelper.js';
const frameworks = [];

// Read each file in the frameworks directory
fs.readdirSync(frameworksDir).forEach(file => {
  if (path.extname(file) === '.json') {
    const content = fs.readFileSync(path.join(frameworksDir, file));
    frameworks.push(JSON.parse(content));
  }
});

// Load the existing prompthelper.js content
let outputContent = fs.readFileSync(outputFile, 'utf8');

// Replace the content between the special markers
const startMarker = '// START FRAMEWORKS';
const endMarker = '// END FRAMEWORKS';
const startIndex = outputContent.indexOf(startMarker) + startMarker.length;
const endIndex = outputContent.indexOf(endMarker);

if (startIndex > -1 && endIndex > -1) {
  outputContent = outputContent.substring(0, startIndex) +
    `\nvar frameworks = ${JSON.stringify(frameworks, null, 2)};\n` +
    outputContent.substring(endIndex);
}

// Write back to prompthelper.js
fs.writeFileSync(outputFile, outputContent);
