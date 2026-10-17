process.env.TZ = 'Asia/Dhaka';
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const compression = require('compression');
const db = require('./database');
const nodemailer = require('nodemailer');
const { GoogleGenAI } = require('@google/genai');

// High-Concurrency API Key Rotation System from Environment Variables
const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "AIzaSy_TPR_DEFAULT_SECURE_KEY";
const aiClients = rawKeys.split(',').map(k => new GoogleGenAI({ apiKey: k.trim() }));
let currentClientIndex = 0;

function getAiClient() {
    const client = aiClients[currentClientIndex];
    currentClientIndex = (currentClientIndex + 1) % aiClients.length;
    return client;
}

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'jmj_super_secret_key_for_jwt_2026';

// --- EMAIL SETTINGS ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ajom01870@gmail.com',
        pass: 'ghdcrntslpayrrie'
    }
});

app.use(cors());
app.use(compression({
    level: 6,
    threshold: 1024
}));
app.use(express.json());

// High-Performance Static Asset Cache (Images, Banners, Audio, Icons)
app.use('/assets', express.static(path.join(__dirname, 'public/assets'), {
    maxAge: '7d',
    etag: true,
    lastModified: true,
    setHeaders: (res) => {
        res.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
}));

// Public Static Files with Smart Cache Policy
app.use(express.static(path.join(__dirname, 'public'), {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html') || filePath.endsWith('sw.js')) {
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
        } else if (filePath.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|js|css)$/)) {
            res.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
        } else {
            res.set('Cache-Control', 'no-store, no-cache');
        }
    }
}));

// --- AUTHENTICATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// App Download / Landing Page Routing
app.get(['/download', '/landing', '/landing.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public/landing.html'));
});

// Helper: Generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

app.post('/api/send-otp', (req, res) => {
    const { email, phone, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // First check if name, email or phone is already registered to prevent failure later
    db.all('SELECT name, email, phone FROM users WHERE email = ? OR phone = ? OR name = ?', [email, phone || '', name || ''], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (rows && rows.length > 0) {
            const errors = [];
            for (let row of rows) {
                if (row.name === name && !errors.some(e => e.field === 'name')) errors.push({ field: 'name', error: 'This Full Name is already taken.' });
                if (row.email === email && !errors.some(e => e.field === 'email')) errors.push({ field: 'email', error: 'This Email Address is already in use.' });
                if (row.phone === phone && !errors.some(e => e.field === 'phone')) errors.push({ field: 'phone', error: 'This Phone Number is already registered.' });
            }
            if (errors.length > 0) {
                return res.status(400).json({ multiple: true, errors });
            }
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 3 * 60000); // 3 minutes

        db.run(`INSERT INTO otp_store (contact, code, expires_at) VALUES (?, ?, ?)`, [email, otp, expiresAt.toISOString()], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            // Print to console for testing
            console.log(`[TESTING OTP] Email: ${email} | Code: ${otp}`);

            // Return success immediately to make UI lightning fast
            res.json({ message: 'OTP sent to email successfully', testMode: true });

            const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fafafa; text-align: center;">
                <div style="margin: 0 auto 20px auto; width: 80px; height: 80px; background: linear-gradient(135deg, #ffe4e8, #dff1f8, #dcffdc); border-radius: 20px; display: table;">
                    <div style="display: table-cell; vertical-align: middle; color: white; font-size: 30px; font-weight: bold; font-family: sans-serif; text-shadow: 1px 1px 3px rgba(0,0,0,0.1);">TPR</div>
                </div>
                <h2 style="color: #333; margin-bottom: 10px;">Verification Code</h2>
                <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Use the following 6-digit code to complete your verification process. This code will expire in 3 minutes.</p>
                <div style="background-color: #ffffff; padding: 15px 30px; border-radius: 8px; font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #ea580c; border: 2px solid #eee; display: inline-block;">
                    ${otp}
                </div>
                <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
            `;

            // Try to send real email in background
            const mailOptions = {
                from: 'TPR <ajom01870@gmail.com>',
                to: email,
                subject: 'TPR - Verification Code',
                text: `Your verification code is: ${otp}. It will expire in 3 minutes.`,
                html: emailHtml
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Nodemailer error:', error.message);
                } else {
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                }
            });
        });
    });
});

// Send Forgot Password OTP
app.post('/api/forgot-otp', (req, res) => {
    const { contact } = req.body;
    if (!contact) return res.status(400).json({ error: 'Contact is required' });

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [contact], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'No account found with this email!' });

        // If user exists, send OTP
        if (true) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 3 * 60000).toISOString();
            
            db.run(`INSERT INTO otp_store (contact, code, expires_at) VALUES (?, ?, ?)`, [contact, otp, expiresAt], function(err) {
                if (err) return res.status(500).json({ error: 'Failed to store OTP' });
                
                const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fafafa; text-align: center;">
                    <div style="margin: 0 auto 20px auto; width: 80px; height: 80px; background: linear-gradient(135deg, #ffe4e8, #dff1f8, #dcffdc); border-radius: 20px; display: table;">
                        <div style="display: table-cell; vertical-align: middle; color: white; font-size: 30px; font-weight: bold; font-family: sans-serif; text-shadow: 1px 1px 3px rgba(0,0,0,0.1);">TPR</div>
                    </div>
                    <h2 style="color: #333; margin-bottom: 10px;">Password Reset Code</h2>
                    <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Use the following 6-digit code to reset your password. This code will expire in 3 minutes.</p>
                    <div style="background-color: #ffffff; padding: 15px 30px; border-radius: 8px; font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #ea580c; border: 2px solid #eee; display: inline-block;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
                `;

                const mailOptions = {
                    from: 'TPR <ajom01870@gmail.com>',
                    to: contact,
                    subject: 'TPR - Password Reset Code',
                    text: `Your verification code is: ${otp}. It will expire in 3 minutes.`,
                    html: emailHtml
                };
                
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) console.log('Nodemailer error:', error.message);
                });
                
                res.json({ message: 'OTP sent to email successfully' });
            });
        } else {
            // For now, phone OTP is simulated
            res.json({ message: 'OTP simulated for phone' });
        }
    });
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, code } = req.body;
    db.get(`SELECT * FROM otp_store WHERE contact = ? ORDER BY id DESC LIMIT 1`, [email], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(400).json({ error: 'No OTP found!' });
        
        if (row.code !== code) return res.status(400).json({ error: 'Invalid OTP!' });
        
        const now = new Date();
        const expiry = new Date(row.expires_at);
        if (now > expiry) return res.status(400).json({ error: 'Expired OTP!' });

        res.json({ message: 'OTP verified successfully' });
    });
});

