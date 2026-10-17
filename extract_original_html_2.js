const fs = require('fs');

const logPath = 'C:\\Users\\ajom7\\.gemini\\antigravity\\brain\\d4755013-1434-4938-8116-d1b6a02bbf20\\.system_generated\\logs\\transcript_full.jsonl';
const data = fs.readFileSync(logPath, 'utf8');

const lines = data.split('\n');

for (let line of lines) {
    if (line.includes('tpr-global-preloader')) {
        let obj = JSON.parse(line);
        if (obj.content && obj.content.includes('<html')) {
            fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\original_index_from_log_2.html', obj.content);
            console.log("Saved to original_index_from_log_2.html");
            break;
        }
    }
}
