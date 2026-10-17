const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// The old injected CSS was hiding it completely:
const oldCSS = "::-webkit-scrollbar{display:none !important;} *{-ms-overflow-style:none !important;scrollbar-width:none !important;}";

// The new CSS will create a custom thin scrollbar with track margins
const newCSS = `::-webkit-scrollbar { width: 5px !important; display: block !important; }
::-webkit-scrollbar-track { background: transparent !important; margin-top: 65px; margin-bottom: 90px; }
::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.25) !important; border-radius: 10px !important; }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.4) !important; }
::-webkit-scrollbar-button { display: none !important; }
* { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.25) transparent; }`;

text = text.replace(oldCSS, newCSS);

fs.writeFileSync(file, text);
console.log('Injected custom thin scrollbar CSS into iframe onload');