// 1. Register User (Updated to handle email/phone & referral)
app.post('/api/register', async (req, res) => {
    const { name, phone, email, password, referral_code } = req.body;
    if(!name || !phone || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    // Strong Password check
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!pwRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters, with 1 uppercase and 1 number.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Check uniqueness manually
        db.get('SELECT name, phone, email FROM users WHERE phone = ? OR email = ? OR name = ?', [phone, email, name], (err, row) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            if (row) {
                if (row.name === name) return res.status(400).json({ error: 'This Full Name is already taken.' });
                if (row.phone === phone) return res.status(400).json({ error: 'This Phone Number is already registered.' });
                if (row.email === email) return res.status(400).json({ error: 'This Email Address is already in use.' });
            }

            let cleanRef = (referral_code || '').trim().toUpperCase();
            if (cleanRef.includes('REF=')) {
                cleanRef = cleanRef.split('REF=')[1].split('&')[0].trim();
            } else if (cleanRef.includes('CODE=')) {
                cleanRef = cleanRef.split('CODE=')[1].split('&')[0].trim();
            }
            if (cleanRef) {
                db.get('SELECT id, name, referral_code FROM users WHERE UPPER(referral_code) = ?', [cleanRef], (err, inviter) => {
                    const validReferredBy = inviter ? inviter.referral_code : cleanRef;
                    insertUser(validReferredBy, inviter);
                });
            } else {
                insertUser(null, null);
            }
        });

        function insertUser(validReferredBy, inviter) {
            const newRefCode = 'TPR' + Math.random().toString(36).substring(2, 7).toUpperCase();

            db.run(`INSERT INTO users (name, phone, email, password, referral_code, referred_by) VALUES (?, ?, ?, ?, ?, ?)`, 
                [name, phone, email, hashedPassword, newRefCode, validReferredBy], function(err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                const userId = this.lastID;

                // Increment inviter's total referrals if valid
                if (inviter) {
                    db.run('UPDATE users SET total_referrals = total_referrals + 1 WHERE id = ?', [inviter.id]);
                }

                const token = jwt.sign({ id: userId, phone: phone, role: 'user' }, SECRET_KEY, { expiresIn: '24h' });
                
                const ua = req.headers['user-agent'] || '';
                let deviceName = "Unknown Device";
                if(ua.includes("Windows")) deviceName = "Windows PC";
                else if(ua.includes("Mac")) deviceName = "Mac OS";
                else if(ua.includes("iPhone") || ua.includes("iPad")) deviceName = "Apple iOS Device";
                else if(ua.includes("Android")) deviceName = "Android Device";
                const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown IP';

                db.run("INSERT INTO user_devices (user_id, token, device_name, ip_address) VALUES (?, ?, ?, ?)", [userId, token, deviceName, ip], () => {
                    res.status(201).json({ 
                        message: 'User registered successfully', 
                        token, 
                        user: { id: userId, name, phone, email, balance: 0, role: 'user', referral_code: newRefCode } 
                    });
                });
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Login User (Updated to handle email/phone)
app.post('/api/login', (req, res) => {
    const contact = req.body.contact || req.body.phone || req.body.email;
    const { password } = req.body;

    db.get(`SELECT * FROM users WHERE phone = ? OR email = ?`, [contact, contact], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'No account found with this email!' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid password!' });

        if (user.status === 'banned') {
            return res.status(403).json({ error: 'Your account has been temporarily suspended. Please contact admin for support.' });
        }

        const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        
        const ua = req.headers['user-agent'] || '';
        let deviceName = "Unknown Device";
        if(ua.includes("Windows")) deviceName = "Windows PC";
        else if(ua.includes("Mac")) deviceName = "Mac OS";
        else if(ua.includes("iPhone") || ua.includes("iPad")) deviceName = "Apple iOS Device";
        else if(ua.includes("Android")) deviceName = "Android Device";
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown IP';

        db.run("INSERT INTO user_devices (user_id, token, device_name, ip_address) VALUES (?, ?, ?, ?)", [user.id, token, deviceName, ip], () => {
            res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, balance: user.balance, role: user.role } });
        });
    });
});

// Google Login
app.post('/api/google-login', async (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        let targetUser = user;
        if (!user) {
            const hashedPwd = await bcrypt.hash('google_oauth_dummy', 10);
            const dummyPhone = 'G-' + Date.now().toString().slice(-8); 
            
            await new Promise((resolve, reject) => {
                db.run(`INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)`, 
                [name || 'Google User', dummyPhone, email, hashedPwd], function(err) {
                    if (err) return reject(err);
                    targetUser = { id: this.lastID, name: name || 'Google User', phone: dummyPhone, email, balance: 0.0, role: 'user' };
                    resolve();
                });
            }).catch(() => { return res.status(500).json({ error: 'Database error on insert' }); });
        }
        
        if (!targetUser) return; // Prevent proceeding if insert failed

        if (targetUser.status === 'banned') {
            return res.status(403).json({ error: 'Your account has been temporarily suspended.' });
        }

        const token = jwt.sign({ id: targetUser.id, phone: targetUser.phone, role: targetUser.role }, SECRET_KEY, { expiresIn: '24h' });
        
        const ua = req.headers['user-agent'] || '';
        let deviceName = "Unknown Device";
        if(ua.includes("Windows")) deviceName = "Windows PC";
        else if(ua.includes("Mac")) deviceName = "Mac OS";
        else if(ua.includes("iPhone") || ua.includes("iPad")) deviceName = "Apple iOS Device";
        else if(ua.includes("Android")) deviceName = "Android Device";
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown IP';

        db.run("INSERT INTO user_devices (user_id, token, device_name, ip_address) VALUES (?, ?, ?, ?)", [targetUser.id, token, deviceName, ip], () => {
            res.json({ token, user: { id: targetUser.id, name: targetUser.name, phone: targetUser.phone, email: targetUser.email, balance: targetUser.balance, role: targetUser.role } });
        });
    });
});

