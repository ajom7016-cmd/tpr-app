const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixGhostingAndTasks() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

// 1. Fix iframe ghosting in app.html
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(/d\\.body\\.style\\.setProperty\\('background', 'transparent', 'important'\\);/g, '');
app = app.replace(/d\\.body\\.style\\.setProperty\\('background-color', 'transparent', 'important'\\);/g, '');
// Bump cache version again to force clients to update
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");
fs.writeFileSync(appPath, app);

// 2. Add error reporting to tasks page so we know why it's stuck on the skeleton loader
const tasksPath = '/var/www/jmj_app/public/glassmorphic_2/code.html';
let tasks = fs.readFileSync(tasksPath, 'utf8');

// Replace the console.error with an alert so the user sees it
if (!tasks.includes('alert("Error')) {
    tasks = tasks.replace(/console\\.error\\("Error fetching tasks\\/profile for iframe", e\\);/g, 'console.error(e); alert("API Error: " + e.message);');
}
fs.writeFileSync(tasksPath, tasks);

console.log('Fixed iframe ghosting and added task debug alert.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_tasks_ghosting.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_tasks_ghosting.js');
    console.log(res.stdout);
    
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
fixGhostingAndTasks().catch(console.error);
