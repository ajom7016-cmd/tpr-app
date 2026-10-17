const http = require('http');

async function request(path, method = 'GET', body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL('http://104.247.110.22' + path);
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const req = http.request(url, { method, headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = data;
                try { parsed = JSON.parse(data); } catch(e) {}
                resolve({ status: res.statusCode, headers: res.headers, data: parsed });
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function audit() {
    console.log('--- STARTING COMPREHENSIVE LIVE SYSTEM AUDIT ---');
    let errors = 0;

    // 1. Root page & Assets
    const root = await request('/');
    console.log('1. Root HTTP Status:', root.status, root.status === 200 ? 'PASS' : 'FAIL');
    if (root.status !== 200) errors++;

    // 2. Admin Login
    const login = await request('/api/login', 'POST', { email: 'admin@jmj.com', password: 'admin123' });
    console.log('2. Admin Auth Test:', login.status === 200 ? 'PASS' : 'FAIL', login.status !== 200 ? login.data : '');
    if (login.status !== 200) errors++;
    const token = login.data?.token;

    if (token) {
        // 3. Profile API
        const prof = await request('/api/profile', 'GET', null, token);
        console.log('3. Profile API:', prof.status === 200 ? 'PASS' : 'FAIL', 'User:', prof.data?.name);
        if (prof.status !== 200) errors++;

        // 4. Tasks API
        const tasks = await request('/api/tasks', 'GET', null, token);
        console.log('4. Tasks API:', tasks.status === 200 ? 'PASS' : 'FAIL', 'Count:', tasks.data?.length);
        if (tasks.status !== 200) errors++;

        // 5. Banks API
        const banks = await request('/api/banks', 'GET', null, token);
        console.log('5. Banks API:', banks.status === 200 ? 'PASS' : 'FAIL');
        if (banks.status !== 200) errors++;

        // 6. Admin Users API
        const adminUsers = await request('/api/admin/users', 'GET', null, token);
        console.log('6. Admin Users API:', adminUsers.status === 200 ? 'PASS' : 'FAIL', 'Total Users:', adminUsers.data?.length);
        if (adminUsers.status !== 200) errors++;
    }

    console.log('--- AUDIT FINISHED: Total Errors =', errors, '---');
    process.exit(errors === 0 ? 0 : 1);
}

audit().catch(e => { console.error('Audit failed:', e); process.exit(1); });
