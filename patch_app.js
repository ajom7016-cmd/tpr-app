const fs = require('fs');
let app = fs.readFileSync('public/js/app.js', 'utf8');

const apiAdditions = \
    async getDevices() {
        if (!authToken) return [];
        try {
            const res = await fetch(\\/devices\, {
                headers: { 'Authorization': \Bearer \\ }
            });
            if (res.ok) return await res.json();
            return [];
        } catch (e) {
            console.error('Error fetching devices:', e);
            return [];
        }
    },
    async logout() {
        if (!authToken) {
            this.clearSession();
            return;
        }
        try {
            await fetch(\\/logout\, {
                method: 'POST',
                headers: { 'Authorization': \Bearer \\ }
            });
        } catch(e) {}
        this.clearSession();
    },\;

// Insert after getProfile
app = app.replace("getProfile() {", apiAdditions + "\n    async getProfile() {");
fs.writeFileSync('public/js/app.js', app);
console.log('Patched app.js');
