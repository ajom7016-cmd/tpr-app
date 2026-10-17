const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTasksPage() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Fix the ghosting issue by forcing app.html to NOT make iframes transparent!
    let app = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appContent = app.stdout;
    appContent = appContent.replace(/d\.body\.style\.setProperty\('background', 'transparent', 'important'\);/g, '');
    appContent = appContent.replace(/d\.body\.style\.setProperty\('background-color', 'transparent', 'important'\);/g, '');
    
    // Let's also check if the Tasks page has any JS bugs!
    let tasks = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let tasksContent = tasks.stdout;
    
    // Look for where fetch is called
    // If it's failing silently, let's add an alert so the user can tell us the error!
    if (!tasksContent.includes('alert("Error fetching tasks"')) {
        tasksContent = tasksContent.replace(/console\.error\("Error fetching tasks\/profile for iframe", e\);/g, 'console.error("Error fetching tasks", e); alert("Error fetching tasks: " + e.message);');
    }
    
    const fs = require('fs');
    fs.writeFileSync('/var/www/jmj_app/public/app.html', appContent);
    fs.writeFileSync('/var/www/jmj_app/public/glassmorphic_2/code.html', tasksContent);
    
    console.log('Fixed ghosting and added debug alert');
    ssh.dispose();
}
fixTasksPage();
