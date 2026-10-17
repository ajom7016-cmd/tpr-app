const fs = require('fs');
const path = require('path');

function updateFile(filename) {
    const filePath = path.join(__dirname, 'public', filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add preconnect tags to <head>
    const preconnectTags = `    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
`;
    if (!content.includes('rel="dns-prefetch"')) {
        content = content.replace('<script src="https://cdn.tailwindcss.com"></script>', preconnectTags + '    <script src="https://cdn.tailwindcss.com"></script>');
    }

    // 2. Update CSS for .app-frame
    content = content.replace(
        '#app-frame { flex: 1; width: 100%; border: none; background: transparent; z-index: 10; margin-bottom: 75px; transition: opacity 0.2s cubic-bezier(0.25, 0.8, 0.25, 1); }',
        '#app-frame, .app-frame { flex: 1; width: 100%; border: none; background: transparent; z-index: 10; margin-bottom: 75px; transition: opacity 0.15s cubic-bezier(0.25, 0.8, 0.25, 1); }'
    );

    // 3. Replace single iframe with warm multi-frame set
    const oldIframeHtml = `<iframe id="app-frame" allow="microphone; camera" src="" onload="try { const d=this.contentWindow.document; if(!this.src.includes('support') && this.src !== '') { d.body.style.setProperty('background', 'transparent', 'important'); d.body.style.setProperty('background-color', 'transparent', 'important'); const b=d.querySelector('.bg-3d'); if(b) b.style.display='none'; } } catch(err) { console.log(err); }"></iframe>`;

    const newMultiFrameHtml = `<!-- Native-Speed Warm Multi-Tab Frames -->
    <iframe id="tab-frame-0" class="app-frame active" allow="microphone; camera" src="" onload="styleFrame(this)"></iframe>
    <iframe id="tab-frame-1" class="app-frame" style="display:none;" allow="microphone; camera" src="about:blank" onload="styleFrame(this)"></iframe>
    <iframe id="tab-frame-2" class="app-frame" style="display:none;" allow="microphone; camera" src="about:blank" onload="styleFrame(this)"></iframe>
    <iframe id="tab-frame-3" class="app-frame" style="display:none;" allow="microphone; camera" src="about:blank" onload="styleFrame(this)"></iframe>
    <iframe id="subpage-frame" class="app-frame" style="display:none;" allow="microphone; camera" src="about:blank" onload="styleFrame(this)"></iframe>`;

    if (content.includes(oldIframeHtml)) {
        content = content.replace(oldIframeHtml, newMultiFrameHtml);
    }

    // 4. Update loadPage logic for instant warm tab switching
    const oldLoadPageStart = 'function loadPage(url, btnElement) {';
    const oldLoadPageEnd = '// Pass scroll events from iframe up to parent for header styling';

    const newLoadPageCode = `function styleFrame(frame) {
        try {
            const d = frame.contentWindow.document;
            if (!frame.src.includes('support') && frame.src !== '' && frame.src !== 'about:blank') {
                d.body.style.setProperty('background', 'transparent', 'important');
                d.body.style.setProperty('background-color', 'transparent', 'important');
                const b = d.querySelector('.bg-3d');
                if (b) b.style.display = 'none';
            }
        } catch(err) {}
    }

    const coreTabs = [
        'glassmorphic_1/code.html',
        'glassmorphic_2/code.html',
        'investment_premium_glass/vip.html',
        'user_profile_premium_glass/code.html'
    ];

    let currentActiveFrame = null;

    // Backward compatibility proxy for document.getElementById('app-frame')
    const _nativeGbid = document.getElementById.bind(document);
    document.getElementById = function(id) {
        if (id === 'app-frame') {
            return currentActiveFrame || document.querySelector('.app-frame.active') || _nativeGbid('tab-frame-0');
        }
        return _nativeGbid(id);
    };

    function loadPage(url, btnElement) {
        if (!window.isLandingDemo) localStorage.setItem('last_visited_page', url);

        const allFrames = document.querySelectorAll('.app-frame');
        const tabIdx = coreTabs.indexOf(url);
        let targetFrame;

        if (tabIdx !== -1) {
            // Instant 0ms Core Tab Switching
            targetFrame = document.getElementById('tab-frame-' + tabIdx);
            if (targetFrame.src === 'about:blank' || !targetFrame.src || targetFrame.getAttribute('data-loaded') !== 'true') {
                const timestamp = new Date().getTime();
                const separator = url.includes('?') ? '&' : '?';
                let finalUrl = url + separator + 'v=' + timestamp;
                if (window.isLandingDemo) finalUrl += '&demo=true';
                targetFrame.src = finalUrl;
                targetFrame.setAttribute('data-loaded', 'true');
            }

            allFrames.forEach(f => {
                f.style.display = 'none';
                f.classList.remove('active');
            });
            targetFrame.style.display = 'block';
            targetFrame.classList.add('active');
            targetFrame.style.marginBottom = '75px';
            currentActiveFrame = targetFrame;

            // Silently notify tab of active state so balance refreshes
            try {
                if (targetFrame.contentWindow) {
                    targetFrame.contentWindow.postMessage({ type: 'tab_activated' }, '*');
                }
            } catch(e) {}
        } else {
            // Sub-page routing (Deposit, Withdraw, History, etc.)
            targetFrame = document.getElementById('subpage-frame');
            const timestamp = new Date().getTime();
            const separator = url.includes('?') ? '&' : '?';
            let finalUrl = url + separator + 'v=' + timestamp;
            if (window.isLandingDemo) finalUrl += '&demo=true';

            allFrames.forEach(f => {
                f.style.display = 'none';
                f.classList.remove('active');
            });
            targetFrame.style.display = 'block';
            targetFrame.classList.add('active');
            targetFrame.style.opacity = '0';
            targetFrame.src = finalUrl;
            targetFrame.onload = () => {
                styleFrame(targetFrame);
                setTimeout(() => { targetFrame.style.opacity = '1'; }, 30);
            };
            currentActiveFrame = targetFrame;
        }

        // Navigation bar display logic
        const bottomNav = document.querySelector('.bottom-nav');
        const globalHeader = document.getElementById('global-header');
        
        if (tabIdx === -1) {
            if (bottomNav) bottomNav.style.display = 'none';
            if (targetFrame) targetFrame.style.marginBottom = '0px';
            if (globalHeader) globalHeader.style.display = 'block';
            
            const toggleBtn = document.getElementById('nav-toggle');
            if (toggleBtn) {
                toggleBtn.style.display = url.includes('support') ? 'none' : 'flex';
                toggleBtn.style.bottom = '5px';
            }
            const chevronContainer = document.getElementById('chevron-container');
            if (chevronContainer) chevronContainer.style.transform = 'rotate(0deg)';
            navIsToggled = false;
        } else {
            if (bottomNav) {
                bottomNav.style.display = 'flex';
                bottomNav.style.animation = 'none';
                bottomNav.style.opacity = '1';
                bottomNav.style.transform = 'translateY(0)';
            }
            if (targetFrame) targetFrame.style.marginBottom = '75px';
            if (globalHeader) globalHeader.style.display = 'block';
            
            const toggleBtn = document.getElementById('nav-toggle');
            if (toggleBtn) toggleBtn.style.display = 'none';
            navIsToggled = false;
        }

        let activePageIdx = appPages.findIndex(p => p.url === url);
        if (activePageIdx === -1) activePageIdx = 0;
        let activePage = appPages[activePageIdx];

        let buttons = document.querySelectorAll('.nav-item');
        let targetBottomNav = btnElement;
        
        if (!targetBottomNav && activePage.bottomNavIdx !== null) {
            targetBottomNav = buttons[activePage.bottomNavIdx];
        }

        buttons.forEach(btn => {
            btn.classList.remove('active');
            let icon = btn.querySelector('.material-symbols-outlined');
            if (icon) icon.style.fontVariationSettings = "'FILL' 0";
        });
        
        if (targetBottomNav) {
            targetBottomNav.classList.add('active');
            const icon = targetBottomNav.querySelector('.material-symbols-outlined');
            if (icon) icon.style.fontVariationSettings = "'FILL' 1";
        }
        
        // Render top nav items with smooth fade
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
        }

        // Close global search if open
        const nav = document.getElementById('nav-links');
        if (nav && nav.classList.contains('opacity-0') && window.togglePremiumSearch) {
            togglePremiumSearch();
        }
    }
    
    // Warm Preload Remaining Core Tabs in Background
    const initAppNav = () => {
        let lastPage = localStorage.getItem('last_visited_page') || 'glassmorphic_1/code.html';
        if (lastPage.includes('demo_dashboard.html') || lastPage.includes('landing.html')) {
            lastPage = 'glassmorphic_1/code.html';
        }
        loadPage(lastPage);

        // Preload other tabs after 200ms
        setTimeout(() => {
            coreTabs.forEach((tabUrl, idx) => {
                const f = document.getElementById('tab-frame-' + idx);
                if (f && (f.src === 'about:blank' || !f.src)) {
                    const sep = tabUrl.includes('?') ? '&' : '?';
                    let u = tabUrl + sep + 'v=' + Date.now();
                    if (window.isLandingDemo) u += '&demo=true';
                    f.src = u;
                    f.setAttribute('data-loaded', 'true');
                }
            });
        }, 200);
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAppNav);
    } else {
        initAppNav();
    }

    `;

    const lpStart = content.indexOf(oldLoadPageStart);
    const lpEnd = content.indexOf(oldLoadPageEnd);
    if (lpStart !== -1 && lpEnd !== -1) {
        content = content.slice(0, lpStart) + newLoadPageCode + content.slice(lpEnd);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated ' + filename + ' with Instant 0ms Tab Switching!');
}

updateFile('index.html');
updateFile('app.html');
