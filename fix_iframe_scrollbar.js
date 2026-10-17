const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldOnload = `onload="try{const d=this.contentWindow.document; if(!this.src.includes('support') && this.src !== '') { d.body.style.setProperty('background', 'transparent', 'important'); d.body.style.setProperty('background-color', 'transparent', 'important'); const b=d.querySelector('.bg-3d'); if(b)b.style.display='none'; } }catch(e){}"`;

const newOnload = `onload="try{const d=this.contentWindow.document; if(!this.src.includes('support') && this.src !== '') { d.body.style.setProperty('background', 'transparent', 'important'); d.body.style.setProperty('background-color', 'transparent', 'important'); const b=d.querySelector('.bg-3d'); if(b)b.style.display='none'; } const s=d.createElement('style'); s.textContent='::-webkit-scrollbar{display:none !important;} *{-ms-overflow-style:none !important;scrollbar-width:none !important;}'; d.head.appendChild(s); }catch(e){}"`;

text = text.replace(oldOnload, newOnload);

fs.writeFileSync(file, text);
console.log('Injected scrollbar hiding CSS into iframe onload');
