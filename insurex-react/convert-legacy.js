// convert-legacy.js
// Run with: node convert-legacy.js

const fs = require('fs');
const path = require('path');

// Read the legacy logic file
const legacyPath = path.join(__dirname, 'src/utils/legacy-logic.js');
const outputPath = path.join(__dirname, 'src/utils/legacy-converted.ts');

if (!fs.existsSync(legacyPath)) {
  console.log('No legacy logic file found');
  process.exit(0);
}

let content = fs.readFileSync(legacyPath, 'utf8');
let output = `// Auto-converted from IAPR_Web legacy code
// Review and adapt as needed

`;

// Extract functions (simplified regex - you may need to adjust)
const functionRegex = /function\s+(\w+)\s*\(([^)]*)\)\s*{([^}]*)}/g;
let match;
let functions = [];

while ((match = functionRegex.exec(content)) !== null) {
  functions.push({
    name: match[1],
    params: match[2],
    body: match[3]
  });
}

// Convert to TypeScript
functions.forEach(fn => {
  output += `export function ${fn.name}(${fn.params}): any {\n`;
  output += `  ${fn.body.trim()}\n`;
  output += `}\n\n`;
});

// Add type definitions
output += `// ========================================
// Type definitions for legacy functions
// ========================================

export interface LegacyCalculationParams {
  [key: string]: any;
}

export interface LegacyResult {
  success: boolean;
  value?: any;
  error?: string;
}
`;

fs.writeFileSync(outputPath, output, 'utf8');
console.log(`✅ Converted ${functions.length} functions to TypeScript`);
