const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldAppPagesRegex = /const appPages = \[[\s\S]*?\];/;

const newAppPages = `const appPages = [
        { title: 'DASHBOARD', keywords: ['home', 'dashboard', 'main'], url: 'glassmorphic_1/code.html', icon: 'dashboard', bottomNavIdx: 0 },
        { title: 'TASKS', keywords: ['rewards', 'gifts', 'tasks'], url: 'glassmorphic_2/code.html', icon: 'card_giftcard', bottomNavIdx: 1 },
        { title: 'PLAN', keywords: ['vip', 'deposit', 'invest', 'plan', 'premium', 'add money'], url: 'investment_premium_glass/vip.html', icon: 'diamond', bottomNavIdx: 2 },
        { title: 'PROFILE', keywords: ['profile', 'account', 'settings', 'me', 'withdraw'], url: 'user_profile_premium_glass/code.html', icon: 'person', bottomNavIdx: 3 },
        { title: 'HISTORY', keywords: ['history', 'transactions', 'records', 'past'], url: 'glassmorphic_3/code.html', icon: 'history', bottomNavIdx: null },
        { title: 'LEADERBOARD', keywords: ['leaderboard', 'ranking', 'top', 'score'], url: 'leaderboard_glass/code.html', icon: 'leaderboard', bottomNavIdx: null },
        { title: 'REFER', keywords: ['refer', 'invite', 'friends', 'bonus', 'affiliate'], url: 'refer_glass/code.html', icon: 'group_add', bottomNavIdx: null },
        { title: 'SETTINGS', keywords: ['settings', 'profile'], url: 'profile_settings_glass/code.html', icon: 'settings', bottomNavIdx: null },
        { title: 'BANK', keywords: ['bank', 'details', 'money'], url: 'bank_details_glass/code.html', icon: 'account_balance', bottomNavIdx: null },
        { title: 'SECURITY', keywords: ['security', 'privacy', 'lock'], url: 'security_glass/code.html', icon: 'lock', bottomNavIdx: null },
        { title: 'SUPPORT', keywords: ['support', 'help', 'chat'], url: 'support_glass/code.html', icon: 'headset_mic', bottomNavIdx: null },
        { title: 'PASSWORD', keywords: ['password', 'change'], url: 'security_change_password/code.html', icon: 'key', bottomNavIdx: null },
        { title: 'PIN', keywords: ['pin', 'withdrawal'], url: 'security_change_pin/code.html', icon: 'dialpad', bottomNavIdx: null },
        { title: 'BIOMETRIC', keywords: ['biometric', 'fingerprint', 'face'], url: 'security_biometric/code.html', icon: 'fingerprint', bottomNavIdx: null },
        { title: '2FA', keywords: ['2fa', 'auth'], url: 'security_2fa/code.html', icon: 'security', bottomNavIdx: null },
        { title: 'DEVICES', keywords: ['devices', 'sessions'], url: 'security_devices/code.html', icon: 'devices', bottomNavIdx: null },
        { title: 'DEACTIVATE', keywords: ['deactivate', 'delete'], url: 'security_deactivate/code.html', icon: 'cancel', bottomNavIdx: null }
    ];`;

text = text.replace(oldAppPagesRegex, newAppPages);

fs.writeFileSync(file, text);
console.log('Added all subpages to appPages so they display correctly in the header');
