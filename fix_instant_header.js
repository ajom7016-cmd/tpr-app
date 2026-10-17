const fs = require('fs');
const path = require('path');

const files = ['index.html', 'app.html'];

files.forEach(filename => {
    const filePath = path.join(__dirname, 'public', filename);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add Zero-Latency Header Critical CSS
    const headerCssMarker = '/* ====== GLOBAL HEADER STYLES ====== */';
    const newHeaderCss = `/* ====== GLOBAL HEADER STYLES (Zero-Latency Instant Render) ====== */
    #global-header {
        position: relative;
        width: 100%;
        z-index: 50;
        flex-shrink: 0;
    }
    .glass-base-ultra {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100% !important;
        height: 56px !important;
        padding: 8px 16px 6px 16px !important;
        box-sizing: border-box !important;
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 5px 25px rgba(0,0,0,0.05), inset 0 2px 10px rgba(255,255,255,0.3);
        transition: all 0.3s ease;
    }
    .glass-base-ultra.scrolled {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 15px 40px rgba(0,0,0,0.08), inset 0 -1px 0 rgba(255,255,255,0.5);
    }
    .tpr-logo-box {
        width: 42px !important;
        height: 42px !important;
        min-width: 42px !important;
        max-width: 42px !important;
        border-radius: 14px !important;
        flex-shrink: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
        overflow: hidden !important;
        background: linear-gradient(135deg, rgba(255,192,203,0.3) 0%, rgba(173,216,230,0.3) 50%, rgba(152,251,152,0.3) 100%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        border: 1px solid rgba(255,255,255,0.8);
    }
    .tpr-logo-text {
        font-family: 'Outfit', sans-serif;
        text-shadow: 1px 1px 4px rgba(0,0,0,0.1);
    }
    #nav-links {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
    }
    #top-nav-container {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        width: 100% !important;
        height: 100% !important;
        white-space: nowrap !important;
        box-sizing: border-box !important;
    }
    .nav-link-ultra {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        white-space: nowrap !important;
        color: #64748b !important;
        transition: all 0.2s ease !important;
        flex-shrink: 0 !important;
        user-select: none !important;
        padding: 4px 6px !important;
    }
    .nav-link-ultra.active {
        color: #0f172a !important;
        font-size: 12px !important;
        font-weight: 900 !important;
        transform: scale(1.05) !important;
        filter: drop-shadow(0 1px 1px rgba(0,0,0,0.08)) !important;
    }
    #search-btn {
        width: 40px !important;
        height: 40px !important;
        min-width: 40px !important;
        border-radius: 9999px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
    }`;

    // Replace old header css section
    const oldCssRegex = /\/\* ====== GLOBAL HEADER STYLES ====== \*\/[\s\S]*?\.nav-link-ultra\.active\s*\{[\s\S]*?\}/;
    if (oldCssRegex.test(content)) {
        content = content.replace(oldCssRegex, newHeaderCss);
        console.log(`[CSS] Updated header critical CSS in ${filename}`);
    }

    // 2. Pre-populate #top-nav-container in HTML so it is never empty on frame 0
    const emptyNavContainerRegex = /<div id="top-nav-container"[^>]*>[\s\S]*?<\/div>/;
    const prefilledNavContainer = `<div id="top-nav-container" class="flex gap-2 sm:gap-3 justify-center items-center w-full px-0.5 h-full transition-all duration-300" style="opacity: 1; transform: translateY(0) scale(1);">
                            <div class="nav-link-ultra active" onclick="loadPage('glassmorphic_1/code.html')">DASHBOARD</div>
                            <div class="nav-link-ultra" onclick="loadPage('glassmorphic_2/code.html')">TASKS</div>
                            <div class="nav-link-ultra" onclick="loadPage('investment_premium_glass/vip.html')">PLAN</div>
                        </div>`;

    if (emptyNavContainerRegex.test(content)) {
        content = content.replace(emptyNavContainerRegex, prefilledNavContainer);
        console.log(`[HTML] Pre-populated top-nav-container in ${filename}`);
    }

    // 3. Make initial nav render 0ms synchronous (no flicker / opacity flash on refresh)
    const oldJsNavRegex = /\/\/ Render top nav items with smooth fade[\s\S]*?const topNavContainer = document\.getElementById\('top-nav-container'\);[\s\S]*?topNavContainer\.style\.opacity = '1';[\s\S]*?topNavContainer\.style\.transform = 'translateY\(0\) scale\(1\)';[\s\S]*?\}, 40\);\s*\}/;

    const newJsNav = `// Render top nav items (Zero flicker on refresh)
        const topNavContainer = document.getElementById('top-nav-container');
        if (topNavContainer) {
            const updateNavItems = () => {
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
                
                visiblePages.forEach((page) => {
                    const isActive = page.url === activePage.url;
                    const item = document.createElement('div');
                    item.className = 'nav-link-ultra ' + (isActive ? 'active' : '');
                    item.innerText = page.title;
                    item.onclick = (e) => { e.preventDefault(); loadPage(page.url); };
                    topNavContainer.appendChild(item);
                });
            };

            if (window._hasNavInitialized) {
                topNavContainer.style.opacity = '0';
                topNavContainer.style.transform = 'translateY(4px) scale(0.97)';
                setTimeout(() => {
                    updateNavItems();
                    topNavContainer.style.opacity = '1';
                    topNavContainer.style.transform = 'translateY(0) scale(1)';
                }, 25);
            } else {
                window._hasNavInitialized = true;
                updateNavItems();
                topNavContainer.style.opacity = '1';
                topNavContainer.style.transform = 'translateY(0) scale(1)';
            }
        }`;

    if (oldJsNavRegex.test(content)) {
        content = content.replace(oldJsNavRegex, newJsNav);
        console.log(`[JS] Updated zero-flicker nav rendering in ${filename}`);
    } else {
        console.log(`[JS] oldJsNavRegex did not match in ${filename}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename} successfully!`);
});
