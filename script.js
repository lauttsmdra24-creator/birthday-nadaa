const A=IMG;
document.querySelectorAll("[data-img]").forEach(i=>i.src=IMG[i.dataset.img]);
const $=id=>document.getElementById(id),W=916,H=512,wait=ms=>new Promise(r=>setTimeout(r,ms));
/* ---------- audio ---------- */
let ac,mute=false;
const AC=()=>{if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(ac&&ac.state=='suspended')ac.resume();return ac};
function tone(f,d=.1,ty='square',at=0,v=.05,to){const c=AC();if(!c||mute)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+at;o.type=ty;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(c.destination);o.start(t);o.stop(t+d)}
function noise(d=.5,v=.12){const c=AC();if(!c||mute)return;const n=c.sampleRate*d,b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource(),g=c.createGain();g.gain.value=v;s.buffer=b;s.connect(g).connect(c.destination);s.start()}
const sfx={start:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.12,'square',i*.09)),tick:()=>tone(1200,.03,'square',0,.03),step:()=>tone(180,.04,'triangle',0,.05),
 win:()=>[523,659,784,659,784,1047,1319].forEach((f,i)=>tone(f,.14,'square',i*.1)),boom:()=>{noise(.6,.2);tone(120,.5,'sawtooth',0,.1,30)},pop:()=>{tone(300,.2,'square',0,.07,900);noise(.3,.12)},
 lose:()=>[400,300,200].forEach((f,i)=>tone(f,.15,'square',i*.12)),throw:()=>tone(900,.7,'triangle',0,.05,200),type:()=>tone(900,.02,'square',0,.02)};
$('snd').onclick=()=>{mute=!mute;$('snd').textContent=mute?'SOUND OFF':'SOUND ON'};
/* ---------- page wipe ---------- */
const wc=$('wipe'),wx=wc.getContext('2d');
function wipe(mid){return new Promise(res=>{wc.width=innerWidth;wc.height=innerHeight;
 const cs=Math.ceil(Math.max(innerWidth,innerHeight)/14),cols=Math.ceil(innerWidth/cs),rows=Math.ceil(innerHeight/cs),cells=[];
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)cells.push({x,y,k:(x+y)/(cols+rows)*.7+Math.random()*.3});
 let t0=performance.now(),ph=0;(function f(t){let p=Math.min(1,(t-t0)/380);const q=ph?1-p:p;wx.clearRect(0,0,wc.width,wc.height);
  cells.forEach(c=>{if(c.k<q){wx.fillStyle=(c.x+c.y)%2?'#ff5fa8':'#ffbcff';wx.fillRect(c.x*cs,c.y*cs,cs,cs)}});
  if(p<1)requestAnimationFrame(f);else if(!ph){ph=1;mid();t0=performance.now();requestAnimationFrame(f)}else{wx.clearRect(0,0,wc.width,wc.height);res()}})(t0)})}
const show=n=>wipe(()=>document.querySelectorAll('.pg').forEach(p=>p.classList.toggle('on',p.id=='p'+n)));
/* ---------- fx ---------- */
const cv=$('fx'),cx=cv.getContext('2d');let parts=[],raf=0;
const fit=()=>{cv.width=innerWidth;cv.height=innerHeight};fit();addEventListener('resize',fit);
const COL=['#ff4fa0','#ffd400','#1ec9e8','#ff8a3d','#7b4dff','#38d96b','#ff2b2b','#fff'];
function confetti(x,y,n=160){for(let i=0;i<n;i++){const a=Math.random()*6.28,v=4+Math.random()*13;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-8,s:5+Math.random()*7,c:COL[i%8],l:110+Math.random()*80})}if(!raf)loop()}
function loop(){cx.clearRect(0,0,cv.width,cv.height);parts=parts.filter(p=>p.l-->0&&p.y<cv.height+30);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.45;p.vx*=.985;cx.fillStyle=p.c;cx.fillRect(Math.round(p.x/4)*4,Math.round(p.y/4)*4,p.s,p.s)});raf=parts.length?requestAnimationFrame(loop):0;if(!raf)cx.clearRect(0,0,cv.width,cv.height)}
for(let i=0;i<16;i++){const s=document.createElement('i');s.className='fs';const z=8+Math.random()*16;s.style.cssText=`left:${Math.random()*100}vw;width:${z}px;height:${z}px;animation-duration:${7+Math.random()*9}s;animation-delay:-${Math.random()*14}s;${i%3?'':'background:#ffe14d'}`;document.body.prepend(s)}
/* ---------- helpers ---------- */
function mk(parent,x,y,w,h,{tag='div',cls='',src='',html='',id=''}={}){const hh=+parent.dataset.h||H,e=document.createElement(tag);if(cls)e.className=cls;if(id)e.id=id;e.style.cssText=`position:absolute;left:${x/W*100}%;top:${y/hh*100}%;width:${w/W*100}%;height:${h/hh*100}%`;
 if(src){const i=new Image();i.src=src;i.style.cssText='position:static;width:100%;height:100%;display:block;image-rendering:pixelated';e.append(i)}if(html)e.innerHTML=html;parent.append(e);return e}
