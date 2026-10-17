const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all("SELECT id FROM users", (err, rows) => {
    if (err || !rows) return console.log("No users found");
    
    const dummyTxs = [
        { type: 'reward', amount: 13.25, method: 'YouTube', status: 'completed' },
        { type: 'reward', amount: 13.25, method: 'TikTok', status: 'completed' },
        { type: 'reward', amount: 13.25, method: 'Facebook', status: 'completed' },
        { type: 'reward', amount: 13.25, method: 'Telegram', status: 'completed' },
        { type: 'deposit', amount: 500, method: 'bKash', status: 'completed' },
        { type: 'deposit', amount: 1000, method: 'Nagad', status: 'pending' },
        { type: 'deposit', amount: 5000, method: 'Binance', status: 'rejected' },
        { type: 'withdraw', amount: 200, method: 'bKash', status: 'completed' },
        { type: 'withdraw', amount: 500, method: 'Nagad', status: 'pending' },
        { type: 'withdraw', amount: 1000, method: 'Binance', status: 'completed' },
        { type: 'referral', amount: 50, method: '', status: 'completed' }
    ];

    rows.forEach(user => {
        dummyTxs.forEach(tx => {
            db.run(`INSERT INTO transactions (user_id, type, amount, method, status) VALUES (?, ?, ?, ?, ?)`,
                [user.id, tx.type, tx.amount, tx.method, tx.status]);
        });
    });

    console.log("Inserted dummy transactions for ALL users.");
});
