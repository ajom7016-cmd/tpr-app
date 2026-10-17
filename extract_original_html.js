const fs = require('fs');

const logPath = 'C:\\Users\\ajom7\\.gemini\\antigravity\\brain\\d4755013-1434-4938-8116-d1b6a02bbf20\\.system_generated\\logs\\transcript_full.jsonl';
const data = fs.readFileSync(logPath, 'utf8');

const lines = data.split('\n');

for (let line of lines) {
    if (line.includes('cat /var/www/jmj_app/public/index.html') || line.includes('cat index.html')) {
        let obj = JSON.parse(line);
        if (obj.content && obj.content.includes('<html')) {
            console.log("Found full HTML in transcript!");
            fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\original_index_from_log.html', obj.content);
            break;
        }
    }
}
