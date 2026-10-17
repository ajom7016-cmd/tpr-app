const natural = require('natural');
const classifier = new natural.BayesClassifier();

// 1. Train greetings
classifier.addDocument('hi', 'greeting');
classifier.addDocument('hello', 'greeting');
classifier.addDocument('hey', 'greeting');
classifier.addDocument('ki obostha', 'greeting');
classifier.addDocument('kemon aso', 'greeting');

// 2. Train withdrawal
classifier.addDocument('withdraw', 'withdraw');
classifier.addDocument('cash out', 'withdraw');
classifier.addDocument('taka tulbo', 'withdraw');
classifier.addDocument('taka pabo', 'withdraw');
classifier.addDocument('payment', 'withdraw');
classifier.addDocument('taka dibe', 'withdraw');
classifier.addDocument('withdrawal', 'withdraw');

// 3. Train VIP
classifier.addDocument('vip', 'vip');
classifier.addDocument('plan', 'vip');
classifier.addDocument('upgrade', 'vip');
classifier.addDocument('premium', 'vip');
classifier.addDocument('package', 'vip');

// 4. Train task
classifier.addDocument('task', 'task');
classifier.addDocument('kaj', 'task');
classifier.addDocument('work', 'task');
classifier.addDocument('youtube', 'task');
classifier.addDocument('facebook', 'task');
classifier.addDocument('video', 'task');

// 5. Train deposit
classifier.addDocument('deposit', 'deposit');
classifier.addDocument('recharge', 'deposit');
classifier.addDocument('add money', 'deposit');
classifier.addDocument('taka add', 'deposit');
classifier.addDocument('invest', 'deposit');

// 6. Train refer
classifier.addDocument('refer', 'refer');
classifier.addDocument('invite', 'refer');
classifier.addDocument('team', 'refer');
classifier.addDocument('bondhu', 'refer');

// 7. Train thanks
classifier.addDocument('thank', 'thanks');
classifier.addDocument('dhonnobad', 'thanks');
classifier.addDocument('thanks', 'thanks');

// 8. Train security
classifier.addDocument('password', 'security');
classifier.addDocument('login', 'security');
classifier.addDocument('security', 'security');

// Train the NLP model on startup
classifier.train();

function getReply(message) {
    const msg = message.toLowerCase();
    const intent = classifier.classify(msg);
    const classifications = classifier.getClassifications(msg);
    
    // Fallback if confidence is extremely low
    const maxConfidence = classifications[0].value;
    if (maxConfidence < 0.0001 && msg.split(' ').length > 2) {
        return "আমি আপনার কথাটি ঠিক বুঝতে পারিনি। দয়া করে উইথড্র, ভিআইপি প্ল্যান, বা কাজ সম্পর্কে সুনির্দিষ্ট প্রশ্ন করুন।";
    }

    switch(intent) {
        case 'withdraw':
            return "উইথড্র করার জন্য আপনার ব্যালেন্স অন্তত ৳৫০০ হতে হবে। আপনি Profile পেজ থেকে Bkash বা Nagad-এর মাধ্যমে টাকা তুলতে পারবেন। উইথড্র রিকোয়েস্ট দেওয়ার ২৪ ঘন্টার মধ্যে টাকা পেয়ে যাবেন।";
        case 'vip':
            return "আমাদের একাধিক VIP প্ল্যান আছে যা ৳১০০০ থেকে শুরু। VIP আপগ্রেড করলে আপনি প্রতিদিন বেশি ইনকাম করতে পারবেন। বিস্তারিত জানতে VIP পেজে যান।";
        case 'task':
            return "আপনি প্রতিদিন টাস্ক (YouTube ভিডিও দেখা, Facebook পোস্ট লাইক করা) কমপ্লিট করে টাকা ইনকাম করতে পারবেন। এখনই Tasks সেকশনে গিয়ে কাজ শুরু করুন!";
        case 'deposit':
            return "অ্যাকাউন্টে টাকা অ্যাড করতে VIP সেকশনে গিয়ে 'Deposit' এ ক্লিক করুন। Bkash বা Nagad এর মাধ্যমে ডিপোজিট করলে ৫-১০ মিনিটের মধ্যে টাকা অ্যাড হয়ে যাবে।";
        case 'refer':
            return "আপনার বন্ধুদের রেফার করে আপনি তাদের ইনকামের ১০% কমিশন পেতে পারেন! Profile পেজ থেকে আপনার রেফারেল লিংক কপি করে বন্ধুদের সাথে শেয়ার করুন।";
        case 'security':
            return "নিরাপত্তার স্বার্থে আপনার পাসওয়ার্ড কারো সাথে শেয়ার করবেন না। পাসওয়ার্ড পরিবর্তন করতে Profile > Security সেকশনে যান।";
        case 'greeting':
            return "হ্যালো! TPR সাপোর্টে আপনাকে স্বাগতম। আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
        case 'thanks':
            return "আপনাকেও অনেক ধন্যবাদ! আর কোনো সাহায্য লাগলে অবশ্যই জানাবেন।";
        default:
            return "আমি আপনার কথাটি ঠিক বুঝতে পারিনি। দয়া করে উইথড্র, ভিআইপি প্ল্যান, বা কাজ সম্পর্কে সুনির্দিষ্ট প্রশ্ন করুন।";
    }
}

module.exports = { getReply };
