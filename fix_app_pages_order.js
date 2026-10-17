const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// The original appPages string that needs to be replaced
const oldAppPagesRegex = /const appPages = \[[\s\S]*?\];/;

const newAppPages = `const appPages = [
        { title: 'DASHBOARD', keywords: ['home', 'dashboard', 'main'], url: 'glassmorphic_1/code.html', icon: 'dashboard', bottomNavIdx: 0 },
        { title: 'TASKS', keywords: ['rewards', 'gifts', 'tasks'], url: 'glassmorphic_2/code.html', icon: 'card_giftcard', bottomNavIdx: 1 },
        { title: 'PLAN', keywords: ['vip', 'deposit', 'invest', 'plan', 'premium', 'add money'], url: 'investment_premium_glass/vip.html', icon: 'diamond', bottomNavIdx: 2 },
        { title: 'PROFILE', keywords: ['profile', 'account', 'settings', 'me', 'withdraw'], url: 'user_profile_premium_glass/code.html', icon: 'person', bottomNavIdx: 3 },
        { title: 'HISTORY', keywords: ['history', 'transactions', 'records', 'past'], url: 'glassmorphic_3/code.html', icon: 'history', bottomNavIdx: null },
        { title: 'LEADERBOARD', keywords: ['leaderboard', 'ranking', 'top', 'score'], url: 'leaderboard_glass/code.html', icon: 'leaderboard', bottomNavIdx: null },
        { title: 'REFER', keywords: ['refer', 'invite', 'friends', 'bonus', 'affiliate'], url: 'refer_glass/code.html', icon: 'group_add', bottomNavIdx: null }
    ];`;

text = text.replace(oldAppPagesRegex, newAppPages);

fs.writeFileSync(file, text);
console.log('Fixed the order of appPages so the header shows the correct previous/next items');
