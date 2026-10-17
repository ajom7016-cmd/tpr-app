const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');
const badStr = "role: taapp.get('/api/profile'";
server = server.replace(badStr, "role: targetUser.role } });\n    });\n});\n\n// 3. Get User Profile\napp.get('/api/profile'");
// also fix the weird trailing stuff at the end of change-password
const badTail = "+});ssword changed successfully' });\n+        });\n+    });\n });";
server = server.replace("+});ssword changed successfully' });\r\n+        });\r\n+    });\r\n });", "");
fs.writeFileSync('server.js', server);
console.log('Fixed');
