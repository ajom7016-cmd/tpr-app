const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// The logic we want to insert where we loop over baseTasks
const dynamicRewardLogic = `
                    // Render exactly 4 cards
                    const roiMap = { 0: 10, 1: 53, 2: 114.25, 3: 257.90, 4: 580, 5: 1341, 6: 3000 };
                    const dynamicReward = (roiMap[vipInfo.level] || 10) / limit;
                    
                    baseTasks.forEach(task => {
`;

// Replace `baseTasks.forEach(task => {` with the dynamic logic
content = content.replace(/baseTasks\.forEach\(task => \{/, dynamicRewardLogic);

// Now change `task.reward` to `dynamicReward` in the HTML template string
// Replace: \${parseFloat(task.reward).toFixed(2)} with \${parseFloat(dynamicReward).toFixed(2)}
// Replace: startMultiTask(\${task.id}, \${task.reward}) with startMultiTask(\${task.id}, \${dynamicReward})
content = content.replace(/\$\{parseFloat\(task\.reward\)\.toFixed\(2\)\}/g, '${parseFloat(dynamicReward).toFixed(2)}');
content = content.replace(/startMultiTask\(\$\{task\.id\}, \$\{task\.reward\}\)/g, 'startMultiTask(${task.id}, ${dynamicReward})');

fs.writeFileSync(file, content);
console.log('Successfully updated tasks to use dynamic reward based on VIP plan.');
