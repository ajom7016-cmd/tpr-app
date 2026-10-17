const fs = require('fs');

const finalDepositHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Deposit</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0" rel="stylesheet" />
    <style>
        body { font-family: 'Outfit', sans-serif; -webkit-tap-highlight-color: transparent; }
        
        .glass-panel {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .btn-theme {
            background: #ea580c;
            color: white;
            transition: all 0.2s;
        }
        .btn-theme:active { transform: scale(0.97); }

        .input-glass {
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 1);
            transition: all 0.2s ease;
        }
        .input-glass:focus {
            background: rgba(255, 255, 255, 1);
            border-color: #ea580c;
            outline: none;
        }

        .chip-btn {
            background: rgba(255,255,255,0.7);
            border: 1px solid rgba(255,255,255,0.9);
            color: #475569;
            transition: all 0.2s;
        }
        .chip-btn.active {
            background: #ea580c;
            color: white;
            border-color: #ea580c;
        }

        .method-card {
            background: rgba(255,255,255,0.7);
            border: 1px solid rgba(255,255,255,0.9);
            transition: all 0.2s;
            cursor: pointer;
        }
        .method-card.active {
            border-color: #ea580c;
            background: rgba(255,255,255,1);
        }

        .logo-box {
            background: white;
            border-radius: 8px;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .logo-box img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .fade-in { animation: fadeIn 0.3s ease-in forwards; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="min-h-[100dvh] flex flex-col text-slate-800 p-4 pb-24">

    <!-- Header / Back -->
    <div class="mb-4 pt-2 pl-1 flex-none">
        <button class="text-slate-600 bg-white/50 backdrop-blur-md rounded-full border border-white/60 flex items-center p-2" onclick="window.parent.loadPage('glassmorphic_1/code.html', null)">
            <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
    </div>

    <!-- Step 1: Add Funds -->
    <div id="step-1" class="glass-panel p-5 fade-in w-full max-w-[400px] mx-auto">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-[22px] font-bold text-slate-800">Add Funds</h2>
                <p class="text-[12px] text-slate-500 mt-0.5">Deposit to your wallet</p>
            </div>
            <div class="flex items-center justify-center">
                <span class="material-symbols-outlined text-slate-800 text-[28px]">account_balance_wallet</span>
            </div>
        </div>

        <!-- Amount Input -->
        <div class="mb-5">
            <label class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Amount (Min ৳1000)</label>
            <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] font-semibold text-slate-700">৳</span>
                <input type="number" id="deposit-amount" value="1000" class="input-glass w-full h-12 pl-9 pr-4 rounded-[10px] text-[18px] font-semibold text-slate-800" placeholder="0" oninput="validateAmount()">
            </div>
            <p id="amount-error" class="text-[#ea580c] text-[11px] font-medium mt-1.5 ml-1 hidden">Minimum deposit is ৳1000</p>
        </div>

        <!-- Quick Chips -->
        <div class="flex flex-wrap gap-2 mb-6">
            <button class="chip-btn active px-3 py-1.5 rounded-[8px] text-[13px] font-medium" onclick="setAmount(1000, this)">৳ 1000</button>
            <button class="chip-btn px-3 py-1.5 rounded-[8px] text-[13px] font-medium" onclick="setAmount(2500, this)">৳ 2500</button>
            <button class="chip-btn px-3 py-1.5 rounded-[8px] text-[13px] font-medium" onclick="setAmount(5000, this)">৳ 5000</button>
            <button class="chip-btn px-3 py-1.5 rounded-[8px] text-[13px] font-medium" onclick="setAmount(10000, this)">৳ 10000</button>
        </div>

        <!-- Methods -->
        <label class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2 ml-1">Select Method</label>
        <div class="space-y-2.5 mb-6">
            <!-- bKash -->
            <div class="method-card active p-3 rounded-[10px] flex items-center justify-between" onclick="selectMethod('bkash', this)">
                <div class="flex items-center gap-3">
                    <div class="logo-box w-9 h-9">
                        <img src="../assets/bkash.png" alt="bKash">
                    </div>
                    <div>
                        <h3 class="font-semibold text-slate-800 text-[14px]">bKash</h3>
                    </div>
                </div>
                <div class="w-4 h-4 rounded-full border border-[#ea580c] flex items-center justify-center">
                    <div class="w-2 h-2 bg-[#ea580c] rounded-full"></div>
                </div>
            </div>

            <!-- Nagad -->
            <div class="method-card p-3 rounded-[10px] flex items-center justify-between" onclick="selectMethod('nagad', this)">
                <div class="flex items-center gap-3">
                    <div class="logo-box w-9 h-9">
                        <img src="../assets/nagad.png" alt="Nagad">
                    </div>
                    <div>
                        <h3 class="font-semibold text-slate-800 text-[14px]">Nagad</h3>
                    </div>
                </div>
                <div class="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <div class="w-2 h-2 bg-transparent rounded-full indicator"></div>
                </div>
            </div>

            <!-- Binance -->
            <div class="method-card p-3 rounded-[10px] flex items-center justify-between" onclick="selectMethod('binance', this)">
                <div class="flex items-center gap-3">
                    <div class="logo-box w-9 h-9">
                        <img src="../assets/binance.png" alt="Binance">
                    </div>
                    <div>
                        <h3 class="font-semibold text-slate-800 text-[14px]">Binance</h3>
                    </div>
                </div>
                <div class="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                    <div class="w-2 h-2 bg-transparent rounded-full indicator"></div>
                </div>
            </div>
        </div>

        <button id="btn-proceed" class="btn-theme w-full h-[48px] rounded-[10px] font-semibold text-[15px] flex items-center justify-center" onclick="proceedToStep2()">
            Proceed
        </button>
    </div>

    <!-- Step 2: Verify Payment -->
    <div id="step-2" class="glass-panel p-5 hidden fade-in w-full max-w-[360px] mx-auto my-auto">
        <div class="flex items-center gap-2 mb-5">
            <button class="text-slate-500 flex items-center" onclick="goBackToStep1()">
                <span class="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <h2 class="text-[18px] font-bold text-slate-800">Verify Payment</h2>
        </div>

        <div class="bg-white/40 border border-[#ea580c]/20 rounded-[12px] p-4 mb-5">
            <p class="text-[13px] font-medium text-slate-700 mb-3 leading-relaxed">
                Send exactly <strong class="text-[#ea580c]">৳<span id="display-amount">1000</span></strong> to the <span id="instruction-app" class="font-bold">bKash</span> number below.
            </p>
            
            <!-- Thin Number Box with orange border -->
            <div class="flex items-center justify-between bg-white px-3 py-2 rounded-[8px] border border-[#ea580c]/50">
                <span id="admin-number" class="text-[15px] font-semibold text-slate-800">01870161106</span>
                <button id="btn-copy" class="text-[#ea580c] flex items-center justify-center w-8 h-8 rounded-full hover:bg-orange-50 transition-colors" onclick="copyNumber()">
                    <span class="material-symbols-outlined text-[18px]" id="copy-icon">content_copy</span>
                </button>
            </div>
        </div>

        <!-- TrxID Input -->
        <div class="mb-6">
            <label class="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Transaction ID (TrxID)</label>
            <input type="text" id="trx-id" class="input-glass bg-white/70 w-full h-[48px] px-3 rounded-[8px] text-[14px] font-medium text-slate-800 placeholder:text-slate-400" placeholder="e.g. 9J6A7V8B9C">
        </div>

        <button id="btn-submit" class="btn-theme w-full h-[48px] rounded-[10px] font-semibold text-[15px] flex items-center justify-center" onclick="submitDeposit()">
            Submit
        </button>
    </div>

    <!-- Success Modal -->
    <div id="success-modal" class="fixed inset-0 z-[100] bg-slate-900/40 hidden items-center justify-center p-5">
        <div class="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-[300px] p-6 rounded-[16px] text-center fade-in">
            <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-green-600 text-[28px]">done_all</span>
            </div>
            <h2 class="text-[18px] font-bold text-slate-800 mb-1">Submitted</h2>
            <p class="text-slate-500 font-medium text-[13px] mb-5">Your deposit is being verified.</p>
            <button class="btn-theme w-full h-[44px] rounded-[8px] font-medium text-[14px]" onclick="closeModalAndGoHome()">
                OK
            </button>
        </div>
    </div>

    <script>
        let selectedMethod = 'bkash';
        let depositAmount = 1000;
        const adminNumber = '01870161106'; 
        const binanceAddress = 'TCx... (USDT TRC20 Address)';

        function validateAmount() {
            const input = document.getElementById('deposit-amount');
            const error = document.getElementById('amount-error');
            const btn = document.getElementById('btn-proceed');
            
            depositAmount = parseInt(input.value) || 0;
            
            document.querySelectorAll('.chip-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.chip-btn').forEach(btn => {
                if(parseInt(btn.innerText.replace(/\\D/g,'')) === depositAmount) {
                    btn.classList.add('active');
                }
            });

            if(depositAmount < 1000) {
                error.classList.remove('hidden');
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
            } else {
                error.classList.add('hidden');
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        }

        function setAmount(amount, element) {
            document.getElementById('deposit-amount').value = amount;
            validateAmount();
        }

        function selectMethod(method, element) {
            selectedMethod = method;
            
            document.querySelectorAll('.method-card').forEach(card => {
                card.classList.remove('active');
                card.style.borderColor = 'rgba(255,255,255,0.9)';
                const circle = card.querySelector('.rounded-full');
                circle.style.borderColor = '#cbd5e1'; 
                circle.querySelector('div').style.backgroundColor = 'transparent';
            });

            element.classList.add('active');
            const circle = element.querySelector('.rounded-full');
            circle.style.borderColor = '#ea580c';
            circle.querySelector('div').style.backgroundColor = '#ea580c';
        }

        function proceedToStep2() {
            if(depositAmount < 1000) return;
            
            document.getElementById('display-amount').innerText = depositAmount;
            
            const instructionApp = document.getElementById('instruction-app');
            const numberField = document.getElementById('admin-number');
            
            // Reset copy button icon
            const copyIcon = document.getElementById('copy-icon');
            copyIcon.innerText = 'content_copy';
            copyIcon.classList.remove('text-green-500');
            copyIcon.classList.add('text-[#ea580c]');
            
            if(selectedMethod === 'bkash') {
                instructionApp.innerText = 'bKash';
                numberField.innerText = adminNumber;
            } else if(selectedMethod === 'nagad') {
                instructionApp.innerText = 'Nagad';
                numberField.innerText = adminNumber;
            } else if(selectedMethod === 'binance') {
                instructionApp.innerText = 'Binance (USDT TRC20)';
                numberField.innerText = binanceAddress;
            }

            const step1 = document.getElementById('step-1');
            const step2 = document.getElementById('step-2');
            
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            step2.classList.add('flex', 'flex-col'); // Required for my-auto to center it
        }

        function goBackToStep1() {
            const step1 = document.getElementById('step-1');
            const step2 = document.getElementById('step-2');
            step2.classList.remove('flex', 'flex-col');
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
        }

        function copyNumber() {
            const number = document.getElementById('admin-number').innerText;
            const copyIcon = document.getElementById('copy-icon');
            
            navigator.clipboard.writeText(number).then(() => {
                copyIcon.innerText = 'done_all';
                copyIcon.classList.remove('text-[#ea580c]');
                copyIcon.classList.add('text-green-600');
                
                setTimeout(() => {
                    copyIcon.innerText = 'content_copy';
                    copyIcon.classList.remove('text-green-600');
                    copyIcon.classList.add('text-[#ea580c]');
                }, 2000);
            }).catch(() => {
                const tempInput = document.createElement("input");
                tempInput.value = number;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
                
                copyIcon.innerText = 'done_all';
                copyIcon.classList.remove('text-[#ea580c]');
                copyIcon.classList.add('text-green-600');
                
                setTimeout(() => {
                    copyIcon.innerText = 'content_copy';
                    copyIcon.classList.remove('text-green-600');
                    copyIcon.classList.add('text-[#ea580c]');
                }, 2000);
            });
        }

        function submitDeposit() {
            const trxId = document.getElementById('trx-id').value.trim();
            if(!trxId) {
                document.getElementById('trx-id').style.borderColor = '#ea580c';
                return;
            }

            const btn = document.getElementById('btn-submit');
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin mr-1 text-[18px]">sync</span> Submitting...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                const modal = document.getElementById('success-modal');
                modal.style.display = 'flex';
                btn.innerHTML = 'Submit';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }, 1000);
        }

        function closeModalAndGoHome() {
            if(window.parent && window.parent.loadPage) {
                window.parent.loadPage('glassmorphic_1/code.html', window.parent.document.querySelectorAll('.nav-btn')[0] || null);
            } else {
                window.location.href = '../glassmorphic_1/code.html';
            }
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('public/deposit_glass/code.html', finalDepositHTML);
console.log('Applied final tweaks based on screenshots.');