function burst(host,x,y,cols,n=26,r=70){for(let i=0;i<n;i++){const s=document.createElement('i');s.className='sq';const z=1.2+Math.random()*1.6;s.style.cssText=`left:${x/W*100}%;top:${y/H*100}%;width:${z}cqw;height:${z}cqw;background:${cols[i%cols.length]}`;host.append(s);const a=Math.random()*6.28,d=r*(.4+Math.random())/W*100;
 s.animate([{transform:'translate(0,0)'},{transform:`translate(${Math.cos(a)*d}cqw,${Math.sin(a)*d}cqw)`,opacity:0}],{duration:700,easing:'steps(7)'}).onfinish=()=>s.remove()}}
const xy=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
/* ---------- game ---------- */
const G=$('game');G.dataset.h=H;
/* ---- background ---- */
const cvs=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c};
const bgl=document.createElement('div');bgl.className='bgl';G.prepend(bgl);
const put=(c,css,px)=>{c.style.cssText=css;if(px)c.dataset.px=px;bgl.append(c);return c};
const BANDS=['#ff68bd','#ff72c3','#ff7ccb','#ff88d1','#ff92d5','#ff9cd9','#ffa6dd','#ffb0e1','#ffbae5'];
put(cvs(229,128,(g,w,h)=>{const bh=h/9;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const b=Math.floor(y/bh),r=y-b*bh;g.fillStyle=BANDS[(b<8&&r>=bh-2&&(x+y)%2==0)?b+1:b];g.fillRect(x,y,1,1)}
 [[130,45,24,.25,'#fff'],[130,45,19,.5,'#ffe9f6'],[130,45,15,1,'#fff3a8']].forEach(([cx,cy,r,al,c])=>{g.globalAlpha=al;g.fillStyle=c;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r)g.fillRect(cx+x,cy+y,1,1)});g.globalAlpha=1}),'inset:0;width:100%;height:100%');
put(cvs(229,70,(g)=>{g.fillStyle='#fff';for(let i=0;i<45;i++)g.fillRect(Math.random()*229|0,Math.random()*70|0,1,1);for(let i=0;i<9;i++){const x=4+Math.random()*220|0,y=3+Math.random()*60|0;g.fillRect(x,y-1,1,3);g.fillRect(x-1,y,3,1)}}),'left:0;top:0;width:100%;height:55%','').classList.add('st');
const cloud=(w,s,top,dur,dl)=>{const c=put(cvs(40,16,(g)=>{const C=[[10,11,6],[18,8,8],[27,10,7],[34,12,5]];for(let y=0;y<16;y++)for(let x=0;x<40;x++)if(y<=14&&C.some(([a,b,r])=>(x-a)**2+(y-b)**2<=r*r)){g.fillStyle=y>=12?'#ffd7ef':'#fff';g.fillRect(x,y,1,1)}}),`top:${top}%;left:0;width:${w}cqw;animation-duration:${dur}s;animation-delay:-${dl}s`);c.classList.add('cl');return c};
const cl=document.createElement('div');cl.dataset.px=.03;cl.style.cssText='inset:0';bgl.append(cl);
[[14,4,70,10],[10,24,95,50],[18,40,120,80]].forEach(a=>{const c=cloud(...[a[0],0,a[1],a[2],a[3]]);cl.append(c)});
put(cvs(229,40,(g,w,h)=>{for(let x=0;x<w;x++){const t=Math.round(16+6*Math.sin(x/18)+4*Math.sin(x/7+1));g.fillStyle='#f06cbc';g.fillRect(x,h-t,1,t)}}),'left:-5%;bottom:0;width:110%;height:31%',.06);
put(cvs(229,40,(g,w,h)=>{for(let x=0;x<w;x++){const t=Math.round(9+4*Math.sin(x/11+2));g.fillStyle='#d956a8';g.fillRect(x,h-t,1,t);g.fillStyle='#ff8ad0';g.fillRect(x,h-t,1,1);if(x%13==5){g.fillStyle='#ffe14d';g.fillRect(x,h-t-2,1,1);g.fillStyle='#fff';g.fillRect(x-1,h-t-1,3,1)}}}),'left:-5%;bottom:0;width:110%;height:21%',.12);
for(let i=0;i<7;i++){const h=new Image();h.src=A.heart;h.className='pf';h.style.cssText=`position:absolute;left:${8+i*13}%;animation-duration:${9+i*1.7}s;animation-delay:-${i*2.3}s;opacity:.75`;bgl.append(h)}

