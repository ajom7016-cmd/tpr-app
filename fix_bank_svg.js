const fs = require('fs');

let file = 'public/bank_details_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

const newSvg = `
    <div class="w-24 h-24 mb-4 opacity-40 mx-auto">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <!-- Wallet Icon -->
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
        </svg>
    </div>
`;

text = text.replace(/<svg class="w-20 h-20 mx-auto text-slate-300 mb-4 opacity-50"[^>]*>[\s\S]*?<\/svg>/, newSvg);

fs.writeFileSync(file, text);
console.log('Fixed bank details SVG icon');
