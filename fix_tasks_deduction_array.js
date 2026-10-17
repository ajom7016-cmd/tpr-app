const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');
let lines = content.split('\n');

// Phase 1: Set window.completedTasks from profile response
let foundProfile = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("vipInfo.level = parseInt(p.vip_plan.replace('VIP ', '')) || 1;")) {
        // Insert window.completedTasks = p.today_tasks || 0; right after this block or right before it
        lines.splice(i, 0, "                          window.completedTasks = p.today_tasks || 0;");
        foundProfile = true;
        break;
    }
}

// Phase 2: Deduct completed tasks from platformLimits
let foundLimitGen = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("platformLimits[platforms[idx % 4]]++;") && lines[i-1].includes("while (remaining > 0)")) {
        // Find the end of this while loop
        let j = i;
        while (!lines[j].includes("}")) {
            j++;
        }
        
        // Insert deduction logic after the while loop finishes
        const deductionBlock = `
                let remainingToDeduct = window.completedTasks;
                let deductIdx = 0;
                while(remainingToDeduct > 0 && deductIdx < 100) {
                    let platform = platforms[deductIdx % 4];
                    if (platformLimits[platform] > 0) {
                        platformLimits[platform]--;
                        remainingToDeduct--;
                    }
                    deductIdx++;
                }`;
        lines.splice(j + 1, 0, deductionBlock);
        foundLimitGen = true;
        break;
    }
}

// Phase 3: Make sure task-progress-text reflects it ON LOAD
let foundProgress = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<span id="task-progress-text"')) {
        // Change "0/0" to dynamically use window.completedTasks and limit.
        // Wait, it's HTML here! 
        lines[i] = lines[i].replace('>0/0<', '>${window.completedTasks}/${limit}<');
        foundProgress = true;
        break;
    }
}

// Phase 4: Make sure progress bar width reflects it ON LOAD
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<div id="task-progress-bar"')) {
        lines[i] = lines[i].replace('style="width: 0%;', 'style="width: ${limit > 0 ? (window.completedTasks / limit) * 100 : 0}%;');
        break;
    }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed Tasks deduction arrays: Profile=' + foundProfile + ' LimitGen=' + foundLimitGen + ' Progress=' + foundProgress);