// Get Active Devices
app.get('/api/devices', authenticateToken, (req, res) => {
    db.all("SELECT id, device_name, ip_address, created_at, last_active, token FROM user_devices WHERE user_id = ? ORDER BY last_active DESC", [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
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

// 3. Get User Profile
app.get('/api/profile', authenticateToken, (req, res) => {
    db.get(`SELECT id, name, phone, email, balance, role, status, vip_plan, total_referrals, total_tasks, referral_code, referred_by,
(withdraw_pin IS NOT NULL) as has_pin, password_changed_at, pin_changed_at, profile_changed_at FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Account not found or deleted' });
        if (user.status === 'banned') return res.status(403).json({ error: 'Account is banned', is_banned: true });

        // Ensure user has a permanent referral code
        if (!user.referral_code) {
            const generatedRef = 'TPR' + (1000 + user.id) + Math.random().toString(36).substring(2, 5).toUpperCase();
            user.referral_code = generatedRef;
            db.run('UPDATE users SET referral_code = ? WHERE id = ?', [generatedRef, user.id]);
        }
        
        // Also fetch today's completed task count & free plan limits
        db.get(`SELECT COUNT(*) as today_tasks FROM user_tasks WHERE user_id = ? AND date(completed_at, 'localtime') = date('now', 'localtime')`, [req.user.id], (err, row) => {
            user.today_tasks = row ? row.today_tasks : 0;
            
            if (!user.vip_plan || user.vip_plan === 'Free') {
                db.get(`SELECT COUNT(DISTINCT date(completed_at, 'localtime')) as free_days_worked, COUNT(*) as free_tasks_total FROM user_tasks WHERE user_id = ?`, [req.user.id], (err, freeRow) => {
                    const days = freeRow ? freeRow.free_days_worked : 0;
                    const tasksTotal = freeRow ? freeRow.free_tasks_total : 0;
                    user.free_days_worked = days;
                    user.free_tasks_total = tasksTotal;
                    // If user already completed 2 days or 2 free tasks, free plan is permanently locked until VIP is purchased
                    user.is_free_locked = (days >= 2 || tasksTotal >= 2);
                    res.json(user);
                });
            } else {
                user.is_free_locked = false;
                user.free_days_worked = 0;
                res.json(user);
            }
        });
    });
});

// 4. Get User Referral & Team Details
app.get('/api/referrals', authenticateToken, (req, res) => {
    db.get('SELECT id, referral_code, total_referrals, balance FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err || !user) return res.status(500).json({ error: 'User not found' });
        
        if (!user.referral_code) {
            const generatedRef = 'TPR' + (1000 + user.id) + Math.random().toString(36).substring(2, 5).toUpperCase();
            user.referral_code = generatedRef;
            db.run('UPDATE users SET referral_code = ? WHERE id = ?', [generatedRef, user.id]);
        }

        db.all('SELECT name, phone, vip_plan, created_at FROM users WHERE UPPER(referred_by) = UPPER(?) ORDER BY id DESC', [user.referral_code], (err, team) => {
            const teamList = (team || []).map(m => ({
                name: (m.name || 'User').substring(0, 3) + '***',
                phone: (m.phone || '01700000000').substring(0, 3) + '****' + (m.phone || '000').slice(-3),
                vip_plan: m.vip_plan || 'Free',
                joined: m.created_at
            }));

            const refCount = Math.max(teamList.length, user.total_referrals || 0);

            // Fetch actual referral commission earnings from transactions table
            db.get(`SELECT COALESCE(SUM(amount), 0) as total_referral_earnings FROM transactions WHERE user_id = ? AND type = 'referral'`, [user.id], (err, earnRow) => {
                const realEarnings = (earnRow && earnRow.total_referral_earnings) ? earnRow.total_referral_earnings : 0;

                res.json({
                    referral_code: user.referral_code,
                    total_team: refCount,
                    total_earnings: realEarnings,
                    team: teamList
                });
            });
        });
    });
});

// GET User Banks
app.get('/api/banks', authenticateToken, (req, res) => {
    db.all(`SELECT id, provider, account_number, is_default FROM user_banks WHERE user_id = ? ORDER BY is_default DESC, id DESC`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows || []);
    });
});

// POST Add User Bank
app.post('/api/banks', authenticateToken, async (req, res) => {
    const { provider, account_number, auth_value } = req.body;
    if (!provider || !account_number || !auth_value) return res.status(400).json({ error: 'Missing fields' });

    db.get(`SELECT password, withdraw_pin FROM users WHERE id = ?`, [req.user.id], async (err, user) => {
        if (err || !user) return res.status(500).json({ error: 'User not found' });
        
        let isAuthorized = false;
        
        if (user.withdraw_pin) {
            // Verify Withdraw PIN
            if (user.withdraw_pin === auth_value) isAuthorized = true;
        } else {
            // Verify Login Password
            isAuthorized = await bcrypt.compare(auth_value, user.password);
        }

        if (!isAuthorized) {
            return res.status(401).json({ error: user.withdraw_pin ? 'Incorrect Withdraw PIN' : 'Incorrect Login Password' });
        }

        // Check if any default exists
        db.get(`SELECT COUNT(*) as count FROM user_banks WHERE user_id = ?`, [req.user.id], (err, row) => {
            const is_default = (row && row.count === 0) ? 1 : 0;
            
            db.run(`INSERT INTO user_banks (user_id, provider, account_number, is_default) VALUES (?, ?, ?, ?)`, 
                [req.user.id, provider, account_number, is_default], function(err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({ success: true, message: 'Bank account added successfully' });
            });
        });
    });
});


// Update User Profile
app.post('/api/update-profile', authenticateToken, (req, res) => {
    const { name, email } = req.body;
    
    // Check 3-day lock
    db.get(`SELECT profile_changed_at FROM users WHERE id = ?`, [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        if (row && row.profile_changed_at) {
            const lastChanged = new Date(row.profile_changed_at);
            const now = new Date();
            const diffTime = Math.abs(now - lastChanged);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 3) {
                return res.status(403).json({ error: `You can change your profile again in ${4 - diffDays} day(s)` });
            }
        }

        db.run("UPDATE users SET name = ?, email = ?, profile_changed_at = CURRENT_TIMESTAMP WHERE id = ?", [name, email, req.user.id], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed: users.email')) {
                    return res.status(400).json({ error: 'Email is already in use by another account' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true, message: 'Profile updated successfully' });
        });
    });
});

// Change Password
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

// Verify Password
app.post('/api/verify-password', authenticateToken, (req, res) => {
    const { password } = req.body;
    db.get('SELECT password FROM users WHERE id = ?', [req.user.id], async (err, user) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error' });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.json({ success: false, error: 'Incorrect current password' });
        
        res.json({ success: true });
    });
});

// Set/Update Withdrawal PIN
app.post('/api/set-pin', authenticateToken, (req, res) => {
    const { currentPin, newPin } = req.body;
    db.get(`SELECT withdraw_pin, pin_changed_at FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ success: false, error: 'Database error' });
        
        if (user.pin_changed_at) {
            const lastChanged = new Date(user.pin_changed_at).getTime();
            const now = new Date().getTime();
            const daysSince = (now - lastChanged) / (1000 * 60 * 60 * 24);
            if (daysSince < 3) {
                return res.json({ success: false, error: 'PIN can only be changed once every 3 days' });
            }
        }

        if (user.withdraw_pin && user.withdraw_pin !== currentPin) {
            return res.json({ success: false, error: 'Incorrect current PIN' });
        }
        
        const isoDate = new Date().toISOString();
        db.run(`UPDATE users SET withdraw_pin = ?, pin_changed_at = ? WHERE id = ?`, [newPin, isoDate, req.user.id], (err) => {
            if (err) return res.status(500).json({ success: false, error: 'Database error' });
            res.json({ success: true, message: 'PIN updated successfully' });
        });
    });
});

// 4. Get Tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM tasks`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Get Recent Earnings
app.get('/api/recent-earnings', authenticateToken, (req, res) => {
    db.get(`SELECT vip_plan FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        let level = 0;
        if (user && user.vip_plan && user.vip_plan !== 'Free') {
            level = parseInt(user.vip_plan.replace('VIP ', '')) || 0;
        }
        
        const roiMap = { 0: 10, 1: 53, 2: 114.25, 3: 257.90, 4: 580, 5: 1341, 6: 3000 };
        const limitMap = { 0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14 };
        const maxTasks = limitMap[level] || 1;
        const dynamicReward = (roiMap[level] || 10) / maxTasks;

        db.all(`
            SELECT t.title, count(ut.id) as count, MAX(ut.completed_at) as completed_at, t.type 
            FROM user_tasks ut
            JOIN tasks t ON ut.task_id = t.id
            WHERE ut.user_id = ?
            GROUP BY t.type, t.title
            ORDER BY completed_at DESC
            LIMIT 4
        `, [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            const finalRows = rows.map(r => ({
                ...r,
                reward: parseFloat((r.count * dynamicReward).toFixed(2))
            }));
            res.json(finalRows);
        });
    });
});

// 5. Complete a Task
app.post('/api/tasks/complete', authenticateToken, (req, res) => {
    const { taskId } = req.body;
    if (!taskId) return res.status(400).json({ error: 'Task ID is required' });

    db.get(`SELECT vip_plan FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        
        let level = 0;
        if (user.vip_plan && user.vip_plan !== 'Free') {
            level = parseInt(user.vip_plan.replace('VIP ', '')) || 0;
        }

        // FREE PLAN (Level 0): Exactly 2 days maximum, 1 task per day = ৳50 x 2 = ৳100 total
        if (level === 0) {
            db.get(`SELECT COUNT(DISTINCT date(completed_at, 'localtime')) as distinct_days, COUNT(*) as total_tasks FROM user_tasks WHERE user_id = ?`, [req.user.id], (err, freeCheck) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                const distinctDays = freeCheck ? freeCheck.distinct_days : 0;
                const totalTasks = freeCheck ? freeCheck.total_tasks : 0;

                db.get(`SELECT COUNT(*) as today_count FROM user_tasks WHERE user_id = ? AND date(completed_at, 'localtime') = date('now', 'localtime')`, [req.user.id], (err, todayCheck) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    const todayCount = todayCheck ? todayCheck.today_count : 0;

                    if (todayCount >= 1) {
                        return res.status(400).json({ error: 'Today\'s free task is completed! Please wait for tomorrow\'s task.' });
                    }

                    // Check lifetime lock: if user already completed tasks on 2 distinct days OR 2 tasks total on Free plan
                    if (distinctDays >= 2 || totalTasks >= 2) {
                        return res.status(403).json({ 
                            error: 'Your 2-day Free Plan (৳100) has expired! Please upgrade to a VIP plan to unlock unlimited tasks.',
                            is_free_locked: true
                        });
                    }

                    // Free task reward: ৳50
                    executeTask(req.user.id, taskId, 50);
                });
            });
        } else {
            // VIP PLANS (Level 1 to 6)
            const roiMap = { 1: 53, 2: 114.25, 3: 257.90, 4: 580, 5: 1341, 6: 3000 };
            const limitMap = { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14 };

            const maxTasks = limitMap[level] || 4;
            const dynamicReward = (roiMap[level] || 53) / maxTasks;

            db.get(`SELECT COUNT(*) as count FROM user_tasks WHERE user_id = ? AND date(completed_at, 'localtime') = date('now', 'localtime')`, [req.user.id], (err, row) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                if (row.count >= maxTasks) {
                    return res.status(400).json({ error: 'Daily task limit reached for your VIP plan!' });
                }

                executeTask(req.user.id, taskId, dynamicReward);
            });
        }

        function executeTask(userId, tId, rewardAmount) {
            db.run(`UPDATE users SET balance = balance + ?, total_tasks = total_tasks + 1 WHERE id = ?`, [rewardAmount, userId], (err) => {
                if (err) return res.status(500).json({ error: 'Error updating balance' });
                db.run(`INSERT INTO user_tasks (user_id, task_id) VALUES (?, ?)`, [userId, tId]);
                db.get(`SELECT title FROM tasks WHERE id = ?`, [tId], (err, taskRow) => {
                    const taskTitle = taskRow ? taskRow.title : 'Reward';
                    db.run(`INSERT INTO transactions (user_id, type, amount, method, status) VALUES (?, 'reward', ?, ?, 'completed')`, 
                        [userId, rewardAmount, taskTitle]);
                });
                res.json({ message: 'Task completed successfully', reward: rewardAmount });
            });
        }
    });
});

