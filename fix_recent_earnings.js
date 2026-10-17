const fs = require('fs');
let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

const newRecentEarnings = `app.get('/api/recent-earnings', authenticateToken, (req, res) => {
    db.get(\`SELECT vip_plan FROM users WHERE id = ?\`, [req.user.id], (err, user) => {
        let level = 0;
        if (user && user.vip_plan && user.vip_plan !== 'Free') {
            level = parseInt(user.vip_plan.replace('VIP ', '')) || 0;
        }
        
        const roiMap = { 0: 10, 1: 53, 2: 114.25, 3: 257.90, 4: 580, 5: 1341, 6: 3000 };
        const limitMap = { 0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14 };
        const maxTasks = limitMap[level] || 1;
        const dynamicReward = (roiMap[level] || 10) / maxTasks;

        db.all(\`
            SELECT t.title, count(ut.id) as count, MAX(ut.completed_at) as completed_at, t.type 
            FROM user_tasks ut
            JOIN tasks t ON ut.task_id = t.id
            WHERE ut.user_id = ?
            GROUP BY t.type, t.title
            ORDER BY completed_at DESC
            LIMIT 4
        \`, [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            const finalRows = rows.map(r => ({
                ...r,
                reward: parseFloat((r.count * dynamicReward).toFixed(2))
            }));
            res.json(finalRows);
        });
    });
});`;

content = content.replace(
    /app\.get\('\/api\/recent-earnings', authenticateToken, \(req, res\) => \{[\s\S]*?\}\);\s*\n\s*\/\/ 5\. Complete a Task/,
    `${newRecentEarnings}\n\n// 5. Complete a Task`
);

fs.writeFileSync(file, content);
console.log('Fixed /api/recent-earnings logic');
