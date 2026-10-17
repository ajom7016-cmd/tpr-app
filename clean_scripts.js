const fs = require('fs');

['public/index.html', 'public/app.html', 'public/task_action/code.html'].forEach(f => {
    let s = fs.readFileSync(f, 'utf8');
    s = s.replace(/<script>\s*document\.write\('<script src="[^"]*app\.js[^"]*"><\\\/script>'\);\s*<\/script>/g, '<script src="/js/app.js?v=2.5.0"></script>');
    fs.writeFileSync(f, s, 'utf8');
    console.log('Cleaned document.write in', f);
});
