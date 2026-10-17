const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/topNavContainer\.classList\.add\('gap-1\.5'\);/g, "topNavContainer.classList.add('gap-3');");
text = text.replace(/topNavContainer\.classList\.remove\('gap-1\.5'\);/g, "topNavContainer.classList.remove('gap-3');");
text = text.replace(/topNavContainer\.classList\.remove\('gap-4'\);/g, "topNavContainer.classList.remove('gap-4', 'gap-3');");
text = text.replace(/topNavContainer\.classList\.add\('gap-2'\);/g, "topNavContainer.classList.add('gap-4');");

fs.writeFileSync(file, text);
console.log('Fixed profile page gap');
