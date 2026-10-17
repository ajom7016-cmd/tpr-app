const fs = require('fs');
const path = require('path');
const dir = './public';

function walk(d) {
    fs.readdirSync(d).forEach(f => {
        const fp = path.join(d, f);
        if (fs.statSync(fp).isDirectory()) {
            walk(fp);
        } else if (f.endsWith('.html')) {
            let text = fs.readFileSync(fp, 'utf8');
            let modified = text.replace(/<button class="absolute text-slate-500/g, '<button class="absolute left-6 z-[100] text-slate-500');
            if(text !== modified) {
                fs.writeFileSync(fp, modified);
                console.log('Fixed ' + fp);
            }
        }
    });
}
walk(dir);