// 7. Get Transaction History

// Process Withdrawal
app.post('/api/withdraw', authenticateToken, (req, res) => {
    const { amount, provider, account_number } = req.body;
    const numAmount = parseFloat(amount);
    
    if (!numAmount || isNaN(numAmount) || numAmount < 150) {
        return res.status(400).json({ error: 'Minimum withdrawal amount is ৳150.' });
    }
    if (!provider) {
        return res.status(400).json({ error: 'Please select a payment method.' });
    }

    db.get(`SELECT id, balance, created_at FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) return res.status(500).json({ error: 'Database error' });
        
        if (user.balance < numAmount) {
            return res.status(400).json({ error: 'Insufficient balance in your account.' });
        }

        const now = Date.now();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

        // Rule 1: Account must be at least 3 days old
        if (user.created_at) {
            const userCreatedAt = new Date(user.created_at.replace(' ', 'T') + 'Z').getTime();
            const diffFromRegMs = now - userCreatedAt;
            if (diffFromRegMs < threeDaysMs) {
                const remainingHours = Math.ceil((threeDaysMs - diffFromRegMs) / (1000 * 60 * 60));
                return res.status(400).json({ 
                    error: `Withdrawals are available 3 days after account creation. Please wait ${remainingHours} more hours.` 
                });
            }
        }

        // Rule 2: At least 3 days between withdrawals
        db.get(`SELECT created_at FROM transactions WHERE user_id = ? AND type = 'withdraw' AND status != 'rejected' ORDER BY created_at DESC LIMIT 1`, [req.user.id], (err, lastW) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (lastW && lastW.created_at) {
                const lastWTime = new Date(lastW.created_at.replace(' ', 'T') + 'Z').getTime();
                const diffSinceLastMs = now - lastWTime;
                if (diffSinceLastMs < threeDaysMs) {
                    const remainingHours = Math.ceil((threeDaysMs - diffSinceLastMs) / (1000 * 60 * 60));
                    return res.status(400).json({ 
                        error: `Withdrawals are allowed once every 3 days. Please wait ${remainingHours} more hours.` 
                    });
                }
            }

            db.get(`SELECT account_number FROM user_banks WHERE user_id = ? AND provider = ? ORDER BY is_default DESC, id DESC LIMIT 1`, [req.user.id, provider], (err, bRow) => {
                const finalAcc = account_number || (bRow ? bRow.account_number : '');
                const methodString = finalAcc ? `${provider} (${finalAcc})` : provider;

                if (account_number && (!bRow || !bRow.account_number)) {
                    db.run(`INSERT INTO user_banks (user_id, provider, account_number, is_default) VALUES (?, ?, ?, 1)`, [req.user.id, provider, account_number]);
                }

                db.run(`UPDATE users SET balance = balance - ? WHERE id = ?`, [numAmount, req.user.id], function(err) {
                    if (err) return res.status(500).json({ error: 'Error updating balance' });

                    db.run(`INSERT INTO transactions (user_id, type, amount, method, status) VALUES (?, 'withdraw', ?, ?, 'pending')`, 
                        [req.user.id, numAmount, methodString], function(err) {
                        if (err) return res.status(500).json({ error: 'Error creating transaction record' });
                        
                        res.json({ message: 'Withdrawal request submitted successfully!', newBalance: user.balance - numAmount });
                    });
                });
            });
        });
    });
});

app.get('/api/transactions', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// --- ADMIN ROUTES ---
app.get('/api/admin/withdrawals', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.all(`SELECT t.*, u.phone as user_phone, u.name as user_name FROM transactions t JOIN users u ON t.user_id = u.id WHERE t.type = 'withdraw' ORDER BY t.created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

app.post('/api/admin/withdrawals/:id/approve', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.run(`UPDATE transactions SET status = 'completed' WHERE id = ? AND type = 'withdraw'`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Withdrawal approved successfully' });
    });
});

// Admin Reject & Refund Withdrawal
app.post('/api/admin/withdrawals/:id/reject', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const txId = req.params.id;

    db.get("SELECT * FROM transactions WHERE id = ? AND type = 'withdraw'", [txId], (err, tx) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!tx) return res.status(404).json({ error: 'Transaction not found' });
        if (tx.status !== 'pending') return res.status(400).json({ error: 'This request has already been ' + tx.status });

        // Refund the amount back to user's balance
        db.run("UPDATE users SET balance = balance + ? WHERE id = ?", [tx.amount, tx.user_id], (err) => {
            if (err) return res.status(500).json({ error: 'Failed to refund user balance' });

            // Mark withdrawal transaction as rejected
            db.run("UPDATE transactions SET status = 'rejected' WHERE id = ?", [txId], (err) => {
                if (err) return res.status(500).json({ error: 'Failed to update transaction' });

                console.log(`[Withdrawal] Rejected & Refunded ৳${tx.amount} to User #${tx.user_id}`);
                res.json({ success: true, message: `৳${tx.amount} has been refunded to the user\'s account!` });
            });
        });
    });
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.all(`SELECT id, name, phone, email, balance, role, status, vip_plan, created_at FROM users ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

app.post('/api/admin/tasks', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { title, description, reward, type } = req.body;
    db.run(`INSERT INTO tasks (title, description, reward, type) VALUES (?, ?, ?, ?)`, [title, description, reward, type], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Task added successfully', taskId: this.lastID });
    });
});

app.delete('/api/admin/tasks/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.run(`DELETE FROM tasks WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Task deleted successfully' });
    });
});

