const fs = require('fs');
const path = require('path');

const files = ['index.html', 'app.html'];

files.forEach(filename => {
    const filePath = path.join(__dirname, 'public', filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix header layout HTML
    const oldHeaderHtml = `<div class="flex items-center gap-2 flex-1 w-full">
                <!-- App Logo (Authentic TPR Box) -->
                <div class="tpr-logo-box w-[42px] h-[42px] shrink-0 rounded-[14px] ml-0.5 flex flex-col items-center justify-center relative overflow-hidden">
                    <span class="tpr-logo-text text-white font-black text-[15px] tracking-tighter leading-none z-10">TPR</span>
                    <div class="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent z-0"></div>
                </div>
                
                <!-- Center Section: Nav & Search -->
                <div class="relative flex-1 h-11 mx-1 overflow-hidden">
                    <!-- Top Nav Container -->
                    <div id="nav-links" class="absolute inset-0 w-full h-full flex items-center justify-center overflow-visible transition-all duration-300 ease-out scale-100 opacity-100">
                        <div id="top-nav-container" class="flex gap-4 justify-center items-center w-full px-1 h-full transition-all duration-300" style="opacity: 1; transform: translateY(0) scale(1);">
                            <!-- JS will populate 3 items here -->
                        </div>
                    </div>`;

    const newHeaderHtml = `<div class="flex items-center gap-2 flex-1 min-w-0">
                <!-- App Logo (Authentic TPR Box) -->
                <div class="tpr-logo-box w-[42px] h-[42px] shrink-0 rounded-[14px] ml-0.5 flex flex-col items-center justify-center relative overflow-hidden">
                    <span class="tpr-logo-text text-white font-black text-[15px] tracking-tighter leading-none z-10">TPR</span>
                    <div class="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent z-0"></div>
                </div>
                
                <!-- Center Section: Nav & Search -->
                <div class="relative flex-1 min-w-0 h-11 mx-1 overflow-hidden">
                    <!-- Top Nav Container -->
                    <div id="nav-links" class="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden transition-all duration-300 ease-out scale-100 opacity-100">
                        <div id="top-nav-container" class="flex gap-2 sm:gap-3 justify-center items-center w-full px-0.5 h-full transition-all duration-300" style="opacity: 1; transform: translateY(0) scale(1);">
                            <!-- JS will populate 3 items here -->
                        </div>
                    </div>`;

    // Normalize line endings for replacement
    const normalize = s => s.replace(/\r\n/g, '\n');
    content = normalize(content);
    const normOldHtml = normalize(oldHeaderHtml);
    const normNewHtml = normalize(newHeaderHtml);

    if (content.includes(normOldHtml)) {
        content = content.replace(normOldHtml, normNewHtml);
        console.log(`[HTML] Replaced header markup in ${filename}`);
    } else {
        console.log(`[HTML] oldHeaderHtml pattern not matched in ${filename}, attempting regex...`);
        content = content.replace(
            /<div class="flex items-center gap-2 flex-1 w-full">([\s\S]*?)<div id="top-nav-container"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/,
            normNewHtml
        );
    }

    // 2. Fix top nav JS rendering
    const oldJsPattern = /\/\/ Render top nav items with smooth fade[\s\S]*?const topNavContainer = document\.getElementById\('top-nav-container'\);[\s\S]*?topNavContainer\.style\.opacity = '1';[\s\S]*?topNavContainer\.style\.transform = 'translateY\(0\) scale\(1\)';[\s\S]*?\}, 50\);\s*\}/;

    const newJsBlock = `// Render top nav items with smooth fade
        const topNavContainer = document.getElementById('top-nav-container');
        if (topNavContainer) {
            topNavContainer.style.opacity = '0';
            topNavContainer.style.transform = 'translateY(6px) scale(0.96)';
            
            setTimeout(() => {
                topNavContainer.innerHTML = '';
                
                // Calculate 3 items to show around current active page
                let startIndex = activePageIdx - 1;
                if (startIndex < 0) startIndex = 0;
                let endIndex = startIndex + 2;
                if (endIndex >= appPages.length) {
                    endIndex = appPages.length - 1;
                    startIndex = Math.max(0, endIndex - 2);
                }

                const visiblePages = appPages.slice(startIndex, endIndex + 1);
                
                topNavContainer.className = 'flex gap-2 sm:gap-3 justify-center items-center w-full px-0.5 h-full transition-all duration-300';
                
                visiblePages.forEach((page) => {
                    const isActive = page.url === activePage.url;
                    const item = document.createElement('div');
                    
                    let activeSize = 'text-[12px] sm:text-[13px]';
                    let inactiveSize = 'text-[10px] sm:text-[11px]';

                    item.className = 'nav-link-ultra whitespace-nowrap text-center transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ' + 
                                     (isActive ? \`active \${activeSize} scale-105 font-black text-slate-900 drop-shadow-sm\` : \`\${inactiveSize} text-slate-500/80 hover:text-slate-800 font-bold cursor-pointer\`);
                    item.innerText = page.title;
                    item.onclick = (e) => { e.preventDefault(); loadPage(page.url); };
                    topNavContainer.appendChild(item);
                });
                
                topNavContainer.style.opacity = '1';
                topNavContainer.style.transform = 'translateY(0) scale(1)';
            }, 40);
        }`;

    if (oldJsPattern.test(content)) {
        content = content.replace(oldJsPattern, newJsBlock);
        console.log(`[JS] Replaced topNavContainer rendering in ${filename}`);
    } else {
        console.log(`[JS] oldJsPattern did not match in ${filename}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename} successfully!`);
});
