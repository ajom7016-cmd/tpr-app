const fs = require('fs');
const readline = require('readline');

async function testExact(filterEnd) {
  const fileStream = fs.createReadStream('C:\\Users\\ajom7\\.gemini\\antigravity\\brain\\d4755013-1434-4938-8116-d1b6a02bbf20\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lineNum = 0;
  const chunks = [];

  for await (const logLine of rl) {
    lineNum++;
    if (logLine.includes('File Path:') && logLine.includes('Showing lines') && logLine.includes(filterEnd)) {
      try {
        const obj = JSON.parse(logLine);
        const text = obj.content;
        // Search without backticks
        const idx = text.indexOf('File Path:');
        if (idx !== -1) {
          const line1 = text.substring(idx, idx + 200).split('\n')[0];
          const cleanPath = line1.replace('File Path:', '').replace(/[`]/g, '').trim().replace(/\\/g, '/');
          if (cleanPath.toLowerCase().endsWith(filterEnd.toLowerCase())) {
            const mTot = text.match(/Total Lines:\s*(\d+)/i);
            const mShow = text.match(/Showing lines\s*(\d+)\s*to\s*(\d+)/i);
            chunks.push({
              lineNum,
              date: obj.created_at,
              total: mTot ? parseInt(mTot[1]) : 0,
              showStart: mShow ? parseInt(mShow[1]) : 0,
              showEnd: mShow ? parseInt(mShow[2]) : 0,
              text
            });
          }
        }
      } catch(e) {}
    }
  }

  console.log(filterEnd + ' -> total chunks: ' + chunks.length);
  chunks.forEach(c => console.log('  L' + c.lineNum + ' | ' + c.date + ' | Tot:' + c.total + ' | Show:' + c.showStart + '-' + c.showEnd));
  return chunks;
}

async function run() {
  const c1 = await testExact('public/glassmorphic_1/code.html');
  const c2 = await testExact('public/glassmorphic_2/code.html');
}
run();