// 8. AI Support Chat Endpoint
const SYSTEM_PROMPT = `
You are the TPR AI Assistant, a highly advanced, ultra-intelligent, and deeply researched assistant for the TPR app.
You must speak Bengali fluently, smartly, and professionally.
You possess extreme analytical power to understand the user's core problem and provide accurate, detailed, and well-explained solutions.
DO NOT call the app "TPR Premium". Just call it "TPR" or "TPR App".

Rules of the TPR app (Explain these details perfectly if the user asks):
1. About TPR: TPR is an online platform where users can earn money daily by completing simple tasks.
2. Withdraw: To withdraw money, the user's balance must be at least ৳100. Users can withdraw via Bkash or Nagad from their Profile. Withdrawals usually take 24 hours.
3. Deposit/Recharge: To add money, go to the VIP section and click Deposit. Bkash/Nagad deposits take 5-10 minutes.
4. VIP Plans (Important):
   - Free Plan: Price ৳0, Daily Income ৳10.
   - VIP 1: Price ৳1,699, Daily Income ৳53.
   - VIP 2: Price ৳3,199, Daily Income ৳114.25.
   - VIP 3 (Popular): Price ৳6,190, Daily Income ৳257.90.
   - VIP 4, VIP 5, VIP 6: Available for higher daily earnings. Upgrading to higher VIPs requires depositing money.
5. Tasks: Users earn money by completing daily tasks (e.g., YouTube/Facebook). Go to the Tasks section to complete them. Higher VIP plans get more daily tasks and higher income per task.
6. Referrals: Invite friends (refer) from the Profile section to earn a 10% commission on their earnings.
7. Security: Users can set up 2FA, PIN, and Biometrics in the Security section for maximum account safety.
`;

