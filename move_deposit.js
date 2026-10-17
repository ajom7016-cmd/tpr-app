const fs = require('fs');

let indexFile = 'public/index.html';
let content = fs.readFileSync(indexFile, 'utf8');

// The exact string to remove (DEPOSIT object)
const depositObj = "        { title: 'DEPOSIT', keywords: ['deposit', 'add money', 'recharge', 'funds'], url: 'deposit_glass/code.html', icon: 'account_balance_wallet', bottomNavIdx: null },\n";

if (content.includes(depositObj)) {
    // Remove it from current position
    content = content.replace(depositObj, "");
    
    // Insert it at the end of the array
    const leaderboardObj = "{ title: 'LEADERBOARD', keywords: ['leaderboard', 'ranking', 'top', 'score'], url: 'leaderboard_glass/code.html', icon: 'leaderboard', bottomNavIdx: null },";
    content = content.replace(leaderboardObj, leaderboardObj + "\n" + depositObj.trimEnd());
    
    fs.writeFileSync(indexFile, content);
    console.log('Moved DEPOSIT to the end of appPages array');
} else {
    console.log('Could not find DEPOSIT object in appPages');
}
