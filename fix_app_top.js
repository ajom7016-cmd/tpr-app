const fs = require('fs');
let app = \// Global App state and API methods
const API_URL = '/api';
let authToken = localStorage.getItem('userToken');

window.APP = {
    // Auth Check
    checkAuth: function() {
        if (!authToken) {
            window.parent.location.href = '/login.html';
        }
    },

    // Get User Profile
    getProfile: async function() {
        if(!authToken) return null;
        try {
            const res = await fetch(\\\\\\/profile?t=\\\ + new Date().getTime(), {
                headers: { 'Authorization': \\\Bearer \\\\\\ }
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) this.logout();
                return null;
            }
            return await res.json();
        } catch (e) {
            console.error('Error fetching profile:', e);
            return null;
        }
    },

    getDevices: async function() {
        if (!authToken) return [];
        try {
            const res = await fetch(\\\\\\/devices?t=\\\ + new Date().getTime(), {
                headers: { 'Authorization': \\\Bearer \\\\\\ }
            });
            if (res.ok) return await res.json();
            return [];
        } catch (e) {
            console.error('Error fetching devices:', e);
            return [];
        }
    },
    
    logout: async function() {
        if (!authToken) {
            this.clearSession();
            return;
        }
        try {
            await fetch(\\\\\\/logout\\\, {
                method: 'POST',
                headers: { 'Authorization': \\\Bearer \\\\\\ }
            });
        } catch(e) {}
        this.clearSession();
    },

    changePassword: async (currentPassword, newPassword) => {\;

let currentApp = fs.readFileSync('public/js/app.js', 'utf8');
const changePassIndex = currentApp.indexOf('changePassword: async (currentPassword, newPassword) => {');
if(changePassIndex > -1) {
    fs.writeFileSync('public/js/app.js', app + currentApp.substring(changePassIndex + 59));
    console.log('Fixed app.js');
} else {
    console.log('Could not find changePassword block in app.js');
}
