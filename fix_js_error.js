const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/let icon = btn\.querySelector\('i'\);/g, "let icon = btn.querySelector('.material-symbols-outlined');");
text = text.replace(/if\s*\(icon\)\s*icon\.style\.fontVariationSettings = "'FILL' 0";/g, ""); // Just in case
text = text.replace(/let icon = btn\.querySelector\('\.material-symbols-outlined'\);\s*icon\.style\.fontVariationSettings = "'FILL' 0";/g, 
    "let icon = btn.querySelector('.material-symbols-outlined');\n            if (icon) icon.style.fontVariationSettings = \"'FILL' 0\";");

text = text.replace(/let targetIcon = targetBottomNav\.querySelector\('i'\);/g, "let targetIcon = targetBottomNav.querySelector('.material-symbols-outlined');");
text = text.replace(/targetIcon\.style\.fontVariationSettings = "'FILL' 1";/g, "if (targetIcon) targetIcon.style.fontVariationSettings = \"'FILL' 1\";");

fs.writeFileSync(file, text);
console.log('Fixed JS error in index.html loadPage');
