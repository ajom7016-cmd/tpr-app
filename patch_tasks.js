const fs = require('fs');

let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

const oldCompleteLogic = `app.post('/api/tasks/complete', authenticateToken, (req, res) => {
    const { taskId } = req.body;
    
    db.get(\`SELECT reward FROM tasks WHERE id = ?\`, [taskId], (err, task) => {
        if (err || !task) return res.status(404).json({ error: 'Task not found' });

        db.run(\`UPDATE users SET balance = balance + ? WHERE id = ?\`, [task.reward, req.user.id], (err) => {
            if (err) return res.status(500).json({ error: 'Error updating balance' });
            db.run(\`INSERT INTO user_tasks (user_id, task_id) VALUES (?, ?)\`, [req.user.id, taskId]);
            db.run(\`INSERT INTO transactions (user_id, type, amount, status) VALUES (?, ?, ?, ?)\`, 
                [req.user.id, 'task_reward', task.reward, 'completed']);
            res.json({ message: 'Task completed successfully', reward: task.reward });
        });
    });
});`;

const newCompleteLogic = `app.post('/api/tasks/complete', authenticateToken, (req, res) => {
    const { taskId } = req.body;
    
    // BUG FIX: Prevent infinite money glitch by checking if task was already completed
    db.get(\`SELECT id FROM user_tasks WHERE user_id = ? AND task_id = ?\`, [req.user.id, taskId], (err, existing) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (existing) return res.status(400).json({ error: 'Task already completed' });

        db.get(\`SELECT reward FROM tasks WHERE id = ?\`, [taskId], (err, task) => {
            if (err || !task) return res.status(404).json({ error: 'Task not found' });

            db.run(\`UPDATE users SET balance = balance + ? WHERE id = ?\`, [task.reward, req.user.id], (err) => {
                if (err) return res.status(500).json({ error: 'Error updating balance' });
                db.run(\`INSERT INTO user_tasks (user_id, task_id) VALUES (?, ?)\`, [req.user.id, taskId]);
                db.run(\`INSERT INTO transactions (user_id, type, amount, status) VALUES (?, ?, ?, ?)\`, 
                    [req.user.id, 'reward', task.reward, 'completed']);
                res.json({ message: 'Task completed successfully', reward: task.reward });
            });
        });
    });
});`;

// Replace if matched exactly. If not, try to replace based on signature.
if (content.includes("app.post('/api/tasks/complete'")) {
    // We'll replace the block manually with regex to be safe
    const regex = /app\.post\('\/api\/tasks\/complete', authenticateToken, \(req, res\) => \{[\s\S]*?res\.json\(\{ message: 'Task completed successfully', reward: task\.reward \}\);\s*\}\);\s*\}\);\s*\}\);/m;
    
    if (content.match(regex)) {
        content = content.replace(regex, newCompleteLogic);
        fs.writeFileSync(file, content);
        console.log('Fixed Infinite Money Bug in /api/tasks/complete');
    } else {
        console.log('Regex did not match exactly, checking alternative format.');
    }
}
