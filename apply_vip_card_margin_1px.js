const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldRegex = /<div class="bg-white\/5 backdrop-blur-\[8px\] rounded-\[24px\] p-5 sm:px-8 sm:py-6 relative overflow-hidden \nshadow-\[0_8px_32px_rgba\(0,0,0,0\.1\)\] border border-white\/20 w-full">/m;

// Because formatting might be slightly different, let's use string replacement on a reliable part
if(content.includes('border border-white/20 w-full"')) {
    content = content.replace('border border-white/20 w-full"', 'border border-white/20 w-full" style="margin-left: -1px; margin-right: -1px; width: calc(100% + 2px);"');
    fs.writeFileSync(file, content);
    console.log('Applied exact -1px margins to force the card to expand by 1px on both sides');
} else if (content.includes('border border-white/20 w-full" style="')) {
     // If it already has a style tag, we need to add to it. But it doesn't currently.
} else {
    console.log('Could not find the target string. Using regex fallback.');
    const regex2 = /class="bg-white\/5 backdrop-blur-\[8px\][^>]+w-full"/;
    const match = content.match(regex2);
    if(match) {
        const replacement = match[0] + ' style="margin-left: -1px; margin-right: -1px; width: calc(100% + 2px);"';
        content = content.replace(regex2, replacement);
        fs.writeFileSync(file, content);
        console.log('Applied via regex fallback');
    }
}