app.post('/api/support/chat', authenticateToken, async (req, res) => {
    const { message, imageBase64 } = req.body;
    if (!message && !imageBase64) return res.status(400).json({ error: 'Message or image is required' });

    let contents = [];
    if (imageBase64) {
        const match = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*?,(.*)/);
        if (match && match.length === 3) {
            contents.push({
                inlineData: { mimeType: match[1], data: match[2] }
            });
        }
    }
    if (message) contents.push(message);

    let success = false;
    let retries = 3; // Try up to 3 times before giving up
    
    // Concurrent processing with retry mechanism
    while(retries > 0 && !success) {
        try {
            const ai = getAiClient();
            
            // Allow up to 15 seconds (Generative AI often takes 5-10s under load)
            const createTimeout = () => new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout_Exceeded')), 45000)
            );
            
            let response;
            try {
                response = await Promise.race([
                    ai.models.generateContent({
                        model: 'gemini-flash-lite-latest',
                        contents: contents,
                        config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.7 }
                    }),
                    createTimeout()
                ]);
            } catch (primaryErr) {
                console.log("gemini-flash-latest failed, falling back to gemini-flash-lite-latest...", primaryErr.message);
                response = await Promise.race([
                    ai.models.generateContent({
                        model: 'gemini-flash-latest',
                        contents: contents,
                        config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.7 }
                    }),
                    createTimeout()
                ]);
            }
            
            res.json({ reply: response.text });
            success = true;
        } catch (error) {
            console.error(`Gemini API Error (Retries left: ${retries - 1}):`, error.message);
            retries--;
            if (retries === 0) {
                res.json({ reply: "I am sorry, our AI assistant is experiencing high traffic right now. Please try again in 1-2 minutes." });
            } else {
                // Wait for a random short delay (1-3 seconds) before retrying to prevent hammering the API
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            }
        }
    }
});

