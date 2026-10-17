const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Target the specific floating back button div
            const floatingRegex = /<div class="absolute z-50 pl-1" style="top: 60px; left: 20px;">/g;
            if (content.match(floatingRegex)) {
                // Replace with static layout classes similar to deposit_glass
                // Added pt-2 pl-2 to give it a bit of breathing room from the edges like deposit page
                content = content.replace(floatingRegex, '<div class="mb-4 mt-2 ml-2 flex-none relative z-50">');
                modified = true;
            }

            // Fix the comment as well
            const commentRegex = /<!-- Back Button \(Floating\) -->/g;
            if (content.match(commentRegex)) {
                content = content.replace(commentRegex, '<!-- Back Button (Static) -->');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed back button in:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Mass replacement complete');
