const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.get("SELECT password FROM users WHERE email='ajom7016@gmail.com'", (err, row) => {
    if (err) console.error(err);
    else if (row) console.log("PASSWORD: " + row.password);
    else console.log("USER NOT FOUND");
});
db.close();
