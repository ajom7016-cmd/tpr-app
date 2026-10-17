const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldNavCSS = /\.bottom-nav\s*\{[\s\S]*?border-radius:\s*30px;\s*\}/;
const newNavCSS = `.bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 12px 24px;
          padding-bottom: env(safe-area-inset-bottom, 12px);
          z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 -5px 20px rgba(0,0,0,0.03);
      }`;

text = text.replace(oldNavCSS, newNavCSS);

fs.writeFileSync(file, text);
console.log('Fixed index.html bottom nav to be anchored at the bottom edge');
