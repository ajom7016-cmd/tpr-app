const fs = require('fs');
let file = 'public/support_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldCode = `          const savedPic = localStorage.getItem('userProfilePic');
          if (savedPic) {
              document.getElementById('user-avatar').src = savedPic;
              document.getElementById('user-avatar').classList.remove('hidden');
              document.getElementById('default-avatar').classList.add('hidden');
          }`;

const newCode = `          const savedPic = localStorage.getItem('userProfilePic');
          if (savedPic) {
              const userAvatar = document.getElementById('user-avatar');
              const defaultAvatar = document.getElementById('default-avatar');
              if (userAvatar) {
                  userAvatar.src = savedPic;
                  userAvatar.classList.remove('hidden');
              }
              if (defaultAvatar) {
                  defaultAvatar.classList.add('hidden');
              }
          }`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(file, content);
console.log('Fixed TypeError causing the entire script to crash');
