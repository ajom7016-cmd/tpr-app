const fs = require('fs');

let file = 'public/glassmorphic_3/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /if\(t\.type === 'withdraw'\) \{[\s\S]*?\} else if\(t\.type === 'deposit'\) \{\s*title = 'Deposit';\s*prefix = '\+';\s*amountColor = 'text-emerald-600';\s*\}/;

const replacement = `if(t.type === 'withdraw') {
                      title = t.method ? t.method + ' Withdrawal' : 'Withdrawal';
                      prefix = '-';
                      amountColor = 'text-slate-900';
                  } else if(t.type === 'reward') {
                      title = t.method ? t.method + ' Task' : 'Reward Bonus';
                      prefix = '+';
                      amountColor = 'text-emerald-600';
                  } else if(t.type === 'referral') {
                      title = 'Referral Bonus';
                      prefix = '+';
                      amountColor = 'text-emerald-600';
                  } else if(t.type === 'deposit') {
                      title = t.method ? t.method + ' Deposit' : 'Deposit';
                      prefix = '+';
                      amountColor = 'text-emerald-600';
                  }`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
console.log('Fixed deposit and withdrawal titles in frontend');
