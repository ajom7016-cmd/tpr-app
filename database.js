process.env.TZ = 'Asia/Dhaka';
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // High-Concurrency SQLite Configuration (Smoothly supports 1 lakh+ users)
        db.run('PRAGMA journal_mode = WAL;');
        db.run('PRAGMA busy_timeout = 10000;');
        db.run('PRAGMA synchronous = NORMAL;');
        db.run('PRAGMA cache_size = -64000;', () => {
            initDb();
        });
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            withdraw_pin TEXT DEFAULT NULL,
            balance REAL DEFAULT 0.0,
            role TEXT DEFAULT 'user',
            vip_plan TEXT DEFAULT 'Free',
            total_referrals INTEGER DEFAULT 0,
            total_tasks INTEGER DEFAULT 0,
            referral_code TEXT DEFAULT NULL,
            referred_by TEXT DEFAULT NULL,
            referral_reward_given INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Safe column migrations for users table
        db.all("PRAGMA table_info(users)", (err, columns) => {
            if (err || !columns) return;
            const colNames = columns.map(c => c.name);

            if (!colNames.includes('profile_changed_at')) {
                db.run("ALTER TABLE users ADD COLUMN profile_changed_at DATETIME DEFAULT NULL", (e) => {
                    if (!e) console.log("Added profile_changed_at to users table.");
                });
            }

            if (!colNames.includes('referral_code')) {
                db.run("ALTER TABLE users ADD COLUMN referral_code TEXT DEFAULT NULL", (e) => {
                    if (!e) {
                        console.log("Added referral_code to users table.");
                        db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral ON users(referral_code)", (ie) => {});
                    }
                });
            } else {
                db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral ON users(referral_code)", (ie) => {});
            }

            if (!colNames.includes('referred_by')) {
                db.run("ALTER TABLE users ADD COLUMN referred_by TEXT DEFAULT NULL", (e) => {
                    if (!e) console.log("Added referred_by to users table.");
                });
            }

            if (!colNames.includes('referral_reward_given')) {
                db.run("ALTER TABLE users ADD COLUMN referral_reward_given INTEGER DEFAULT 0", (e) => {
                    if (!e) console.log("Added referral_reward_given to users table.");
                });
            }

            if (!colNames.includes('status')) {
                db.run("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'", (e) => {
                    if (!e) console.log("Added status to users table.");
                });
            }
        });

        // Tasks Table
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            reward REAL NOT NULL,
            type TEXT NOT NULL,
            link TEXT DEFAULT '[]',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Safe column migrations for tasks table
        db.all("PRAGMA table_info(tasks)", (err, columns) => {
            if (err || !columns) return;
            const colNames = columns.map(c => c.name);
            if (!colNames.includes('link')) {
                db.run("ALTER TABLE tasks ADD COLUMN link TEXT DEFAULT '[]'", (e) => {
                    if (!e) console.log("Added link column to tasks table.");
                });
            }
        });

        // Deposits Table
        db.run(`CREATE TABLE IF NOT EXISTS deposits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount REAL,
            method TEXT,
            transaction_id TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // User Tasks (Tracking completions)
        db.run(`CREATE TABLE IF NOT EXISTS user_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            task_id INTEGER,
            status TEXT DEFAULT 'completed',
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(task_id) REFERENCES tasks(id)
        )`);

        // Transactions Table
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT NOT NULL, -- 'deposit', 'withdraw', 'reward'
            amount REAL NOT NULL,
            method TEXT, -- 'bKash', 'Nagad', 'Rocket'
            status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'rejected'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // User Banks (Payment Methods)
        db.run(`CREATE TABLE IF NOT EXISTS user_banks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            provider TEXT NOT NULL, -- 'bKash', 'Nagad', 'Binance'
            account_number TEXT NOT NULL,
            is_default BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Settings Table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);

        // High-Performance Query Indexes
        db.run("CREATE INDEX IF NOT EXISTS idx_users_id ON users(id)");
        db.run("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
        db.run("CREATE INDEX IF NOT EXISTS idx_user_tasks_uid ON user_tasks(user_id, completed_at)");
        db.run("CREATE INDEX IF NOT EXISTS idx_transactions_uid ON transactions(user_id, status)");

        // Insert Admin User if not exists
        db.get("SELECT * FROM users WHERE role = 'admin'", async (err, row) => {
            if (!row) {
                const hashedPwd = await bcrypt.hash('admin123', 10);
                db.run(`INSERT INTO users (name, phone, email, password, balance, role) VALUES (?, ?, ?, ?, ?, ?)`, 
                    ['Admin', '01700000000', 'admin@jmj.com', hashedPwd, 0.0, 'admin']);
            }
        });

        // Insert some sample tasks
        db.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
            if (row && row.count === 0) {
                const stmt = db.prepare("INSERT INTO tasks (title, description, reward, type) VALUES (?, ?, ?, ?)");
                stmt.run("Math Quiz", "Solve basic math problems", 5.0, "quiz");
                stmt.run("Watch Video", "Watch full 3 min video", 10.0, "video");
                stmt.run("Like FB Page", "Like the official page", 2.0, "social");
                stmt.finalize();
            }
        });
    });
}

module.exports = db;
