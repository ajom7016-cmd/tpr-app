const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the IIFE with DOMContentLoaded listener
content = content.replace("(async () => {", "document.addEventListener('DOMContentLoaded', async () => {");
content = content.replace("})();\r\n    </script>", "});\r\n    </script>");
content = content.replace("})();\n    </script>", "});\n    </script>");

fs.writeFileSync(file, content);
console.log('Restored DOMContentLoaded in Dashboard');
