const fs = require('fs');

let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

const oldWithdrawLogic = /app\.post\('\/api\/withdraw', authenticateToken, \(req, res\) => \{[\s\S]*?const \{ amount, method \} = req\.body;[\s\S]*?db\.get\(`SELECT balance FROM users WHERE id = \?`, \[req\.user\.id\], \(err, user\) => \{[\s\S]*?res\.json\(\{ message: 'Withdrawal request submitted successfully', transactionId: this\.lastID \}\);\s*\}\);\s*\}\);\s*\}\);\s*\}\);/m;

const newWithdrawLogic = `app.post('/api/withdraw', authenticateToken, (req, res) => {
    const { amount, method } = req.body;
    
    // BUG FIX: Prevent negative withdrawal amounts (infinite money glitch)
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }
    
    db.get(\`SELECT balance FROM users WHERE id = ?\`, [req.user.id], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        if (user.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

        db.run(\`UPDATE users SET balance = balance - ? WHERE id = ?\`, [amount, req.user.id], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            db.run(\`INSERT INTO transactions (user_id, type, amount, method, status) VALUES (?, ?, ?, ?, ?)\`,
                [req.user.id, 'withdraw', amount, method, 'pending'], function(err) {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    res.json({ message: 'Withdrawal request submitted successfully', transactionId: this.lastID });
            });
        });
    });
});`;

if (content.match(oldWithdrawLogic)) {
    content = content.replace(oldWithdrawLogic, newWithdrawLogic);
    fs.writeFileSync(file, content);
    console.log('Fixed Negative Withdrawal Glitch');
} else {
    console.log('Regex did not match exactly.');
}
