const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new'
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 390, height: 844 });
        
        // Set valid dummy token so it doesn't redirect to login
        await page.evaluateOnNewDocument(() => {
            localStorage.setItem('userToken', 'test-token');
        });

        // Intercept profile API so it returns immediately
        await page.setRequestInterception(true);
        page.on('request', req => {
            if (req.url().includes('/api/profile')) {
                req.respond({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ id: 1, name: 'User', balance: 500, vip_level: 1 })
                });
            } else {
                req.continue();
            }
        });

        await page.goto('https://thepetroyal.com/index.html', { waitUntil: 'domcontentloaded' });
        await page.screenshot({ path: 'C:/Users/ajom7/Downloads/frame_0ms.png' });
        await new Promise(r => setTimeout(r, 200));
        await page.screenshot({ path: 'C:/Users/ajom7/Downloads/frame_200ms.png' });
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: 'C:/Users/ajom7/Downloads/frame_800ms.png' });
        console.log('FRAMES_CAPTURED');
        await browser.close();
        process.exit(0);
        
        await new Promise(r => setTimeout(r, 200));
        await page.screenshot({ path: 'C:/Users/ajom7/Downloads/frame_300ms.png' });

        await new Promise(r => setTimeout(r, 400));
        await page.screenshot({ path: 'C:/Users/ajom7/Downloads/frame_700ms.png' });

        await navPromise;
        await new Promise(r => setTimeout(r, 800));
        await page.screenshot({ path: 'C:/Users/ajom7/Downloads/frame_1500ms.png' });

        await browser.close();
        console.log('FRAMES_CAPTURED');
    } catch(e) {
        console.error(e);
    }
})();
