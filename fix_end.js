const fs = require('fs');
let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// Just replace everything from the scroll listener to the end of the script
const startMatch = "window.addEventListener('scroll', () => {";
const endMatch = "</script>";

let split = content.split(startMatch);
if (split.length === 2) {
    let cleanEnd = `window.addEventListener('scroll', () => {
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'scroll',
                        scrollY: window.scrollY
                    }, '*');
                }
            });
        })();
    </script>`;
    
    // Replace from the start of the scroll listener to the end of the script tag
    let firstPart = split[0];
    let secondPart = split[1];
    
    let partsAfterScript = secondPart.split('</script>');
    
    let finalContent = firstPart + cleanEnd + partsAfterScript[1];
    fs.writeFileSync(file, finalContent);
    console.log('Absolute perfect fix applied!');
} else {
    console.log('Could not split properly');
}
