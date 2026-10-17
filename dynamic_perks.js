const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// The logic we want to insert before `let html = \`...`
const dynamicLogic = `
                // Dynamic VIP Perks
                const bonusPercent = vipInfo.level * 5; // Free: 0%, VIP 1: 5%, VIP 6: 30%
                const perkTexts = [
                    "Standard User",      // 0
                    "Basic Priority",     // 1
                    "Extra Tasks",        // 2
                    "Priority Support",   // 3
                    "Exclusive Offers",   // 4
                    "Fast Withdrawals",   // 5
                    "Premium Lounge"      // 6
                ];
                const perkText = perkTexts[vipInfo.level] || "Premium Lounge";
`;

// Insert the logic just before `let html = `
content = content.replace(/let html = `/, dynamicLogic + '\n                let html = `');

// Replace the static HTML inside the template literal
const staticBottomPerks = /<!-- Bottom Perks -->[\s\S]*?<div class="flex items-center justify-center gap-6">[\s\S]*?<div class="flex items-center gap-2">[\s\S]*?<div class="w-2 h-2 rounded-full bg-orange-500 shadow-\[0_0_8px_#f97316\]"><\/div>[\s\S]*?<span class="text-white\/90 text-\[12px\] font-bold">Earn Bonus: \+15%<\/span>[\s\S]*?<\/div>[\s\S]*?<div class="flex items-center gap-2">[\s\S]*?<div class="w-2 h-2 rounded-full bg-orange-500 shadow-\[0_0_8px_#f97316\]"><\/div>[\s\S]*?<span class="text-white\/90 text-\[12px\] font-bold">Exclusive Offers<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const dynamicBottomPerks = `<!-- Bottom Perks -->
                        <div class="flex items-center justify-center gap-6">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
                                <span class="text-white/90 text-[12px] font-bold">Earn Bonus: +\${bonusPercent}%</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
                                <span class="text-white/90 text-[12px] font-bold">\${perkText}</span>
                            </div>
                        </div>`;

content = content.replace(staticBottomPerks, dynamicBottomPerks);

fs.writeFileSync(file, content);
console.log('Successfully made bottom perks dynamic.');
