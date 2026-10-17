const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `vipInfo.userName = p.name || p.username || 'User Name';
                          if (p.profile_pic) vipInfo.userPic = (p.profile_pic.startsWith('http') || p.profile_pic.startsWith('/')) ? p.profile_pic : '/' + p.profile_pic;`;

const replacementStr = `vipInfo.userName = p.name || p.username || 'User Name';
                          if (p.profile_pic) {
                              vipInfo.userPic = (p.profile_pic.startsWith('http') || p.profile_pic.startsWith('/')) ? p.profile_pic : '/' + p.profile_pic;
                          }
                          // Fallback to local storage (which is where the header saves cropped images)
                          try {
                              let localPic = localStorage.getItem('userProfilePic');
                              if (!localPic && window.parent) {
                                  localPic = window.parent.localStorage.getItem('userProfilePic');
                              }
                              if (localPic) vipInfo.userPic = localPic;
                          } catch (e) {}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(file, content);
    console.log('Successfully updated the profile picture logic to check localStorage.');
} else {
    console.log('Target string not found.');
}
