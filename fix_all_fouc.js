const fs = require('fs');
const path = require('path');

const animationCSS = `
    /* Anti-FOUC Smooth Load */
    body {
        animation: smoothLoad 0.4s ease-out forwards;
        opacity: 0;
    }
    @keyframes smoothLoad {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
`;

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Only apply if it has Tailwind CDN and doesn't already have smoothLoad
            if (content.includes('cdn.tailwindcss.com') && !content.includes('smoothLoad')) {
                // Insert right before </style>
                if (content.includes('</style>')) {
                    content = content.replace('</style>', animationCSS + '\n</style>');
                    fs.writeFileSync(fullPath, content);
                    console.log('Fixed FOUC in: ' + fullPath);
                }
            }
        }
    });
}

walkDir('C:/Users/ajom7/Downloads/TPR/JMJ_App/public');
console.log('FOUC fix applied to all Tailwind pages!');
