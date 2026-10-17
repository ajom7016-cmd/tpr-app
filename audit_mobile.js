const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            if (f !== 'node_modules' && f !== '.git' && f !== 'dist') {
                results = results.concat(walk(full));
            }
        } else if (f.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

const publicDir = path.join(__dirname, 'public');
const files = walk(publicDir);

console.log(`Total HTML files found: ${files.length}\n`);

const findings = [];

files.forEach(f => {
    const rel = path.relative(publicDir, f);
    const content = fs.readFileSync(f, 'utf8');

    const hasViewport = /<meta\s+name=["']viewport["']/i.test(content);
    const viewportMatch = content.match(/<meta\s+name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
    
    // Check for fixed pixel widths larger than 320px that could cause overflow on small phones
    const fixedWidths = [];
    const widthRegex = /(?:width|min-width|max-width)\s*:\s*([3-9]\d{2}|[1-9]\d{3})px/gi;
    let match;
    while ((match = widthRegex.exec(content)) !== null) {
        fixedWidths.push(match[0]);
    }

    // Check tailwind fixed width classes like w-[400px], w-[500px], etc.
    const tailwindFixedWidths = [];
    const twRegex = /\b(?:w|min-w)-\[(\d{3,4})px\]/g;
    while ((match = twRegex.exec(content)) !== null) {
        if (parseInt(match[1]) > 340) {
            tailwindFixedWidths.push(match[0]);
        }
    }

    // Check overflow hidden or horizontal scrolling issues
    const hasOverflowX = /overflow-x\s*:\s*(hidden|scroll|auto)/i.test(content);
    
    findings.push({
        file: rel,
        hasViewport,
        viewport: viewportMatch ? viewportMatch[1] : 'MISSING',
        largeFixedWidths: [...new Set(fixedWidths)].slice(0, 5),
        largeTailwindWidths: [...new Set(tailwindFixedWidths)].slice(0, 5)
    });
});

findings.forEach(f => {
    console.log(`--- [${f.file}] ---`);
    console.log(`Viewport: ${f.viewport}`);
    if (f.largeFixedWidths.length > 0) console.log(`Fixed CSS Widths: ${f.largeFixedWidths.join(', ')}`);
    if (f.largeTailwindWidths.length > 0) console.log(`Tailwind Large Widths: ${f.largeTailwindWidths.join(', ')}`);
    console.log('');
});
