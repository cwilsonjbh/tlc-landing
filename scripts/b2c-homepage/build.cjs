const fs=require('node:fs');
const cp=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const old=fs.readFileSync(path.join(__dirname,'baseline.html'),'utf8');
let page=fs.readFileSync(path.join(__dirname,'homepage-template.html'),'utf8');
const loginCss=old.slice(old.indexOf('.login-overlay {'),old.indexOf('/* ── STICKY SUB-NAV'));
if(!loginCss.includes('.login-modal'))throw new Error('Could not preserve login CSS');
const modals=old.slice(old.indexOf('<!-- CONTACT MODAL -->'),old.indexOf('<script>',old.indexOf('<!-- LOGIN MODAL -->')));
const auth=old.slice(old.indexOf('function openLoginModal()'),old.indexOf('// ── Hero insight card animation'));
const brands=old.slice(old.indexOf('<div class="works-with-brands">')+31,old.indexOf('</div>',old.indexOf('<div class="works-with-brands">')));
const values={
 FAVICON:old.match(/<link rel="icon"[^>]+>/)[0],
 LOGO:'https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png',
 MONA:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Mona_Lisa.jpg/960px-Mona_Lisa.jpg',
 BRANDS:brands,
 CSS:fs.readFileSync(path.join(__dirname,'homepage.css'),'utf8'),
 LOGIN_CSS:loginCss,
 MODALS:modals.replace('id="loginEmail"','id="loginEmail" aria-label="Email address"').replace('data-auto_prompt="true"','data-auto_prompt="false"'),
 AUTH:auth,
 JS:fs.readFileSync(path.join(__dirname,'homepage.js'),'utf8'),
 THREE:fs.readFileSync(path.join(__dirname,'scene.js'),'utf8')
};
page=page.replace(/__(FAVICON|LOGO|MONA|BRANDS|CSS|LOGIN_CSS|MODALS|AUTH|JS|THREE)__/g,(_,key)=>values[key]);
if(/__(?:CSS|JS|AUTH|MODALS|THREE)__/.test(page))throw new Error('Unresolved fragment');
fs.writeFileSync(path.join(root,'homepage.html'),page);
console.log('Homepage written: '+page.length+' characters.');
