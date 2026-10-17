const fs = require('fs');

const clean = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    const parts = content.split('<script>\n        window.onerror = function');
    if (parts.length > 1) {
        const afterScript = parts[1].split('</script>');
        afterScript.shift(); // remove the error logger code
        content = parts[0] + afterScript.join('</script>');
        fs.writeFileSync(file, content);
    }
};

clean('public/glassmorphic_1/code.html');
clean('public/glassmorphic_2/code.html');
console.log('Removed visual loggers');
