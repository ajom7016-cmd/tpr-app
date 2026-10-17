const fs = require('fs');

const injectErrorLogger = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    const logger = `
    <script>
        window.onerror = function(msg, url, lineNo, columnNo, error) {
            let errStr = "ERROR: " + msg + " @ Line: " + lineNo;
            console.error(errStr);
            let div = document.createElement('div');
            div.style = "position:fixed;top:0;left:0;width:100%;background:red;color:white;z-index:999999;padding:20px;font-size:16px;font-weight:bold;";
            div.innerText = errStr;
            document.body.appendChild(div);
            return false;
        };
        window.addEventListener("unhandledrejection", function(event) {
            let errStr = "PROMISE REJECTION: " + (event.reason ? event.reason.toString() : "Unknown");
            console.error(errStr);
            let div = document.createElement('div');
            div.style = "position:fixed;top:60px;left:0;width:100%;background:orange;color:white;z-index:999999;padding:20px;font-size:16px;font-weight:bold;";
            div.innerText = errStr;
            document.body.appendChild(div);
        });
    </script>
    `;
    
    // Inject right after <body>
    content = content.replace(/<body[^>]*>/, match => match + '\n' + logger);
    fs.writeFileSync(file, content);
};

injectErrorLogger('public/glassmorphic_1/code.html');
injectErrorLogger('public/glassmorphic_2/code.html');
console.log('Injected visual error logger into both pages.');
