const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.run("UPDATE transactions SET method = 'bKash' WHERE type = 'withdraw' AND method IS NULL", (err) => {
    if (err) console.error(err);
    else console.log('Updated existing null withdrawals to bKash');
    db.close();
});
