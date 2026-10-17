const fs = require('fs');

const filesToFix = [
    'public/glassmorphic_2/code.html',
    'public/history_glass/code.html',
    'public/deposit_glass/code.html',
    'public/withdraw_glass/code.html',
    'public/user_profile_premium_glass/code.html'
];

for (const file of filesToFix) {
    const localPath = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/' + file;
    if (fs.existsSync(localPath)) {
        let content = fs.readFileSync(localPath, 'utf8');
        
        // Ensure true-bg is present
        if (!content.includes('id="true-bg"')) {
            const realBgStyle = `
<style id="true-bg">
    body {
        background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.12)), url('/assets/bg_main_py.jpg') center/cover no-repeat fixed !important;
    }
</style>
</head>`;
            content = content.replace('</head>', realBgStyle);
        }
        
        fs.writeFileSync(localPath + '_fixed.html', content);
        console.log('Prepared fixed version for: ' + file);
    } else {
        console.log('File not found locally: ' + file);
    }
}
