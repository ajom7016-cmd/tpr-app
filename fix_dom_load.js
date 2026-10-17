const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// The file has:
// document.addEventListener('DOMContentLoaded', async () => {
//    let token = ...
//    ...
// }); (at the end of the script)

// We want to replace it with an IIFE:
// (async () => {
//    let token = ...
//    ...
// })();

const targetRegex = /document\.addEventListener\('DOMContentLoaded',\s*async\s*\(\)\s*=>\s*\{([\s\S]*?)\}\);/g;

// Wait, I need to match the correct one. The first one is for the slider. The second one is for the profile.
// Let's replace the specific text:
content = content.replace("document.addEventListener('DOMContentLoaded', async () => {", "(async () => {");

// Now we need to find the matching closing `});`
// Since it's right before `</script>`, we can just do:
content = content.replace("});\n    </script>", "})();\n    </script>");

fs.writeFileSync(file, content);
console.log('Fixed DOMContentLoaded issue.');