const path=(x,y,w,h)=>mk(G,x,y,w,h,{cls:'path'});
path(252,28,28,424);path(52,178,305,28);path(329,120,28,160);path(252,316,400,28);
mk(G,597,0,283,192,{cls:'hint',html:'HELP THIS WOMAN REACH THE SUNFLOWER!'});
mk(G,570,70,48,48,{cls:'star'});mk(G,860,70,48,48,{cls:'star'});
const sun=mk(G,18,20,67,162,{src:A.sun,id:'sun'}),mush=mk(G,240,0,52,44,{src:A.mush,id:'mush'}),skull=mk(G,242,437,48,47,{src:A.skull,id:'skull'});
const girl=mk(G,0,0,105,114,{id:'girl',html:'<div class="sh"></div>'});girl.firstChild.style.backgroundImage=`url(${A.sheet})`;
/* dpad (moves under the stage in portrait) */
const dpad=document.createElement('div');dpad.className='dpad';dpad.innerHTML=`<img src="${A.dpad}" alt="">`;
[['up',49.5,23],['left',21,53],['right',79,53],['down',49.5,78]].forEach(([k,l,t])=>{const b=document.createElement('button');b.className='dp';b.style.cssText=`left:${l}%;top:${t}%`;b.dataset.k=k;b.setAttribute('aria-label',k);dpad.append(b)});
const mq=matchMedia('(orientation:portrait)');
function layout(){if(mq.matches){$('dpw').append(dpad);dpad.style.cssText='position:relative;width:min(74vw,calc(40dvh*222/201));aspect-ratio:222/201;container-type:inline-size'}
 else{G.append(dpad);dpad.style.cssText=`left:${678/W*100}%;top:${285/H*100}%;width:${222/W*100}%;height:${201/H*100}%`}}
layout();mq.addEventListener('change',layout);
const SEG=[{o:'v',c:266,a:42,b:437},{o:'h',c:192,a:52,b:343},{o:'v',c:343,a:120,b:267},{o:'h',c:330,a:266,b:640}];
const P={x:640,y:330};let dir=null,last=0,busy=true,armed={m:true,s:true},lives=3,score=0,lastD=0,lastS=0,done=false;const keys={};
const place=()=>{bgl.querySelectorAll('[data-px]').forEach(e=>e.style.transform=`translateX(${-(P.x-640)/W*100*e.dataset.px}%)`);girl.style.left=(P.x-45)/W*100+'%';girl.style.top=(P.y-97)/H*100+'%'};place();
function step(dx,dy,d){const n={x:P.x+dx*d,y:P.y+dy*d};
 for(const s of SEG){if(dx&&s.o=='h'&&Math.abs(P.y-s.c)<=14&&n.x>=s.a&&n.x<=s.b){P.x=n.x;P.y=s.c;return true}
  if(dy&&s.o=='v'&&Math.abs(P.x-s.c)<=14&&n.y>=s.a&&n.y<=s.b){P.y=n.y;P.x=s.c;return true}}return false}
