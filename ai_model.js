const natural = require('natural');
const classifier = new natural.BayesClassifier();

// 1. Train greetings
['hi', 'hello', 'hey', 'hy', 'assalamu alaikum', 'salam', 'kemon aso', 'ki obostha', 'valo ni', 'কেমন আছেন', 'হ্যালো', 'সালাম', 'হাই'].forEach(doc => {
    classifier.addDocument(doc, 'greeting');
});

// 2. Train withdrawal
['withdraw', 'withdrawal', 'cash out', 'taka tulbo', 'taka pabo', 'payment', 'taka kivabe pabo', 'উইথড্র', 'টাকা তুলব', 'ক্যাশ আউট', 'টাকা পাঠানো', 'উত্তোলন', 'বিকাশ উইথড্র', 'নগদ উইথড্র', 'minimum withdraw', 'koto taka hole tola jay'].forEach(doc => {
    classifier.addDocument(doc, 'withdraw');
});

// 3. Train VIP & Plans
['vip', 'plan', 'upgrade', 'premium', 'package', 'ভিআইপি', 'প্ল্যান', 'প্যাকেজ', 'আপগ্রেড', 'ইনকাম বাড়াব', 'vip 1', 'vip 2', 'vip 3', 'vip price', 'কত টাকা লাভ', 'roi', 'daily income'].forEach(doc => {
    classifier.addDocument(doc, 'vip');
});

// 4. Train task & work
['task', 'kaj', 'work', 'youtube', 'facebook', 'video', 'tiktok', 'telegram', 'টাস্ক', 'কাজ', 'কাজ কি', 'কিভাবে কাজ করব', 'দৈনিক কাজ', 'কাজ আসছে না', 'task kivabe korbo', 'earn money', 'daily task'].forEach(doc => {
    classifier.addDocument(doc, 'task');
});

// 5. Train deposit & recharge
['deposit', 'recharge', 'add money', 'taka add', 'invest', 'টাকা ঢুকাব', 'রিচার্জ', 'ডিপোজিট', 'টাকা লোড', 'টাকা অ্যাড', 'বিকাশে টাকা দিব', 'নগদে টাকা দিব', 'how to deposit'].forEach(doc => {
    classifier.addDocument(doc, 'deposit');
});

// 6. Train refer & team
['refer', 'referral', 'invite', 'team', 'bondhu', 'রেফার', 'ইনভাইট', 'রেফারেল', 'কমিশন', 'বন্ধু', 'রেফার কোড', 'দল'].forEach(doc => {
    classifier.addDocument(doc, 'refer');
});

// 7. Train thanks
['thank', 'thanks', 'dhonnobad', 'onek dhonnobad', 'ধন্যবাদ', 'থ্যাংকস', 'shukriya'].forEach(doc => {
    classifier.addDocument(doc, 'thanks');
});

// 8. Train security & PIN
['password', 'pin', 'login', 'security', 'পাসওয়ার্ড', 'পিন', 'লগইন', 'লক', 'সিকিউরিটি', 'নিরাপত্তা', 'আইডি লক'].forEach(doc => {
    classifier.addDocument(doc, 'security');
});

// 9. Train Robot identity
['robot', 'tumi ke', 'who are you', 'bot', 'রোবট', 'তুমি কে', 'তুমি কি মানুষ', 'ai', 'assistant', 'সাপোর্ট'].forEach(doc => {
    classifier.addDocument(doc, 'identity');
});

// 10. Train Free plan
['free plan', 'free', 'ফ্রি প্ল্যান', 'ফ্রি', '২ দিন', '2 days', 'lock', 'লক'].forEach(doc => {
    classifier.addDocument(doc, 'free_plan');
});

// Train the NLP model on startup
classifier.train();

