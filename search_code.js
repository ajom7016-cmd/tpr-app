const fs = require('fs');

function checkFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    console.log('=== Checking:', filePath);
    lines.forEach((l, i) => {
        if (l.includes('{{') || l.includes('${') || l.includes('undefined') || l.includes('<%') || l.includes('NaN')) {
            console.log(`Line ${i + 1}: ${l.trim().substring(0, 100)}`);
        }
    });
}

checkFile('public/index.html');
checkFile('public/glassmorphic_1/code.html');
checkFile('public/login.html');
