const fs = require('fs');

let file = 'public/login.html';
let text = fs.readFileSync(file, 'utf8');

// The problematic code:
/*
            const res = await window.APP.login(contact, pw);
            if (res.success) {
*/

const oldCodeRegex = /const res = await window\.APP\.login\(contact, pw\);/g;

const newCode = `
            let res = { success: false, error: 'Connection error' };
            try {
                const req = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contact, password: pw })
                });
                const data = await req.json();
                if (req.ok && data.token) {
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('tpr_auth_provider', 'email');
                    res = { success: true };
                } else {
                    res = { success: false, error: data.error || 'Login failed' };
                }
            } catch (e) {
                res = { success: false, error: 'Network error. Please try again.' };
            }
`;

text = text.replace(oldCodeRegex, newCode);

fs.writeFileSync(file, text);
console.log('Fixed login.html to use direct fetch instead of window.APP.login');
