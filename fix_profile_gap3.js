const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/topNavContainer\.classList\.add\('gap-3'\);/g, "topNavContainer.classList.add('gap-5');");
text = text.replace(/topNavContainer\.classList\.remove\('gap-3'\);/g, "topNavContainer.classList.remove('gap-5');");

fs.writeFileSync(file, text);
console.log('Increased profile page gap even more');
