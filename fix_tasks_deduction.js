const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. We need to extract the profile fetching block
// 2. Put it BEFORE the `platformLimits` distribution
// 3. Subtract completedTasks from platformLimits

// The current profile fetch block:
const fetchBlock = `
    window.completedTasks = 0;
    try {
        const profile = await window.APP.getProfile();
        if (profile && profile.today_tasks) {
            window.completedTasks = profile.today_tasks;
        }
    } catch(e) {}
    document.getElementById('task-progress-text').innerText = \`\${window.completedTasks}/\${limit}\`;
`;

// Remove it from the bottom
content = content.replace(fetchBlock, "    document.getElementById('task-progress-text').innerText = `${window.completedTasks}/${limit}`;");

// Let's insert the fetch logic right after `let limit = limitMap[vipInfo.level] || 1;`
const targetInsert = "const limitMap = {0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14};\n                let limit = limitMap[vipInfo.level] || 1;";

const newInsert = targetInsert + `
                
                window.completedTasks = 0;
                try {
                    const profileProf = await window.APP.getProfile();
                    if (profileProf && profileProf.today_tasks) {
                        window.completedTasks = profileProf.today_tasks;
                    }
                } catch(e) {}
`;
content = content.replace(targetInsert, newInsert);

// Now let's update the platformLimits deduction right after it is generated:
const limitGenBlock = `                  let remaining = limit;
                  let idx = 0;
                  while (remaining > 0) {
                      platformLimits[platforms[idx % 4]]++;
                      remaining--;
                      idx++;
                  }`;

const newLimitGenBlock = limitGenBlock + `
                  
                  let remainingToDeduct = window.completedTasks;
                  let deductIdx = 0;
                  while(remainingToDeduct > 0 && deductIdx < 100) { // safety limit
                      let platform = platforms[deductIdx % 4];
                      if (platformLimits[platform] > 0) {
                          platformLimits[platform]--;
                          remainingToDeduct--;
                      }
                      deductIdx++;
                  }
`;
content = content.replace(limitGenBlock, newLimitGenBlock);

fs.writeFileSync(file, content);
console.log('Fixed Tasks persistence across page reloads!');
