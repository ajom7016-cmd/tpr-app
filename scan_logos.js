const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

function findFiles(dir, list = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      findFiles(full, list);
    } else if (/\.(html|js|json|css)$/i.test(f)) {
      list.push(full);
    }
  }
  return list;
}

const allFiles = findFiles(publicDir);
console.log('Total public files:', allFiles.length);

const logoMatches = [];
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(publicDir, file);
  
  const regex = /(\/assets\/[^\s"'`>]*(?:logo|icon)[^\s"'`>]*|logo\.png|logo_transparent\.png|app-icon\.svg|tpr-ai-logo\.jpg)/gi;
  const matches = content.match(regex);
  if (matches) {
    logoMatches.push({ file: rel, matches: [...new Set(matches)] });
  }
}

console.log(JSON.stringify(logoMatches, null, 2));
