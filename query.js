const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.serialize(() => {
    db.all("SELECT * FROM tasks", (err, rows) => console.log("Tasks:", rows));
    db.all("SELECT * FROM user_tasks", (err, rows) => console.log("User Tasks:", rows));
});
