const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

// Patch Login
const loginReplacement = \const ua = req.headers['user-agent'] || '';
        let deviceName = "Unknown Device";
        if(ua.includes("Windows")) deviceName = "Windows PC";
        else if(ua.includes("Mac")) deviceName = "Mac OS";
        else if(ua.includes("iPhone") || ua.includes("iPad")) deviceName = "Apple iOS Device";
        else if(ua.includes("Android")) deviceName = "Android Device";
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';

        db.run("INSERT INTO user_devices (user_id, token, device_name, ip_address) VALUES (?, ?, ?, ?)", [user.id, token, deviceName, ip], () => {
            res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, balance: user.balance, role: user.role } });
        });\;

server = server.replace("res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, balance: user.balance, role: user.role } });", loginReplacement);

// Patch Register
const regReplacement = \const ua = req.headers['user-agent'] || '';
            let deviceName = "Unknown Device";
            if(ua.includes("Windows")) deviceName = "Windows PC";
            else if(ua.includes("Mac")) deviceName = "Mac OS";
            else if(ua.includes("iPhone") || ua.includes("iPad")) deviceName = "Apple iOS Device";
            else if(ua.includes("Android")) deviceName = "Android Device";
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';

            db.run("INSERT INTO user_devices (user_id, token, device_name, ip_address) VALUES (?, ?, ?, ?)", [targetUser.id, token, deviceName, ip], () => {
                res.json({ token, user: { id: targetUser.id, name: targetUser.name, phone: targetUser.phone, email: targetUser.email, balance: targetUser.balance, role: targetUser.role } });
            });\;

server = server.replace("res.json({ token, user: { id: targetUser.id, name: targetUser.name, phone: targetUser.phone, email: targetUser.email, balance: targetUser.balance, role: targetUser.role } });", regReplacement);

// Add /api/devices endpoint
const devicesEndpoint = \
// Get Active Devices
app.get('/api/devices', authenticateToken, (req, res) => {
    db.all("SELECT id, device_name, ip_address, created_at, last_active, token FROM user_devices WHERE user_id = ? ORDER BY last_active DESC", [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        // Map over rows to tell the frontend which one is current, then strip the tokens
        const currentToken = req.headers['authorization']?.split(' ')[1];
        const devices = rows.map(r => {
            const isCurrent = r.token === currentToken;
            return {
                id: r.id,
                device_name: r.device_name,
                ip_address: r.ip_address,
                created_at: r.created_at,
                last_active: r.last_active,
                is_current: isCurrent
            };
        });
        res.json(devices);
    });
});

// Logout (Remove Device)
app.post('/api/logout', authenticateToken, (req, res) => {
    const currentToken = req.headers['authorization']?.split(' ')[1];
    db.run("DELETE FROM user_devices WHERE token = ?", [currentToken], () => {
        res.json({ success: true });
    });
});

// 3. Get User Profile\;

server = server.replace("// 3. Get User Profile", devicesEndpoint);

fs.writeFileSync('server.js', server);
console.log('Patched server.js for devices');
