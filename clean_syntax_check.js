const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cleanSyntaxCheck() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    // Get the LAST script tag content (where our logic is)
    const scriptStart = code.lastIndexOf('<script>');
    const scriptEnd = code.lastIndexOf('</script>');
    const scriptContent = code.substring(scriptStart + 8, scriptEnd);
    
    require('fs').writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\admin_test_clean.js', scriptContent);
    ssh.dispose();
}
cleanSyntaxCheck().catch(console.error);
