const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('database.sqlite');
db.serialize(() => {
    db.run(\
        CREATE TABLE IF NOT EXISTS user_devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL,
            device_name TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_active DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    \, (err) => {
        if (err) console.error(err);
        else console.log('user_devices table created.');
    });
});
