const fs = require('fs');

const logPath = 'C:\\Users\\ajom7\\.gemini\\antigravity\\brain\\d4755013-1434-4938-8116-d1b6a02bbf20\\.system_generated\\logs\\transcript_full.jsonl';
const data = fs.readFileSync(logPath, 'utf8');

const lines = data.split('\n');

for (let line of lines) {
    if (line.includes('tpr-global-preloader')) {
        let obj = JSON.parse(line);
        if (obj.content) {
            let index = obj.content.indexOf('tpr-global-preloader');
            if (index !== -1) {
                console.log("FOUND IN CONTENT:");
                console.log(obj.content.substring(Math.max(0, index - 500), index + 1500));
                break;
            }
        }
    }
}
