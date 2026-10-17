const fs = require('fs');

function restoreHeader(file, matchStr, injectStr) {
    if (!fs.existsSync(file)) return;
    let text = fs.readFileSync(file, 'utf8');
    if (!text.includes(matchStr)) return;
    if (text.includes(injectStr)) return; // Already injected
    
    text = text.replace(matchStr, injectStr + '\n' + matchStr);
    fs.writeFileSync(file, text);
    console.log('Restored ' + file);
}

// 1. security_glass
restoreHeader('public/security_glass/code.html', 
    '<div class="relative z-10 w-24 h-24 rounded-full bg-white/70', 
    `<div class="max-w-[400px] mx-auto px-6 relative z-10 space-y-8">
        <div class="px-6 mb-6 flex items-center relative z-20">
            <h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center w-full cursor-pointer" onclick="toggleGoogleTest()">Security Center</h1>
        </div>
        <div class="flex flex-col items-center mt-2 mb-6">
            <div class="relative mb-4">`
);

// 2. profile_settings_glass
restoreHeader('public/profile_settings_glass/code.html',
    '<div class="avatar-edit shadow-md"',
    `<div class="max-w-[400px] mx-auto px-6 relative z-10 space-y-8">
        <div class="px-6 mb-8 flex items-center relative z-10">
            <h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center w-full">Edit Profile</h1>
        </div>
        <div class="flex flex-col items-center mt-2 mb-6">
            <div class="relative mb-4">
                <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
                    <img src="/assets/profile-default.jpg" id="prof-avatar" class="w-full h-full object-cover">
                </div>`
);

// 3. bank_details_glass
restoreHeader('public/bank_details_glass/code.html',
    '<div class="mt-auto pt-6 shrink-0">',
    `<div class="max-w-[400px] mx-auto relative z-10 h-full flex flex-col pt-6">
        <div class="px-6 pb-4 relative z-10">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center w-full">Bank Details</h1>
            </div>
            <p class="text-[13px] font-bold text-slate-500 mb-6 text-center">Manage your linked accounts</p>

            <div id="bank-list" class="flex-1 overflow-y-auto pr-2 -mr-2">
                <!-- Rendered via JS -->
            </div>
        </div>`
);

// 4. security_2fa
restoreHeader('public/security_2fa/code.html',
    '<div id="setupCard"',
    `<div class="px-6 mb-6 flex items-center justify-between relative z-20">
            <h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center w-full">Two-Factor Auth</h1>
        </div>`
);

// 5. security_devices
restoreHeader('public/security_devices/code.html',
    '<div class="map-hero"',
    `<div class="max-w-[400px] mx-auto px-6 relative z-10 space-y-6 pt-6">
        <h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center truncate mb-6">Active Devices</h1>`
);
