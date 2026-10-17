const fs = require('fs');

let serverFile = 'server.js';
let content = fs.readFileSync(serverFile, 'utf8');

// The current logic has a hardcoded >= 20 limit check before getting the user's VIP plan.
// We need to move the VIP check FIRST, then check the limit.

const oldLogic = `db.get(\`SELECT COUNT(*) as count FROM user_tasks WHERE user_id = ? AND date(completed_at) = date('now', 'localtime')\`, [req.user.id], (err, row) => {
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

            db.run(\`UPDATE users SET balance = balance + ? WHERE id = ?\`, [dynamicReward, req.user.id], (err) => {`;

const newLogic = `
        db.get(\`SELECT vip_plan FROM users WHERE id = ?\`, [req.user.id], (err, user) => {
            if (err || !user) return res.status(404).json({ error: 'User not found' });
            
            let level = 0;
            if (user.vip_plan && user.vip_plan !== 'Free') {
                level = parseInt(user.vip_plan.replace('VIP ', '')) || 0;
            }
            
            const roiMap = { 0: 10, 1: 53, 2: 114.25, 3: 257.90, 4: 580, 5: 1341, 6: 3000 };
            const limitMap = { 0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14 };
            
            const maxTasks = limitMap[level] || 1;
            const dynamicReward = (roiMap[level] || 10) / maxTasks;

            db.get(\`SELECT COUNT(*) as count FROM user_tasks WHERE user_id = ? AND date(completed_at) = date('now', 'localtime')\`, [req.user.id], (err, row) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                // We add +10 just for today's testing flexibility in case they already hit it
                // Actually, let's just enforce it properly, but we will CLEAR their history via sqlite so they can test fresh.
                if (row.count >= maxTasks) return res.status(400).json({ error: 'Daily task limit reached for your VIP plan!' });

                db.run(\`UPDATE users SET balance = balance + ? WHERE id = ?\`, [dynamicReward, req.user.id], (err) => {`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(serverFile, content);
console.log('Fixed server.js limit logic.');
