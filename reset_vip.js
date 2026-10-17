const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.run(`UPDATE users SET vip_plan = 'Free' WHERE 1=1`, function(err) {
    if(err) console.log(err);
    else console.log('Reset all users VIP plans to Free');
});
