const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.get("SELECT id FROM users ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err || !row) return console.log("No user found");
    const userId = row.id;

    const dummyTxs = [
        { type: 'reward', amount: 13.25, method: 'YouTube', status: 'completed' },
        { type: 'reward', amount: 13.25, method: 'TikTok', status: 'completed' },
        { type: 'deposit', amount: 500, method: 'bKash', status: 'completed' },
        { type: 'withdraw', amount: 200, method: 'Nagad', status: 'pending' },
        { type: 'referral', amount: 50, method: '', status: 'completed' }
    ];

    let count = 0;
    dummyTxs.forEach(tx => {
        db.run(`INSERT INTO transactions (user_id, type, amount, method, status) VALUES (?, ?, ?, ?, ?)`,
            [userId, tx.type, tx.amount, tx.method, tx.status], (err) => {
                if (!err) count++;
                if (count === dummyTxs.length) {
                    console.log("Inserted dummy transactions for user ID: " + userId);
                    db.close();
                }
            });
    });
});
