const fs = require('fs');

let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

// We need to modify /api/profile to include today's completed tasks count.
// Original:
// app.get('/api/profile', authenticateToken, (req, res) => {
//     db.get(`SELECT id, name, phone, email, balance, role, vip_plan, total_referrals, total_tasks, ...
// We can change it to also do a subquery or a second query to get today's tasks.

const oldProfileLogic = /app\.get\('\/api\/profile', authenticateToken, \(req, res\) => \{\s*db\.get\([\s\S]*?res\.json\(user\);\s*\}\);\s*\}\);/;

const newProfileLogic = `app.get('/api/profile', authenticateToken, (req, res) => {
    db.get(\`SELECT id, name, phone, email, balance, role, vip_plan, total_referrals, total_tasks, 
(withdraw_pin IS NOT NULL) as has_pin, password_changed_at, pin_changed_at, profile_changed_at FROM users WHERE id = ?\`, [req.user.id], (err, user) => {
        if (err || !user) return res.status(500).json({ error: 'Database error' });
        
        // Also fetch today's completed task count
        db.get(\`SELECT COUNT(*) as today_tasks FROM user_tasks WHERE user_id = ? AND date(completed_at) = date('now', 'localtime')\`, [req.user.id], (err, row) => {
            user.today_tasks = row ? row.today_tasks : 0;
            res.json(user);
        });
    });
});`;

if (content.match(oldProfileLogic)) {
    content = content.replace(oldProfileLogic, newProfileLogic);
    fs.writeFileSync(file, content);
    console.log('Successfully updated server.js to return today_tasks in profile!');
} else {
    console.log('Regex failed for /api/profile');
}
