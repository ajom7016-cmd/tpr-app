const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace ALL occurrences of `})();` back to `});`
content = content.replace(/\)\(\);/g, "});");

// Now specifically make the IIFE wrapper correct at the top and bottom
// We know the IIFE wrapper at the top is: `(async () => {`
// And we need to close it at the bottom: `})();` instead of the last `});`
// So we just replace the very last `});` with `})();`

let lines = content.split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('});')) {
        lines[i] = lines[i].replace('});', '})();');
        break; // Only replace the last one
    }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Restored all broken Javascript closures!');
