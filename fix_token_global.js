const fs = require('fs');

let file = 'public/profile_settings_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the loadData token access with getToken
content = content.replace(/let token = null;\n\s*try \{\n\s*token = window\.parent\.localStorage\.getItem\('userToken'\);\n\s*\} catch \(e\) \{\n\s*\/\/ Ignore cross-origin or security errors\n\s*\}\n\s*if \(\!token\) \{\n\s*try \{\n\s*token = localStorage\.getItem\('userToken'\);\n\s*\} catch \(e\) \{ \}\n\s*\}/, "const token = getToken();");

// Replace the saveProfile token access with getToken
content = content.replace(/const token = window\.parent\.localStorage\.getItem\('userToken'\) \|\| localStorage\.getItem\('userToken'\);/, "const token = getToken();");

// Add the getToken helper function at the top of the script
const getTokenScript = `
        function getToken() {
            let t = null;
            try { t = window.parent.localStorage.getItem('userToken'); } catch(e) {}
            if (!t) { try { t = localStorage.getItem('userToken'); } catch(e) {} }
            return t;
        }
`;

content = content.replace("let currentProfile = null;", getTokenScript + "\n        let currentProfile = null;");

fs.writeFileSync(file, content);
console.log('Fixed token access globally in Edit Profile');
