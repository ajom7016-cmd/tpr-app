const fs = require('fs');

let serverFile = 'server.js';
let content = fs.readFileSync(serverFile, 'utf8');

const oldCompleteLogic = /db\.get\(\`SELECT COUNT\(\*\) as count FROM user_tasks WHERE user_id = \? AND date\(completed_at\) = date\('now', 'localtime'\)\`, \[req\.user\.id\], \(err, row\) => \{[\s\S]*?res\.json\(\{ message: 'Task completed successfully', reward: task\.reward \}\);\n\s*\}\);\n\s*\}\);\n\s*\}\);/;

const newCompleteLogic = `db.get(\`SELECT COUNT(*) as count FROM user_tasks WHERE user_id = ? AND date(completed_at) = date('now', 'localtime')\`, [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (row.count >= 20) return res.status(400).json({ error: 'Daily task limit reached' });

        db.get(\`SELECT vip_plan FROM users WHERE id = ?\`, [req.user.id], (err, user) => {
            if (err || !user) return res.status(404).json({ error: 'User not found' });
            
            let level = 0;
            if (user.vip_plan && user.vip_plan !== 'Free') {
                level = parseInt(user.vip_plan.replace('VIP ', '')) || 0;
            }
            
            const roiMap = { 0: 10, 1: 53, 2: 114.25, 3: 257.90, 4: 580, 5: 1341, 6: 3000 };
            const limitMap = { 0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14 };
            
            const dynamicReward = (roiMap[level] || 10) / (limitMap[level] || 1);

            db.run(\`UPDATE users SET balance = balance + ? WHERE id = ?\`, [dynamicReward, req.user.id], (err) => {
                if (err) return res.status(500).json({ error: 'Error updating balance' });
                db.run(\`INSERT INTO user_tasks (user_id, task_id) VALUES (?, ?)\`, [req.user.id, taskId]);
                db.run(\`INSERT INTO transactions (user_id, type, amount, status) VALUES (?, ?, ?, ?)\`, 
                    [req.user.id, 'reward', dynamicReward, 'completed']);
                res.json({ message: 'Task completed successfully', reward: dynamicReward });
            });
        });
    });`;

if (content.match(oldCompleteLogic)) {
    content = content.replace(oldCompleteLogic, newCompleteLogic);
    fs.writeFileSync(serverFile, content);
    console.log('Successfully updated server.js to use dynamic reward based on VIP plan.');
} else {
    console.log('Regex failed for server.js task complete.');
}
