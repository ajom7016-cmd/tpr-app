const fs = require('fs');

let file = 'public/refer_glass/code.html';
if (fs.existsSync(file)) {
    let text = fs.readFileSync(file, 'utf8');
    
    // Remove the rogue absolute back button completely
    text = text.replace(/<!-- Back Button \(Floating\) -->[\s\S]*?<\/div>\s*<\/div>/, ''); // wait, it has only one </div>
    text = text.replace(/<!-- Back Button \(Floating\) -->[\s\S]*?<\/div>/, '');

    // The text currently has an orphaned `<div class="w-full text-left">` 
    // We will inject the missing wrapper before it.
    const injection = `<div class="max-w-[400px] mx-auto px-6 relative z-10 space-y-6">
        <div class="flex items-center justify-center mb-2">
            <h1 class="text-[24px] font-black tracking-tight text-slate-800">My Team</h1>
        </div>
        
        <div class="glass-card mb-6 flex flex-col items-center relative overflow-hidden p-6 w-full text-center">`;
        
    text = text.replace('<div class="w-full text-left">', injection + '\n            <div class="w-full text-left">');
    
    // We also need to fix the body padding since it's a main page, 
    // but wait, does refer_glass have an app header in the iframe?
    // In index.html, REFER loads refer_glass. The main app header is fixed at the top.
    // So the body needs pt-[72px] or pt-[90px].
    text = text.replace('<body class="pt-6 pb-24"', '<body class="pt-[90px] pb-24"');
    
    fs.writeFileSync(file, text);
    console.log('Fixed refer_glass');
}