function getReply(message) {
    if (!message || typeof message !== 'string') {
        return "হ্যালো! TPR সাপোর্টে আপনাকে স্বাগতম। আমি TPR AI রোবট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
    }

    const msg = message.toLowerCase().trim();

    // Fast keyword triggers for maximum accuracy
    if (msg.includes('withdraw') || msg.includes('cash out') || msg.includes('tulbo') || msg.includes('উইথড্র') || msg.includes('উত্তোলন')) {
        return "উইথড্র করার নিয়ম:\n১. আপনার অ্যাকাউন্টে সর্বনিম্ন ৳১০০ ব্যালেন্স থাকতে হবে।\n২. Profile পেজে গিয়ে 'Withdraw' বাটনে ক্লিক করে bKash বা Nagad সিলেক্ট করুন।\n৩. উইথড্র রিকোয়েস্ট দেওয়ার ২৪ ঘণ্টার মধ্যে টাকা আপনার অ্যাকাউন্টে পৌঁছে যাবে।";
    }

    if (msg.includes('vip') || msg.includes('plan') || msg.includes('ভিআইপি') || msg.includes('প্ল্যান') || msg.includes('package')) {
        return "TPR VIP প্ল্যানসমূহ:\n• VIP 1: ৳১,৬৯৯ (প্রতিদিন ৪টি টাস্ক = ৳৫৩)\n• VIP 2: ৳৩,১৯৯ (প্রতিদিন ৬টি টাস্ক = ৳১১৪.২৫)\n• VIP 3: ৳৬,১৯০ (প্রতিদিন ৮টি টাস্ক = ৳২৫৭.৯০)\n• VIP 4: ৳১২,১৮০ (প্রতিদিন ১০টি টাস্ক = ৳৫৮০)\n• VIP 5: ৳২৪,১৫০ (প্রতিদিন ১২টি টাস্ক = ৳১,৩৪১)\n• VIP 6: ৳৪৮,০০০ (প্রতিদিন ১৪টি টাস্ক = ৳৩,০০০)\nবিস্তারিত জানতে VIP বা PLAN সেকশনে যান।";
    }

    if (msg.includes('deposit') || msg.includes('recharge') || msg.includes('ডিপোজিট') || msg.includes('রিচার্জ') || msg.includes('add money')) {
        return "ডিপোজিট করার নিয়ম:\n১. VIP পেজে গিয়ে যে প্ল্যান নিতে চান তার নিচে 'Deposit' বা 'Upgrade' এ ক্লিক করুন।\n২. প্রদত্ত অফিশিয়াল bKash বা Nagad নম্বরে 'Send Money' করুন।\n৩. ট্রানজেকশন আইডি (TrxID) ও স্ক্রিনশট সাবমিট করলে ৫-১০ মিনিটের মধ্যে টাকা অ্যাকাউন্টে জমা হবে।";
    }

    if (msg.includes('task') || msg.includes('kaj') || msg.includes('কাজ') || msg.includes('টাস্ক') || msg.includes('work')) {
        return "টাস্ক বা কাজের নিয়ম:\n১. নিচের 'Tasks' অপশনে ক্লিক করুন।\n২. YouTube, Facebook, Telegram বা TikTok টাস্কে 'Start' চাপুন।\n৩. কাজটি সম্পন্ন করে লিংকে কিছুক্ষণ ভিজিট করলে আপনার ব্যালেন্সে তাৎক্ষণিক টাকা যোগ হয়ে যাবে!";
    }

    if (msg.includes('refer') || msg.includes('invite') || msg.includes('রেফার') || msg.includes('টিম')) {
        return "রেফার কমিশন:\nআপনার রেফারেল লিংক বন্ধুদের সাথে শেয়ার করুন। আপনার রেফারে কেউ যুক্ত হয়ে কাজ করলে তাদের দৈনিক আয়ের ১০% আজীবন কমিশন পাবেন!";
    }

    if (msg.includes('robot') || msg.includes('tumi ke') || msg.includes('রোবট') || msg.includes('who are you')) {
        return "আমি TPR অ্যাপের অফিশিয়াল AI রোবট অ্যাসিস্ট্যান্ট!🤖\nআমি দিনরাত ২৪ ঘণ্টা ব্যবহারকারীদের ইনকাম, টাস্ক, উইথড্র, ডিপোজিট এবং যেকোনো সমস্যায় তাৎক্ষণিক সাহায্য প্রদান করি।";
    }

    // Run Bayes classifier for NLP matching
    const intent = classifier.classify(msg);

    switch(intent) {
        case 'withdraw':
            return "উইথড্র করার নিয়ম:\nআপনার অ্যাকাউন্টে অন্তত ৳১০০ থাকতে হবে। Profile পেজ থেকে bKash বা Nagad এর মাধ্যমে ২৪ ঘণ্টার মধ্যে নিরাপদে টাকা তুলতে পারবেন।";
        case 'vip':
            return "TPR-এ একাধিক VIP প্ল্যান রয়েছে (VIP 1 থেকে VIP 6)। আপগ্রেড করলে প্রতিদিন নিশ্চিত বেশি আয়ের সুযোগ রয়েছে। PLAN সেকশন থেকে বিস্তারিত দেখুন।";
        case 'task':
            return "প্রতিদিন Tasks সেকশনে গিয়ে YouTube ভিডিও দেখা ও Facebook পোস্ট লাইক করে টাকা আয় করতে পারবেন। এখনই Tasks-এ গিয়ে কাজ শুরু করুন!";
        case 'deposit':
            return "ডিপোজিট করতে VIP সেকশনে গিয়ে 'Deposit'-এ চাপুন। bKash বা Nagad-এ টাকা পাঠানোর পর TrxID সাবমিট করলে ৫-১০ মিনিটে টাকা যোগ হবে।";
        case 'refer':
            return "Profile পেজে আপনার নিজস্ব রেফারেল কোড ও লিংক পেয়ে যাবেন। বন্ধুদের আমন্ত্রণ জানালে তাদের কাজের ১০% কমিশন লাভ করবেন।";
        case 'security':
            return "নিরাপত্তার জন্য Profile > Security সেকশন থেকে আপনার পাসওয়ার্ড ও উইথড্র PIN পরিবর্তন এবং বায়োমেট্রিক চালু করে রাখতে পারেন।";
        case 'greeting':
            return "হ্যালো! TPR সাপোর্টে আপনাকে স্বাগতম। আমি আপনার সহায়তায় প্রস্তুত। আপনি কি জানতে চান?";
        case 'thanks':
            return "আপনাকেও অনেক ধন্যবাদ! আপনার যাত্রা শুভ হোক। অন্য কোনো প্রশ্ন থাকলে নিশ্চিন্তে বলুন।";
        case 'free_plan':
            return "ফ্রি প্ল্যানে ২ দিন (মোট ৳১০০) কাজ করা যায়। মেয়াদ শেষ হলে নিয়মিত কাজের জন্য VIP ১ বা তদূর্ধ্ব প্ল্যানে আপগ্রেড করুন।";
        case 'identity':
            return "আমি TPR AI রোবট। TPR অ্যাপ সংক্রান্ত যেকোনো তথ্য বা সমস্যায় আমি আপনাকে সহায়তা করছি।";
        default:
            return "আমি TPR AI রোবট। আপনি উইথড্র, কাজ (টাস্ক), ভিআইপি প্ল্যান, ডিপোজিট বা রেফার সংক্রান্ত যেকোনো প্রশ্ন করতে পারেন, আমি সাথে সাথে উত্তর দিব!";
    }
}

module.exports = { getReply };
