const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function reconstruct(targetFile, maxExpectedLines, outputDest) {
  const fileStream = fs.createReadStream('C:\\Users\\ajom7\\.gemini\\antigravity\\brain\\d4755013-1434-4938-8116-d1b6a02bbf20\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const linesMap = {};

  for await (const logLine of rl) {
    if (logLine.includes('File Path:') && logLine.includes('Showing lines') && logLine.includes(targetFile)) {
      try {
        const obj = JSON.parse(logLine);
        const text = obj.content;
        const idx = text.indexOf('File Path:');
        if (idx !== -1) {
          const line1 = text.substring(idx, idx + 200).split('\n')[0];
          const cleanPath = line1.replace('File Path:', '').replace(/[`]/g, '').trim().replace(/\\/g, '/');
          if (cleanPath.toLowerCase().endsWith(targetFile.toLowerCase())) {
            const lineRegex = /^(\d+):\s(.*)$/gm;
            let match;
            while ((match = lineRegex.exec(text)) !== null) {
              const num = parseInt(match[1]);
              const content = match[2];
              // Overwrite with newer if available
              linesMap[num] = content;
            }
          }
        }
      } catch(e) {}
    }
  }

  const collectedNums = Object.keys(linesMap).map(Number).sort((a,b)=>a-b);
  console.log(targetFile + ': collected ' + collectedNums.length + ' lines. Max key: ' + collectedNums[collectedNums.length - 1]);

  const missing = [];
  const finalLines = [];
  const max = collectedNums[collectedNums.length - 1] || maxExpectedLines;

  for (let i = 1; i <= max; i++) {
    if (linesMap[i] !== undefined) {
      finalLines.push(linesMap[i]);
    } else {
      missing.push(i);
      finalLines.push(`<!-- Line ${i} -->`);
    }
  }

  console.log(targetFile + ' missing lines (' + missing.length + '): ' + missing.slice(0, 30).join(', '));
  
  const destDir = path.dirname(outputDest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(outputDest, finalLines.join('\n'), 'utf8');
  console.log('Saved to: ' + outputDest);
}

async function main() {
  await reconstruct('public/glassmorphic_1/code.html', 768, 'c:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\glassmorphic_1\\code.html');
  await reconstruct('public/glassmorphic_2/code.html', 823, 'c:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\glassmorphic_2\\code.html');
  await reconstruct('public/leaderboard_glass/code.html', 500, 'c:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\leaderboard_glass\\code.html');
}
main();
