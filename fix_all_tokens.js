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
            
            // We want to replace instances of `window.parent.localStorage.getItem('userToken')` 
            // and `window.parent.localStorage.getItem('userToken') || localStorage.getItem('userToken')`
            // with a safe IIFE (Immediately Invoked Function Expression)
            
            const unsafeRegex1 = /window\.parent\.localStorage\.getItem\('userToken'\)\s*\|\|\s*localStorage\.getItem\('userToken'\)/g;
            const unsafeRegex2 = /window\.parent\.localStorage\.getItem\('userToken'\)/g;
            
            const safeReplacement = `(() => { try { return window.parent.localStorage.getItem('userToken'); } catch(e) { return localStorage.getItem('userToken'); } })()`;
            
            let modified = false;
            if (content.match(unsafeRegex1)) {
                content = content.replace(unsafeRegex1, safeReplacement);
                modified = true;
            }
            if (content.match(unsafeRegex2)) {
                content = content.replace(unsafeRegex2, safeReplacement);
                modified = true;
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed token access in:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Mass replacement complete');