// Start Server

// Upgrade VIP Plan
app.post('/api/subscribe', authenticateToken, (req, res) => {
    const { level } = req.body;
    if (!level) return res.status(400).json({ error: 'Level is required' });
    
    const planPrices = { '1': 1699, '2': 3199, '3': 6190, '4': 12180, '5': 24150, '6': 48000 };
    const price = planPrices[level];
    if (!price) return res.status(400).json({ error: 'Invalid plan level' });

    const planName = 'VIP ' + level;
    
    db.get(`SELECT balance, name, phone, referred_by, referral_reward_given FROM users WHERE id = ?`, [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'User not found' });
        
        if (row.balance < price) {
            return res.status(400).json({ 
                error: 'Insufficient balance', 
                message: 'You need \u09F3' + price + ' to subscribe to ' + planName + '.',
                shortfall: price - row.balance
            });
        }
        
        const newBalance = row.balance - price;
        db.run(`UPDATE users SET vip_plan = ?, balance = ? WHERE id = ?`, [planName, newBalance, req.user.id], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            // Record upgrade transaction for subscriber
            db.run(`INSERT INTO transactions (user_id, type, amount, method, status) VALUES (?, 'upgrade', ?, ?, 'completed')`,
                [req.user.id, price, planName + ' Subscription']);

            // Automatic 10% VIP Referral Commission for Inviter (STRICTLY ONCE per referred user)
            if (row.referred_by && !row.referral_reward_given) {
                const cleanRef = row.referred_by.trim();
                db.get(`SELECT id, name, balance FROM users WHERE UPPER(referral_code) = UPPER(?)`, [cleanRef], (err, inviter) => {
                    if (!err && inviter) {
                        // Double check transactions table to prevent duplicate reward
                        db.get(`SELECT id FROM transactions WHERE user_id = ? AND type = 'referral' AND method LIKE ?`,
                            [inviter.id, `%by ${row.name || 'Member'}%`], (tErr, existingTx) => {
                            if (tErr || existingTx) {
                                // Already rewarded previously, mark flag so future queries skip directly
                                db.run(`UPDATE users SET referral_reward_given = 1 WHERE id = ?`, [req.user.id]);
                                return;
                            }

                            const commission = Math.round(price * 0.10); // 10% referral bonus
                            if (commission > 0) {
                                // Credit inviter's balance instantly
                                db.run(`UPDATE users SET balance = balance + ? WHERE id = ?`, [commission, inviter.id]);

                                // Record referral bonus in transactions
                                const bonusDesc = `10% Commission (${planName} by ${row.name || 'Member'})`;
                                db.run(`INSERT INTO transactions (user_id, type, amount, method, status) VALUES (?, 'referral', ?, ?, 'completed')`,
                                    [inviter.id, commission, bonusDesc]);

                                // Mark referral_reward_given = 1 so inviter NEVER gets repeated bonuses for this user
                                db.run(`UPDATE users SET referral_reward_given = 1 WHERE id = ?`, [req.user.id]);
                                console.log(`[Referral] Credited one-time ৳${commission} (10% of ${planName}) to ${inviter.name} (ID: ${inviter.id}) for member ${row.name}`);
                            }
                        });
                    }
                });
            }

            res.json({ success: true, message: 'Successfully upgraded to ' + planName, newPlan: planName, newBalance: newBalance });
        });
    });
});

// ==========================================
// DEPOSIT & SETTINGS API ROUTES
// ==========================================

