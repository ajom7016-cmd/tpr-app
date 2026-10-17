const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. In generateTasks, replace `let completed = 0;` with `window.completedTasks = 0;`
content = content.replace(/let completed = 0;/g, 'window.completedTasks = 0;');
// And the subsequent usages in generateTasks
content = content.replace(/\$\{completed\}\//g, '${window.completedTasks}/');
content = content.replace(/\(completed \//g, '(window.completedTasks /');

// 2. In startMultiTask, replace `completed++` with `window.completedTasks++`
content = content.replace(/completed\+\+;/g, 'window.completedTasks++;');
// And usages
content = content.replace(/completed \+ '\/' \+ totalLimit;/g, 'window.completedTasks + \'/\' + totalLimit;');
content = content.replace(/\(completed \/ totalLimit\)/g, '(window.completedTasks / totalLimit)');

fs.writeFileSync(file, content);
console.log('Fixed completed tasks scoping issue.');
