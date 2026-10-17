const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

const startIndex = server.indexOf('// Change Password');
const endIndex = server.indexOf('// Verify Password');

const newCode = \// Change Password
app.post('/api/change-password', authenticateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    db.get('SELECT password, password_changed_at FROM users WHERE id = ?', [req.user.id], async (err, user) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error' });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (user.password_changed_at) {
            const lastChanged = new Date(user.password_changed_at).getTime();
            const now = new Date().getTime();
            const daysSince = (now - lastChanged) / (1000 * 60 * 60 * 24);
            if (daysSince < 3) {
                return res.json({ success: false, error: 'Password can only be changed once every 3 days' });
            }
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) return res.json({ success: false, error: 'Incorrect current password' });

        const hashedNew = await bcrypt.hash(newPassword, 10);
        const isoDate = new Date().toISOString();
        db.run('UPDATE users SET password = ?, password_changed_at = ? WHERE id = ?', [hashedNew, isoDate, req.user.id], function(err) {
            if (err) return res.status(500).json({ success: false, error: 'Failed to update password' });
            res.json({ success: true, message: 'Password changed successfully' });
        });
    });
});

\;

server = server.substring(0, startIndex) + newCode + server.substring(endIndex);
fs.writeFileSync('server.js', server);
console.log('Fixed change password chunk');