// Get Public Settings (Notice, Numbers)
app.get('/api/settings', (req, res) => {
    db.all("SELECT * FROM settings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        const settings = {};
        if (rows) rows.forEach(r => settings[r.key] = r.value);
        if (!settings.notice_text) {
            settings.notice_text = "স্বাগতম TPR App এ! বেশি ইনকামের জন্য আজই VIP আপগ্রেড করুন।";
        } else {
            settings.notice_text = settings.notice_text.replace(/JMJ/gi, 'TPR');
        }
        res.json(settings);
    });
});

// Submit Deposit Request (User)
app.post('/api/deposit', authenticateToken, (req, res) => {
    const { amount, method, transaction_id } = req.body;
    if (!amount || !method || !transaction_id) return res.status(400).json({ error: 'All fields required' });
    
    db.run("INSERT INTO deposits (user_id, amount, method, transaction_id) VALUES (?, ?, ?, ?)",
        [req.user.id, amount, method, transaction_id], function(err) {
            if (err) return res.status(500).json({ error: 'Failed to submit' });
            res.json({ success: true, message: 'Deposit request submitted successfully' });
        });
});

// Admin Get Deposits
app.get('/api/admin/deposits', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.all(`SELECT d.*, u.name, u.phone FROM deposits d JOIN users u ON d.user_id = u.id ORDER BY d.id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows || []);
    });
});

// Admin Action Deposit (Approve / Reject)
app.post('/api/admin/deposits/:id/action', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { action } = req.body; // 'approve' or 'reject'
    db.get("SELECT * FROM deposits WHERE id = ?", [req.params.id], (err, deposit) => {
        if (err || !deposit) return res.status(404).json({ error: 'Not found' });
        if (deposit.status !== 'pending') return res.status(400).json({ error: 'Already processed' });
        
        if (action === 'approve') {
            db.serialize(() => {
                db.run("UPDATE deposits SET status = 'approved' WHERE id = ?", [deposit.id]);
                db.run("UPDATE users SET balance = balance + ? WHERE id = ?", [deposit.amount, deposit.user_id]);
                db.run("INSERT INTO transactions (user_id, type, amount, method, status) VALUES (?, 'deposit', ?, ?, 'completed')", [deposit.user_id, deposit.amount, deposit.method || 'bKash']);
            });
            res.json({ success: true });
        } else {
            db.run("UPDATE deposits SET status = 'rejected' WHERE id = ?", [deposit.id]);
            res.json({ success: true });
        }
    });
});

// Admin Update Settings
app.post('/api/admin/settings', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const settings = req.body;
    db.serialize(() => {
        for (const [key, value] of Object.entries(settings)) {
            db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
        }
    });
    res.json({ success: true });
});

// Admin Edit User Balance
app.post('/api/admin/users/:id/balance', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { amount, action } = req.body; // action: 'add' or 'deduct'
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return res.status(400).json({ error: 'Invalid amount' });
    
    db.get("SELECT balance FROM users WHERE id = ?", [req.params.id], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });
        
        let newBalance = user.balance;
        if (action === 'add') newBalance += val;
        else if (action === 'deduct') {
            newBalance -= val;
            if (newBalance < 0) newBalance = 0;
        }
        
        db.run("UPDATE users SET balance = ? WHERE id = ?", [newBalance, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ success: true, newBalance });
        });
    });
});

// Admin Edit User VIP
app.post('/api/admin/users/:id/vip', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { vip_plan } = req.body; 
    let normalized = 'Free';
    if (vip_plan) {
        let str = String(vip_plan).trim().toLowerCase();
        let match = str.match(/\d+/);
        if (str !== '0' && !str.includes('free') && match) {
            let lvl = parseInt(match[0]);
            if (lvl >= 1 && lvl <= 6) normalized = 'VIP ' + lvl;
        }
    }
    db.run("UPDATE users SET vip_plan = ? WHERE id = ?", [normalized, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, vip_plan: normalized });
    });
});



// Admin Update Task Link
app.post('/api/admin/tasks/:id/link', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { link, links } = req.body;
    let finalVal = link;
    if (links !== undefined) {
        finalVal = Array.isArray(links) ? JSON.stringify(links) : String(links);
    } else if (typeof link === 'object') {
        finalVal = JSON.stringify(link);
    }
    db.run("UPDATE tasks SET link = ? WHERE id = ?", [finalVal, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, updatedLink: finalVal });
    });
});

// Admin Ban/Unban User
app.post('/api/admin/users/:id/ban', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { status } = req.body;
    db.run("UPDATE users SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
});

// Admin Delete User
app.delete('/api/admin/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const targetId = req.params.id;

    // Safety: Protect admin accounts from accidental deletion
    db.get("SELECT id, role, name FROM users WHERE id = ?", [targetId], (err, targetUser) => {
        if (err || !targetUser) return res.status(404).json({ error: 'User not found' });
        if (targetUser.role === 'admin' || targetUser.id === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete admin account!' });
        }

        // Clean up user's related data safely
        db.run("DELETE FROM transactions WHERE user_id = ?", [targetId]);
        db.run("DELETE FROM deposits WHERE user_id = ?", [targetId]);
        db.run("DELETE FROM user_tasks WHERE user_id = ?", [targetId]);
        db.run("DELETE FROM user_devices WHERE user_id = ?", [targetId]);
        db.run("DELETE FROM user_banks WHERE user_id = ?", [targetId]);
        db.run("DELETE FROM users WHERE id = ?", [targetId], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            console.log(`[Admin] User #${targetId} (${targetUser.name}) permanently deleted by Admin #${req.user.id}`);
            res.json({ success: true, message: 'User deleted successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
