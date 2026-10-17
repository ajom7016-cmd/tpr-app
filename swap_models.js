const fs = require('fs');
let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

const oldTimeout = `const createTimeout = () => new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout_Exceeded')), 45000)
            );`;

const newTimeout = `const createTimeout = () => new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout_Exceeded')), 15000)
            );`;

content = content.replace(oldTimeout, newTimeout);

const oldPrimary = `model: 'gemini-flash-latest',`;
const newPrimary = `model: 'gemini-flash-lite-latest',`;
content = content.replace(oldPrimary, 'model: "TEMP_SWAP",');

const oldSecondary = `model: 'gemini-flash-lite-latest',`;
const newSecondary = `model: 'gemini-flash-latest',`;
content = content.replace(oldSecondary, newSecondary);

content = content.replace('model: "TEMP_SWAP",', newPrimary);

fs.writeFileSync(file, content);
console.log('Swapped primary to lite and lowered timeout to 15s');
