const fs=require('fs');const {chromium}=require('/opt/node-tools/node_modules/playwright');
const d=__dirname,root='/home/user/orbit-shift';
const b64=(f,t)=>`data:${t};base64,`+fs.readFileSync(f).toString('base64');
const pip=`<svg class="pip" viewBox="0 0 120 120">
<path d="M54 30 C50 18 41 13 35 19" fill="none" stroke="#3A1E14" stroke-width="3" stroke-linecap="round"/><path d="M66 30 C70 18 79 13 85 19" fill="none" stroke="#3A1E14" stroke-width="3" stroke-linecap="round"/>
<path d="M35 15 L39 19 L35 23 L31 19Z" fill="#FFC94D"/><path d="M85 15 L89 19 L85 23 L81 19Z" fill="#FFC94D"/>
<path d="M54 52 L12 24 Q3 46 18 66 L50 66 Z" fill="#A8F0CF"/><path d="M54 52 L18 66 L50 66 Z" fill="#5ED6A6"/>
<path d="M66 52 L108 24 Q117 46 102 66 L70 66 Z" fill="#A8F0CF"/><path d="M66 52 L102 66 L70 66 Z" fill="#5ED6A6"/>
<circle cx="30" cy="42" r="5" fill="#FFF4DC"/><circle cx="90" cy="42" r="5" fill="#FFF4DC"/>
<path d="M54 66 L22 74 Q24 96 42 98 L56 80 Z" fill="#FFC94D"/><path d="M54 66 L42 98 L56 80 Z" fill="#E0A93A"/>
<path d="M66 66 L98 74 Q96 96 78 98 L64 80 Z" fill="#FFC94D"/><path d="M66 66 L78 98 L64 80 Z" fill="#E0A93A"/>
<ellipse cx="60" cy="72" rx="12" ry="22" fill="#FFF4DC"/><path d="M60 50 A12 22 0 0 1 60 94 Z" fill="#E9D6B0"/>
<path d="M50 55 L70 82" stroke="#3A1E14" stroke-width="2.5"/>
<rect x="47" y="74" width="26" height="18" rx="2.5" fill="#FFF4DC" stroke="#3A1E14" stroke-width="2"/><path d="M47 75 L60 85 L73 75" fill="none" stroke="#3A1E14" stroke-width="2"/><circle cx="60" cy="85" r="3.8" fill="#FF6F61"/>
<circle cx="60" cy="40" r="15" fill="#FFF4DC"/><path d="M60 25 A15 15 0 0 1 60 55 Z" fill="#E9D6B0"/>
<path d="M45 36 Q46 21 60 21 Q74 21 75 36 Z" fill="#12363D"/><rect x="43" y="33" width="34" height="5.5" rx="2.7" fill="#5ED6A6"/><path d="M60 24 L63 28 L60 32 L57 28Z" fill="#FFC94D"/>
<ellipse cx="54" cy="44.5" rx="2.8" ry="3.4" fill="#3A1E14"/><ellipse cx="66" cy="44.5" rx="2.8" ry="3.4" fill="#3A1E14"/><circle cx="55" cy="43.3" r="1.1" fill="#fff"/><circle cx="67" cy="43.3" r="1.1" fill="#fff"/>
<circle cx="50" cy="50" r="2.5" fill="#FF6F61" opacity=".5"/><circle cx="70" cy="50" r="2.5" fill="#FF6F61" opacity=".5"/><path d="M57 50.5 Q60 53.5 63 50.5" fill="none" stroke="#3A1E14" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const mailbox=`<svg viewBox="0 0 48 48"><rect x="18" y="30" width="5" height="16" fill="#E9D6B0"/><path d="M5 31 V20 Q5 11 16 11 H26 Q36 11 36 20 V31 Z" fill="#FFF4DC"/><path d="M5 23 H36 V31 H5 Z" fill="#E9D6B0"/><rect x="12" y="16" width="15" height="3.4" rx="1.7" fill="#12363D"/><rect x="37" y="5" width="2.6" height="17" fill="#FFF4DC"/><path d="M39.6 5 H47 L44 9.5 L47 14 H39.6 Z" fill="#FF6F61"/></svg>`;
const env=(done)=>`<svg viewBox="0 0 52 44"><path d="M4 9 H44 V37 H4 Z" fill="${done?'#1A4A50':'#FFF4DC'}" stroke="${done?'#7FA8A2':'#3A1E14'}" stroke-width="2.2" stroke-linejoin="round"/><path d="M5 36 L24 22 L43 36 Z" fill="${done?'#12363D':'#E9D6B0'}"/><path d="M4 9 L24 25 L44 9" fill="none" stroke="${done?'#7FA8A2':'#3A1E14'}" stroke-width="2.2" stroke-linejoin="round"/>${done?'<circle cx="24" cy="25" r="7" fill="#5ED6A6"/><path d="M20.5 25 L23 27.5 L28 22" fill="none" stroke="#0B3B30" stroke-width="2.4" stroke-linecap="round"/>':'<circle cx="24" cy="25" r="6.5" fill="#FF6F61"/><path d="M24 20.5 L25.3 23.6 L28.5 23.8 L26 25.9 L26.9 29 L24 27.2 L21.1 29 L22 25.9 L19.5 23.8 L22.7 23.6Z" fill="#FFC94D"/><path d="M46 3 L48 6 L46 9 L44 6Z" fill="#FFC94D"/><path d="M49 12 L50.5 14 L49 16 L47.5 14Z" fill="#FFC94D"/>'}</svg>`;
const star=`<svg viewBox="0 0 48 48"><polygon points="24,4 29,17.12 43.02,17.82 32.08,26.63 35.76,40.18 24,32.5 12.24,40.18 15.92,26.63 4.98,17.82 19,17.12" fill="#FFC94D"/><polygon points="24,4 29,17.12 43.02,17.82 32.08,26.63 35.76,40.18 24,32.5" fill="#E0A93A"/></svg>`;
const orbit='<svg viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="20" ry="9" fill="none" stroke="#A8F0CF" stroke-width="3" stroke-dasharray="1 5" stroke-linecap="round" transform="rotate(-20 24 24)"/><circle cx="24" cy="24" r="8" fill="#5ED6A6"/><path d="M33 9 L44 13 L35 17 Z" fill="#FFF4DC"/></svg>';
function lanterns(lit,W,H,scale=1){
  const y0=6*scale,sag=17*scale;let svg=`<svg class="lanterns" viewBox="0 0 ${W} ${H}"><path d="M-10 ${y0} Q ${W/2} ${y0+sag*2} ${W+10} ${y0}" fill="none" stroke="#7FA8A2" stroke-opacity=".55" stroke-width="1.6"/>`;
  for(let i=0;i<7;i++){const t=(i+1)/8,x=(1-t)*(1-t)*-10+2*(1-t)*t*(W/2)+t*t*(W+10),y=(1-t)*(1-t)*y0+2*(1-t)*t*(y0+sag*2)+t*t*y0;
    const on=i<lit,s=scale,hang=8*s;
    svg+=`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+hang}" stroke="#7FA8A2" stroke-opacity=".6" stroke-width="1.2"/>`;
    if(i===6){ // parcel
      svg+=`<g transform="translate(${x} ${y+hang}) scale(${s})">${on?'<circle cx="0" cy="12" r="18" fill="#FFC94D" opacity=".18"/>':''}<rect x="-10" y="2" width="20" height="18" rx="2" fill="${on?'#FFF4DC':'#1A4A50'}" stroke="${on?'none':'#2c5f66'}"/><rect x="-10" y="11" width="20" height="9" rx="1" fill="${on?'#E9D6B0':'#163F46'}"/><rect x="-2" y="2" width="4" height="18" fill="${on?'#FF6F61':'#2c5f66'}"/><path d="M0 2 Q-7 -6 -8 0 Q-4 3 0 2 Q4 3 8 0 Q7 -6 0 2Z" fill="${on?'#FF6F61':'#2c5f66'}"/></g>`;
    } else {
      svg+=`<g transform="translate(${x} ${y+hang}) scale(${s})">${on?'<circle cx="0" cy="12" r="17" fill="#FFC94D" opacity=".22"/>':''}<rect x="-5" y="0" width="10" height="3.5" rx="1" fill="#12363D"/><path d="M-8 4 H8 Q11 12 8 21 H-8 Q-11 12 -8 4Z" fill="${on?'#FFC94D':'#1A4A50'}" stroke="${on?'none':'#2c5f66'}" stroke-width="1.2"/><path d="M0 4 H8 Q11 12 8 21 H0Z" fill="${on?'#E0A93A':'#163F46'}"/><path d="M-4 4 Q-6 12 -4 21 M4 4 Q6 12 4 21" stroke="${on?'#C98A22':'#2c5f66'}" stroke-width="1" fill="none"/><rect x="-5" y="21" width="10" height="3" rx="1" fill="#12363D"/></g>`;}
  }
  return svg+'</svg>';
}
let html=fs.readFileSync(d+'/mock.html','utf8');
const map={lilita:b64(root+'/fonts/lilita-one-latin.woff2','font/woff2'),nunito:b64(root+'/fonts/nunito-latin-variable.woff2','font/woff2'),
 bloom:b64(d+'/../planets/planet-bloom.png','image/png'),ember:b64(d+'/../planets/planet-ember.png','image/png'),
 gliderBloom:b64(d+'/glider-bloom.png','image/png'),gliderEmber:b64(d+'/glider-ember.png','image/png'),
 bg:'<div class="star-dots"></div><div class="hills"><i></i><i></i></div>',gear:fs.readFileSync(d+'/gear.svg','utf8'),star,mailbox,pip,
 envelope:env(false),envelopeDone:env(true),playtri:'<svg viewBox="0 0 48 48"><path d="M12 6 L42 24 L12 42 Z" fill="#3A1E14"/></svg>',orbiticon:orbit,
 island:fs.readFileSync(root+'/design/paper-night/svg/icons/islands-detailed.svg','utf8'),
 lanterns3:lanterns(3,390,96),lanterns6:lanterns(6,390,96),lanterns3s:lanterns(3,320,70,.78),
 pipBig:pip.replace('class="pip"','width="120" height="120"'),mailboxBig:mailbox.replace('<svg ','<svg width="90" height="90" '),envelopeBig:env(false).replace('<svg ','<svg width="110" height="94" '),
 lanternStates:lanterns(4,150,70,1).replace('class="lanterns"','width="150" height="70"')};
html=html.replace(/{{shipicon}}/g,`<img src="{{gliderBloom}}" style="width:56px;height:56px;transform:rotate(14deg);margin:-6px">`);
for(const [k,v] of Object.entries(map))html=html.split(`{{${k}}}`).join(v);
const left=html.match(/{{\w+}}/g);if(left)console.log('unreplaced',[...new Set(left)]);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1780,height:1000}});
await p.setContent(html,{waitUntil:'networkidle'});await p.waitForTimeout(400);await p.screenshot({path:d+'/home-mockups.png',fullPage:true});await b.close();})();
