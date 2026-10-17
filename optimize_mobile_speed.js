const fs = require('fs');
const path = require('path');

const APP_BUILD_VER = '2.5.0';

const filesToOptimize = [
    'public/glassmorphic_1/code.html',
    'public/glassmorphic_2/code.html',
    'public/investment_premium_glass/vip.html',
    'public/user_profile_premium_glass/code.html',
    'public/refer_glass/code.html',
    'public/glassmorphic_3/code.html',
    'public/withdraw_glass/code.html',
    'public/deposit_glass/code.html',
    'public/login.html'
];

let totalOptimized = 0;

filesToOptimize.forEach(relPath => {
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) {
        console.log('Skipping missing file:', relPath);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const originalLength = content.length;

    // 1. Remove blocking document.write
    content = content.replace(/document\.write\('<script src="\/js\/app\.js\?v='\s*\+\s*Date\.now\(\)\s*\+\s*'"><\\\/script>'\);/g, `<script src="/js/app.js?v=${APP_BUILD_VER}"></script>`);
    content = content.replace(/document\.write\('<script src="\/js\/app\.js\?v='\s*\+\s*new Date\(\)\.getTime\(\)\s*\+\s*'"><\\\/script>'\);/g, `<script src="/js/app.js?v=${APP_BUILD_VER}"></script>`);

    // 2. Optimize heavy GPU blur filters (Reduce blur radius from 40px/50px/60px to 14px/16px)
    content = content.replace(/blur\(60px\)/g, 'blur(16px)');
    content = content.replace(/blur\(50px\)/g, 'blur(16px)');
    content = content.replace(/blur\(40px\)/g, 'blur(14px)');
    content = content.replace(/blur\(32px\)/g, 'blur(14px)');
    content = content.replace(/blur\(30px\)/g, 'blur(14px)');
    content = content.replace(/saturate\(150%\)/g, 'saturate(135%)');
    content = content.replace(/saturate\(180%\)/g, 'saturate(140%)');

    // 3. Add mobile hardware acceleration to body if not already present
    if (content.includes('body {') && !content.includes('-webkit-overflow-scrolling')) {
        content = content.replace(/body\s*\{([^}]*)\}/, (match, bodyContent) => {
            if (bodyContent.includes('-webkit-overflow-scrolling')) return match;
            return `body {${bodyContent}\n    -webkit-overflow-scrolling: touch;\n    overscroll-behavior-y: contain;\n}`;
        });
    }

    // 4. Add hardware layer acceleration (translateZ(0)) to glass classes
    const glassClasses = ['.glass-card', '.list-card', '.glass-soft', '.glass-base-ultra', '.glass-card-premium', '.notice-glass-bar'];
    glassClasses.forEach(cls => {
        const regex = new RegExp(`(${cls.replace('.', '\\.')}\\s*\\{[^}]*\\})`, 'g');
        content = content.replace(regex, (match) => {
            if (match.includes('transform: translateZ(0)') || match.includes('transform: translate3d')) return match;
            // Inject transform: translateZ(0); before closing brace
            return match.replace(/\}$/, '    transform: translateZ(0);\n}');
        });
    });

    // 5. Add content-visibility: auto for repeating cards to prevent offscreen rendering lag
    ['.list-card', '.task-card'].forEach(cls => {
        const regex = new RegExp(`(${cls.replace('.', '\\.')}\\s*\\{[^}]*\\})`, 'g');
        content = content.replace(regex, (match) => {
            if (match.includes('content-visibility')) return match;
            return match.replace(/\}$/, '    content-visibility: auto;\n    contain-intrinsic-size: 0 80px;\n}');
        });
    });

    fs.writeFileSync(fullPath, content, 'utf8');
    totalOptimized++;
    console.log(`[OK] Optimized ${relPath} (diff: ${content.length - originalLength} bytes)`);
});

console.log(`\nSuccessfully applied mobile 60fps GPU acceleration to ${totalOptimized} files!`);
