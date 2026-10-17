const fs = require('fs');

let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// Restore the button and the missing closing divs
content = content.replace(
    /<\/div>\s*<!-- Toast Notification -->/,
    `</div>
            <button onclick="submitWithdraw()" id="submit-btn" class="btn-premium w-full py-4 rounded-full font-black text-[18px] tracking-wide flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[20px]">payments</span>
                Confirm Withdrawal
            </button>
        </div>
    </div>

    <!-- Toast Notification -->`
);

fs.writeFileSync(file, content);
console.log('Restored the missing Confirm Withdrawal button and missing div tags');
