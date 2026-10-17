const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    db.run("DELETE FROM transactions", (err) => {
        if (err) console.error(err);
        else console.log("Cleared transactions.");
    });
    db.run("DELETE FROM user_tasks", (err) => {
        if (err) console.error(err);
        else console.log("Cleared user_tasks.");
    });
});

db.close();
