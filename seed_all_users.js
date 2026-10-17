const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.serialize(() => {
    db.all('SELECT id FROM tasks', (err, tasks) => {
        if(tasks && tasks.length >= 4) {
            db.all('SELECT id FROM users', (err, users) => {
                if(users) {
                    const stmt2 = db.prepare('INSERT INTO user_tasks (user_id, task_id, completed_at) VALUES (?, ?, ?)');
                    const now = new Date();
                    users.forEach(user => {
                        stmt2.run(user.id, tasks[0].id, new Date(now.getTime() - 10*60000).toISOString()); // 10 mins ago
                        stmt2.run(user.id, tasks[1].id, new Date(now.getTime() - 45*60000).toISOString()); // 45 mins ago
                        stmt2.run(user.id, tasks[2].id, new Date(now.getTime() - 120*60000).toISOString()); // 2 hrs ago
                        stmt2.run(user.id, tasks[3].id, new Date(now.getTime() - 300*60000).toISOString()); // 5 hrs ago
                    });
                    stmt2.finalize();
                    console.log('Inserted real user tasks for all users!');
                }
            });
        }
    });
});