function tick(t){const dt=Math.min(40,t-last||16);last=t;
 if($('p3').classList.contains('on')){const k=dir||(keys.ArrowUp||keys.w?'up':keys.ArrowDown||keys.s?'down':keys.ArrowLeft||keys.a?'left':keys.ArrowRight||keys.d?'right':null);let mv=false;
  if(k&&!busy){const v={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[k];mv=step(v[0],v[1],dt*.22);
   if(v[0]){girl.classList.toggle('r',v[0]>0);girl.style.setProperty('--f',v[0]>0?-1:1)}place();
   if(mv&&t-lastS>210){lastS=t;sfx.step()}if(mv&&t-lastD>140){lastD=t;burst(G,P.x+(v[0]>0?-20:v[0]<0?20:0),P.y+8,['#fff','#ffd7ef'],2,14)}check()}
  girl.classList.toggle('walk',mv)}
 requestAnimationFrame(tick)}requestAnimationFrame(tick);
addEventListener('keydown',e=>{if(e.key.startsWith('Arrow'))e.preventDefault();keys[e.key]=1});addEventListener('keyup',e=>delete keys[e.key]);
dpad.querySelectorAll('.dp').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();AC();dir=b.dataset.k;dpad.classList.add('prs')});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{if(dir==b.dataset.k){dir=null;dpad.classList.remove('prs')}}))});
function hearts(){$('lives').innerHTML=[0,1,2].map(i=>`<img src="${A.heart}" class="${i<lives?'':'lost'}" alt="">`).join('')}
function addScore(n){score+=n;$('score').textContent=String(score).padStart(6,'0')}
function check(){if(P.y>70)armed.m=true;if(P.y<390)armed.s=true;
 if(P.y==192&&P.x<=64&&!done)return win();
 if(P.x==266&&P.y<=56&&armed.m){armed.m=false;return boom()}
 if(P.x==266&&P.y>=394&&armed.s){armed.s=false;return bomb()}}
async function win(){done=true;busy=true;dir=null;dpad.classList.remove('prs');girl.classList.add('win');sfx.win();addScore(1000+lives*300);
 burst(G,52,120,['#ffd400','#fff','#ff8a3d'],40,100);const[x,y]=xy(sun);confetti(x,y,140);await wait(1100);pop.classList.add('on')}
async function boom(){busy=true;mush.classList.add('shake');await wait(1000);mush.classList.remove('shake');mush.style.visibility='hidden';sfx.pop();addScore(500);
 burst(G,266,22,['#e8312f','#fff','#ffd400','#2b2b2b'],40,110);const[x,y]=xy(mush);confetti(x,y,220);busy=false;
 await wait(3400);mush.style.visibility='';mush.classList.add('popin');setTimeout(()=>mush.classList.remove('popin'),500)}
function drawBomb(c){const m=["........y.o.",".......yoy..","......f.o...",".....f......","...kkkkk....","..kkkkkkk...",".kkggkkkkk..",".kkgkkkkkk..",".kkkkkkkkk..",".kkkkkkkkk..","..kkkkkkk...","...kkkkk...."],C={k:'#262633',g:'#7a7a90',f:'#8a5a2b',o:'#ff8a00',y:'#ffe14d'},g=c.getContext('2d');m.forEach((r,j)=>[...r].forEach((ch,i)=>{if(C[ch]){g.fillStyle=C[ch];g.fillRect(i,j,1,1)}}))}
async function bomb(){busy=true;dir=null;skull.classList.add('shake');await wait(700);skull.classList.remove('shake');sfx.throw();
 const b=mk(G,0,0,36,36,{tag:'canvas'});b.width=b.height=12;b.style.imageRendering='pixelated';b.style.zIndex=4;drawBomb(b);
 const sx=266,sy=455,tx=P.x,ty=P.y-35,t0=performance.now();
 await new Promise(r=>{(function f(t){const k=Math.min(1,(t-t0)/800),x=sx+(tx-sx)*k,y=sy+(ty-sy)*k-110*Math.sin(Math.PI*k);b.style.left=(x-18)/W*100+'%';b.style.top=(y-18)/H*100+'%';b.style.transform=`rotate(${k*720}deg)`;k<1?requestAnimationFrame(f):r()})(t0)});
 b.remove();sfx.boom();burst(G,tx,ty,['#ff8a00','#ffd400','#fff','#333','#e8312f'],50,120);
 G.animate([{transform:'translate(0)'},{transform:'translate(-1.2%,.8%)'},{transform:'translate(1.2%,-.8%)'},{transform:'translate(0)'}],{duration:350,iterations:2});
 girl.classList.add('burnt');lives--;let msg='BOOM!';if(lives<=0){msg='CONTINUE!';lives=3}hearts();sfx.lose();
 G.insertAdjacentHTML('beforeend',`<div class="toast">${msg}</div>`);await wait(2200);G.querySelector('.toast').remove();
 girl.style.opacity=0;await wait(250);P.x=640;P.y=330;place();girl.classList.remove('burnt');girl.style.opacity=1;busy=false}
