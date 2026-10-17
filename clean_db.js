const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.run('DELETE FROM users WHERE role != "admin"', function(err) {
    if (err) console.error(err);
    else console.log('Deleted old test users');
});
