function getAuthToken() {
    let token = localStorage.getItem('userToken');
    if (!token && window.parent) {
        try { token = window.parent.localStorage.getItem('userToken'); } catch(e){}
    }
    return token;
}
// Global App state and API methods
const API_URL = '/api';


window.APP = {
    // Auth Check
    checkAuth: function() {
        if (!getAuthToken()) {
            window.parent.location.href = '/login.html';
        }
    },

    // Get User Profile
    getProfile: async function() {
        if(!getAuthToken()) return null;
        try {
            const res = await fetch(`${API_URL}/profile?t=` + new Date().getTime(), {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
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

    updateProfile: async function(name, email) {
        if(!getAuthToken()) return { success: false, error: 'Unauthorized' };
        try {
            const res = await fetch(`${API_URL}/update-profile`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ name, email })
            });
            return await res.json();
        } catch(e) {
            return { success: false, error: 'Network error' };
        }
    },

    getBanks: async function() {
        if (!getAuthToken()) return [];
        try {
            const res = await fetch(`${API_URL}/banks`, {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            if (res.ok) return await res.json();
            return [];
        } catch (e) {
            console.error('Error fetching banks:', e);
            return [];
        }
    },

    addBank: async function(provider, account_number, auth_value) {
        if(!getAuthToken()) return { success: false, error: 'Unauthorized' };
        try {
            const res = await fetch(`${API_URL}/banks`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ provider, account_number, auth_value })
            });
            return await res.json();
        } catch(e) {
            return { success: false, error: 'Network error' };
        }
    },

    getDevices: async function() {
        if (!getAuthToken()) return [];
        try {
            const res = await fetch(`${API_URL}/devices?t=` + new Date().getTime(), {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            if (res.ok) return await res.json();
            return [];
        } catch (e) {
            console.error('Error fetching devices:', e);
            return [];
        }
    },
    
    logout: async function() {
        if (!getAuthToken()) {
            this.clearSession();
            return;
        }
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
        } catch(e) {}
        this.clearSession();
    },
    
    
    changePassword: async (currentPassword, newPassword) => {
        try {
            const res = await fetch(`${API_URL}/change-password`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            return data;
        } catch (e) {
            return { error: 'Network error' };
        }
    },

    verifyPassword: async (password) => {
        try {
            const res = await fetch(`${API_URL}/verify-password`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({ password })
            });
            return await res.json();
        } catch (e) {
            return { error: 'Network error' };
        }
    },

    setWithdrawPin: async function(currentPin, newPin) {
        if(!getAuthToken()) return { success: false, error: 'Unauthorized' };
        try {
            const res = await fetch(`${API_URL}/set-pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
                body: JSON.stringify({ currentPin, newPin })
            });
            const data = await res.json();
            return { success: res.ok, error: data.error };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },

    // Login
    login: async function(contact, password) {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('tpr_auth_provider', 'email');
                
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },

    // Register
    register: async function(name, phone, email, password) {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email, password })
            });
            const data = await res.json();
            if (res.ok) return { success: true };
            return { success: false, error: data.error };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },

    
    // OTP Methods
    sendOTP: async function(email, phone, name) {
        try {
            const res = await fetch(`${API_URL}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, name })
            });
            const data = await res.json();
            return { success: res.ok, data };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },
        sendForgotOTP: async function(contact) {
        try {
            const res = await fetch(`${API_URL}/forgot-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact })
            });
            const data = await res.json();
            return { success: res.ok, data, error: data.error };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },
    verifyOTP: async function(email, code) {
        try {
            const res = await fetch(`${API_URL}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();
            return { success: res.ok, data };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },

    // Logout
    getRecentEarnings: async function() {
        if(!getAuthToken()) return [];
        try {
            const res = await fetch(`${API_URL}/recent-earnings?t=` + new Date().getTime(), {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.error(e);
        }
        return [];
    },
    logout: function() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('tpr_pin');
        try { window.parent.localStorage.removeItem('userToken'); } catch(e){}
        window.parent.location.href = '/login.html';
    },

    setWithdrawPin: async function(currentPin, newPin) {
        if(!getAuthToken()) return { success: false, error: 'Unauthorized' };
        try {
            const res = await fetch(`${API_URL}/set-pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
                body: JSON.stringify({ currentPin, newPin })
            });
            const data = await res.json();
            return { success: res.ok, error: data.error };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },

    // Login
    login: async function(contact, password) {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('tpr_auth_provider', 'email');
                
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },

    // Register
    register: async function(name, phone, email, password) {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email, password })
            });
            const data = await res.json();
            if (res.ok) return { success: true };
            return { success: false, error: data.error };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },

    
    // OTP Methods
    sendOTP: async function(email, phone, name) {
        try {
            const res = await fetch(`${API_URL}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, name })
            });
            const data = await res.json();
            return { success: res.ok, data };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },
        sendForgotOTP: async function(contact) {
        try {
            const res = await fetch(`${API_URL}/forgot-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact })
            });
            const data = await res.json();
            return { success: res.ok, data, error: data.error };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },
    verifyOTP: async function(email, code) {
        try {
            const res = await fetch(`${API_URL}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();
            return { success: res.ok, data };
        } catch (e) {
            return { success: false, error: 'Connection error' };
        }
    },

    // Logout
    logout: function() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('tpr_pin');
        
        window.parent.location.href = '/login.html';
    },

    // Fetch Tasks
    getTasks: async function() {
        try {
            const res = await fetch(`${API_URL}/tasks`, {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            if (res.ok) return await res.json();
            return [];
        } catch (e) { return []; }
    },

    // Fetch Recent Earnings
    getRecentEarnings: async function() {
        try {
            const res = await fetch(`${API_URL}/recent-earnings`, {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            if (res.ok) return await res.json();
            return [];
        } catch (e) { return []; }
    },

    // Fetch Transactions
    getTransactions: async function() {
        try {
            const res = await fetch(`${API_URL}/transactions`, {
                headers: { 'Authorization': `Bearer ${getAuthToken()}` }
            });
            if (res.ok) return await res.json();
            return [];
        } catch (e) { return []; }
    },

    // Complete Task
    completeTask: async function(taskId) {
        try {
            const res = await fetch(`${API_URL}/tasks/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
                body: JSON.stringify({ taskId })
            });
            return await res.json();
        } catch (e) { return { error: 'Error completing task' }; }
    },

    // Request Withdrawal
    withdraw: async function(amount, method) {
        try {
            const res = await fetch(`${API_URL}/withdraw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getAuthToken()}` },
                body: JSON.stringify({ amount, method })
            });
            const data = await res.json();
            return { ok: res.ok, ...data };
        } catch (e) { return { ok: false, error: 'Error' }; }
    }
};

// Auto check auth on load if inside iframe
if(window.self !== window.top) {
    window.APP.checkAuth();
}

window.isLandingDemo = (() => { try { return window.top.location.pathname === '/' || window.top.location.pathname === '/index.html'; } catch(e) { return false; } })();
if (window.isLandingDemo) {
    const originalGetProfile = window.APP.getProfile;
    window.APP.getProfile = async function() {
        return {
            id: 9999,
            phone: "01700000000",
            balance: 845600.50,
            vip_plan: "VIP 5",
            avatar_url: "https://i.pravatar.cc/300?u=a042581f4e29026704d",
            created_at: new Date().toISOString()
        };
    };
    window.APP.checkAuth = function() {}; // Disable redirect
    const originalWithdraw = window.APP.withdraw;
    window.APP.withdraw = async function(amount, method) {
        alert("This is a demo account! Withdrawals are disabled.");
        return { success: false, error: "Demo Account" };
    };
}
if (window.isLandingDemo) {
    window.APP.getTasks = async function() {
        return [
            { id: 1, title: 'Watch YouTube Video', reward: 50, platform: 'YouTube', status: 'pending' },
            { id: 2, title: 'Like Facebook Page', reward: 20, platform: 'Facebook', status: 'pending' }
        ];
    };
    window.APP.getRecentEarnings = async function() {
        return [
            { title: 'YouTube Video Task', amount: 500, type: 'task' },
            { title: 'Facebook Share', amount: 250, type: 'task' }
        ];
    };
    window.APP.getTransactions = async function() {
        return [];
    };
}


// Block interactions in Demo Mode
document.addEventListener('DOMContentLoaded', () => {
    if (typeof isLandingDemo !== 'undefined' && isLandingDemo) {
        document.body.addEventListener('click', (e) => {
            const clickableElements = 'button, a, [onclick], .cursor-pointer, .action-box, .btn-primary, .btn-deposit, .btn-subscribe, .list-btn, .searchable-item';
            const btn = e.target.closest(clickableElements);
            
            if (btn) {
                // Allow Bottom Nav to switch tabs
                if (btn.closest('.bottom-nav')) return;
                
                // Allow Support button (check text and ID)
                const text = (btn.innerText || '').toLowerCase();
                if (text.includes('support') || btn.id === 'support-btn' || btn.closest('[onclick*="support"]')) return;
                
                // Block everything else
                e.preventDefault();
                e.stopPropagation();
                alert('This is a demo preview! Please download the app to use this feature.');
            }
        }, true);
    }
});