/* win popup */
const pop=document.createElement('div');pop.id='pop';pop.innerHTML='<div class="wash"></div><div class="pw"><div class="slide" data-h="485"></div></div>';$('p3').append(pop);
const sl=pop.querySelector('.slide');
mk(sl,195,108,490,249,{cls:'bub',html:"CONGRATULATIONS,<br>YOU'VE WON THIS LEVEL!"});
mk(sl,395,58,92,92,{cls:'bellc ring',src:A.bell});mk(sl,82,25,196,207,{id:'trophy',src:A.trophy});
const nx=mk(sl,612,315,133,80,{tag:'button',id:'next',src:A.arrows});nx.setAttribute('aria-label','Lanjut ke pesan');
nx.onclick=async()=>{nx.onclick=null;sfx.start();confetti(innerWidth/2,innerHeight*.35,140);await wait(350);await show(4);typeMsg()};
function resetGame(){P.x=640;P.y=330;place();dir=null;done=false;lives=3;score=0;armed={m:true,s:true};hearts();addScore(0);pop.classList.remove('on');
 girl.classList.remove('win','burnt','walk');girl.style.opacity=1;mush.style.visibility='';busy=false}
/* ---------- start / loading ---------- */
let started=false;
const tips=['TIP: TAHAN PANAH UNTUK BERJALAN','TIP: JAMUR = CONFETTI!','TIP: AWAS TENGKORAK BAWA BOM!','TIP: BUNGA MATAHARI ADALAH TUJUANMU'];
async function startGame(){if(started)return;started=true;AC();sfx.start();$('play').classList.add('go');await wait(300);await show(2);
 let p=0,i=0;$('tip').textContent=tips[0];resetGame();busy=true;
 const iv=setInterval(()=>{p=Math.min(100,p+Math.random()*7+2);$('fl').style.width=Math.round(p/5)*5+'%';$('pc').textContent=Math.floor(p)+'%';if(Math.random()<.35)sfx.tick();
  $('ld').textContent='LOADING'+'.'.repeat(1+i%3);if(++i%9==0)$('tip').textContent=tips[(i/9)%tips.length];
  if(p>=100){clearInterval(iv);setTimeout(async()=>{await show(3);busy=false},500)}},170)}
$('play').onclick=$('screen').onclick=startGame;
/* ---------- message ---------- */
/* ===== EDIT PESAN DI SINI =====
   Ganti isi di antara tanda ` ` (backtick). Boleh pakai tanda petik ' ", &, dan enter.
   Jangan hapus tanda backtick di awal/akhir, dan jangan tulis ` atau ${ di dalam pesan.
   Baris pertama = ucapan, baris-baris berikutnya = isi pesan. */
const PESAN=`HAPPY BIRTHDAY NADA SAYANGG!
wuatb, semoga apa yang kamu inginkan terkabulkan satu per satu, sehat selalu, lancar rejekinya & selalu menjadi kebanggan keluarga, semoga keterima di univ impian yaaa!!! makasi yaa sayang ku masih mau berteman dgn ku yang anjay aselole ini xixi, lopyuuu muahh`;
let typing=0;const esc=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;');
function typeMsg(){const m=$('msg'),full=PESAN.trim(),id=++typing;let i=0;m.classList.add('cur');$('again').classList.remove('on');$('win').classList.add('pin');setTimeout(()=>$('win').classList.remove('pin'),700);
 const fin=()=>{if(typing!=id)return;i=full.length;m.innerHTML=full.split('\n').map(esc).join('<br>');m.classList.remove('cur');$('again').classList.add('on');confetti(innerWidth/2,innerHeight*.4,160);sfx.win();
  for(let k=0;k<12;k++){const h=new Image();h.src=A.heart;h.className='fh';h.style.cssText=`left:${5+Math.random()*90}vw;animation-duration:${6+Math.random()*6}s;animation-delay:${Math.random()*3}s`;document.body.append(h);setTimeout(()=>h.remove(),14000)}};
 $('win').onclick=()=>{if(i<full.length)fin()};
 (function f(){if(typing!=id||i>=full.length)return;i+=2;const s=full.slice(0,i).split('\n');m.innerHTML=s.map(esc).join('<br>');if(i%6==0)sfx.type();i>=full.length?fin():setTimeout(f,22)})()}
$('again').onclick=async()=>{typing++;await show(1);started=false;$('play').classList.remove('go');$('fl').style.width=0;$('pc').textContent='0%'};
hearts();