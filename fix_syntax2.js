const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

let fixed = content.split('\n');
// We know the error is in the last 15 lines.
// Let's find the `})();` right after the scrollY block and change it back to `});`

for(let i=fixed.length-1; i>=0; i--) {
    if (fixed[i].includes('})();')) {
        // Is this the scroll event listener closer? 
        // The one we want to keep is the VERY last one.
        // The one we want to change is the second to last one.
        console.log('Found ', fixed[i], ' at line ', i);
    }
}

// Safer approach: 
content = content.replace("            })();\r\n        })();", "            });\r\n        })();");
content = content.replace("            })();\n        })();", "            });\n        })();");

fs.writeFileSync(file, content);
console.log('Fixed double IIFE syntax.');
