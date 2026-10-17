const fs = require('fs');

function makeCrisp(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<img src="\/assets\/banners\/(.+?)\.jpg" class="w-full h-full object-cover shrink-0" alt="(.+?)">/g, 
        '<img src="/assets/banners/$1.jpg" class="w-full h-full object-cover shrink-0" style="image-rendering: -webkit-optimize-contrast; transform: translateZ(0); backface-visibility: hidden;" alt="$2">');
    
    // For refer page
    content = content.replace(/<img src="\/assets\/banners\/(.+?)\.jpg" class="w-full h-full object-cover" alt="(.+?)">/g, 
        '<img src="/assets/banners/$1.jpg" class="w-full h-full object-cover" style="image-rendering: -webkit-optimize-contrast; transform: translateZ(0); backface-visibility: hidden;" alt="$2">');
        
    fs.writeFileSync(file, content);
}

makeCrisp('public/glassmorphic_1/code.html');
makeCrisp('public/refer_glass/code.html');

console.log('Added crisp rendering CSS to images.');
