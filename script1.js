(function(){
const CFG={"n": 1, "folder": "mango", "frames": 126, "fruit": "mango", "price": 12, "id": "mango-pure", "pname": "SÈVE Pure Mangue"};
const J=[
{u:'index1.html',name:'Mangue',f:'mango',l:126,c:'#FFB347',p:12,t:'mango'},
{u:'index2.html',name:'Fruits rouges',f:'berries',l:102,c:'#C71585',p:12,t:'berries'},
{u:'index3.html',name:'Citron',f:'lemon',l:102,c:'#BFFF00',p:11,t:'lemon'}];
const $=id=>document.getElementById(id);
const pic=j=>`${j.f}/ezgif-frame-${String(j.l).padStart(3,'0')}.jpg`;
const S=f=>{try{f()}catch(e){console.warn(e)}};
const touch=matchMedia('(hover: none)').matches||innerWidth<768;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fx=!touch&&!reduce;
const ME=CFG.n-1,NEXT=(ME+1)%3,PREV=(ME+2)%3;
const eur=n=>n.toFixed(2).replace('.',',')+' €';
let nav=false,loaded=false,progress=0;const frames=[];

function fruit(t){return {
mango:'<svg viewBox="0 0 100 100"><path d="M50 12C78 10 92 40 84 66 76 90 40 92 24 72 10 54 22 14 50 12Z" fill="#FF9F2E"/><path d="M60 30C80 36 84 62 70 80 86 62 80 44 60 30Z" fill="#D2561A" opacity=".55"/><path d="M50 12C54 4 64 2 72 6 66 12 58 14 50 12Z" fill="#3E8E41"/><ellipse cx="36" cy="34" rx="10" ry="5" fill="#fff" opacity=".4" transform="rotate(-35 36 34)"/></svg>',
berries:'<svg viewBox="0 0 100 100"><path d="M50 94C18 72 8 42 22 28 34 16 44 22 50 24 56 22 66 16 78 28 92 42 82 72 50 94Z" fill="#E0245E"/><path d="M50 24L36 12 46 20 50 6 54 20 64 12Z" fill="#3E8E41"/><g fill="#FFE08A"><ellipse cx="38" cy="44" rx="2" ry="3"/><ellipse cx="56" cy="40" rx="2" ry="3"/><ellipse cx="66" cy="54" rx="2" ry="3"/><ellipse cx="46" cy="60" rx="2" ry="3"/><ellipse cx="32" cy="58" rx="2" ry="3"/><ellipse cx="54" cy="74" rx="2" ry="3"/></g><ellipse cx="34" cy="36" rx="8" ry="4" fill="#fff" opacity=".35" transform="rotate(-35 34 36)"/></svg>',
lemon:'<svg viewBox="0 0 100 100"><path d="M6 50C6 50 14 46 20 44 28 22 72 22 80 44 86 46 94 50 94 50 94 50 86 54 80 56 72 78 28 78 20 56 14 54 6 50 6 50Z" fill="#E4F03A"/><path d="M30 66C44 76 66 74 76 58 70 72 48 82 30 66Z" fill="#9BB81C" opacity=".6"/><ellipse cx="38" cy="38" rx="12" ry="5" fill="#fff" opacity=".45"/></svg>'}[t]}
const FR=fruit(CFG.fruit);

/* loader fruits */
S(()=>{const box=$('ld-fruits');for(let i=0;i<(touch?7:11);i++){const d=document.createElement('span');d.className='lf';d.style.cssText=`--x:${Math.random()*92}%;--s:${28+Math.random()*34}px;--d:${3+Math.random()*3}s;--dl:${-Math.random()*5}s;--r:${(Math.random()*2-1)*360}deg`;d.innerHTML=FR;box.appendChild(d)}$('ld-main').innerHTML=FR});

/* navigation + vague */
const wave=document.querySelector('.liquid-wave'),ov=$('page-transition');
function go(i){if(nav)return;if(i===ME){scrollTo({top:0,behavior:'smooth'});return}nav=true;sessionStorage.setItem('arrival_wave_color',J[i].c);wave.style.background=J[i].c;ov.classList.add('active');setTimeout(()=>{location.href=J[i].u},850)}
S(()=>{const c=sessionStorage.getItem('arrival_wave_color');if(!c)return;sessionStorage.removeItem('arrival_wave_color');wave.style.background=c;wave.style.transition='none';wave.style.transform='translateY(-100%)';wave.offsetHeight;wave.style.transition='';wave.style.transform='translateY(-230%)';setTimeout(()=>{wave.style.transition='none';wave.style.transform='';wave.offsetHeight;wave.style.transition=''},1000)});
addEventListener('pageshow',e=>{if(e.persisted){nav=false;ov.classList.remove('active');document.querySelectorAll('.pexp').forEach(x=>x.remove())}});
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="index"]');if(!a||a.dataset.portal)return;e.preventDefault();go(parseInt(a.getAttribute('href').replace(/\D/g,''))-1)});

/* header, dots, dock */
const hd=$('main-header'),dock=$('dock'),drawer=$('cart-drawer');
S(()=>{$('dots').innerHTML=J.map((j,i)=>`<a class="nav-dot${i===ME?' active':''}" data-name="${j.name}" href="${j.u}" style="--c:${j.c}"></a>`).join('');
dock.innerHTML=J.map((j,i)=>`<a href="${j.u}" class="${i===ME?'cur':''}" title="${j.name}"><img src="${pic(j)}" alt="${j.name}"></a>`).join('');
dock.addEventListener('mousemove',e=>{if(touch)return;[...dock.children].forEach(a=>{const r=a.getBoundingClientRect(),d=Math.abs(e.clientX-(r.left+r.width/2));a.style.transform=`scale(${1+.7*Math.max(0,1-d/110)})`})});
dock.addEventListener('mouseleave',()=>[...dock.children].forEach(a=>a.style.transform=''))});
let ls=0;addEventListener('scroll',()=>{const y=scrollY;hd.classList.toggle('scrolled',y>40);hd.classList.toggle('hidden',y>ls&&y>200);ls=y},{passive:true});

/* hero */
const cv=$('hero-canvas'),cx=cv.getContext('2d'),wrap=$('hero-wrapper'),hint=$('hint'),par=$('parallax'),glow=$('cursor-glow');
let last=-1,redraw=true,cur=0,first=true;
function size(){cv.width=innerWidth;cv.height=innerHeight;redraw=true}
size();addEventListener('resize',size);
function draw(im){const s=Math.max(cv.width/im.naturalWidth,cv.height/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;cx.drawImage(im,(cv.width-w)/2,(cv.height-h)/2,w,h)}
const texts=[...document.querySelectorAll('.hero-text')];
texts.forEach(t=>{const h=t.querySelector('h1');h.innerHTML=h.textContent.split(' ').map((w,i)=>`<span class="w" style="transition-delay:${i*.09}s">${w}</span>`).join(' ')});
const fls=[];
S(()=>{const box=$('floaters');for(let i=0;i<(touch?4:8);i++){const f=document.createElement('div');f.className='fl';f.style.cssText=`--x:${5+Math.random()*85}%;--y:${8+Math.random()*75}%;--s:${26+Math.random()*34}px;--d:${3+Math.random()*3}s`;f._z=(Math.random()*2-1)*50;f.innerHTML='<div>'+FR+'</div>';f.style.opacity=.8;box.appendChild(f);fls.push(f)}});

/* souris */
let mx=0,my=0,px=0,py=0,gx=innerWidth/2,gy=innerHeight/2,cgx=gx,cgy=gy;
if(fx)addEventListener('mousemove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;gx=e.clientX;gy=e.clientY},{passive:true});

/* fruit 3D */
const f3=$('fruit3d');let fy=0,fdrag=false,lx=0;
S(()=>{for(let i=0;i<9;i++){const k=i-4,l=document.createElement('div');l.className='layer';l.style.transform=`translateZ(${k*7}px) scale(${1-Math.abs(k)*.035})`;l.style.filter=`brightness(${1-Math.abs(k)*.06})`;l.innerHTML=FR;f3.appendChild(l)}
$('stage3d').addEventListener('pointerdown',e=>{fdrag=true;lx=e.clientX})});

/* anneau 3D */
const ring=$('ring'),R=touch?150:230;let ang=-ME*120,tgt=ang,rdrag=null,moved=0,focus=-1;const rcs=[];
S(()=>{J.forEach((j,i)=>{const c=document.createElement('div');c.className='rc';c.style.transform=`rotateY(${i*120}deg) translateZ(${R}px)`;c.style.setProperty('--c',j.c);c._i=i;c.innerHTML=`<img src="${pic(j)}" alt=""><h4>${j.name}</h4><span>${i===ME?'Vous êtes ici':eur(j.p)}</span>`;c.onclick=()=>{if(moved>6)return;const f=((Math.round(-tgt/120)%3)+3)%3;if(i===f){if(i!==ME)go(i)}else{let d=i-f;if(d>1)d-=3;if(d<-1)d+=3;tgt-=d*120}};ring.appendChild(c);rcs.push(c)});
ring.style.transform=`translateZ(${-R}px) rotateY(${ang}deg)`;
$('ring-prev').onclick=()=>tgt+=120;$('ring-next').onclick=()=>tgt-=120;
$('ring-stage').addEventListener('pointerdown',e=>{rdrag={x:e.clientX,a:tgt};moved=0})});
addEventListener('pointermove',e=>{if(rdrag){const dx=e.clientX-rdrag.x;moved=Math.max(moved,Math.abs(dx));tgt=rdrag.a+dx*.4}if(fdrag){fy+=(e.clientX-lx)*.6;lx=e.clientX}});
addEventListener('pointerup',()=>{if(rdrag){tgt=Math.round(tgt/120)*120;rdrag=null}fdrag=false});

/* section suivante + portail */
S(()=>{const nx=J[NEXT],pv=J[PREV];$('next-section').innerHTML=`<div class="next-content"><h3>Découvrir le jus suivant</h3><p>${nx.name} — ${eur(nx.p)}</p><a class="portal" id="portal" data-portal="1" href="${nx.u}" style="--nc:${nx.c}"><span class="pr" style="--i:1;--t:6s;--a:70deg"></span><span class="pr" style="--i:2;--t:9s;--a:55deg"></span><span class="pr" style="--i:3;--t:13s;--a:80deg"></span><img src="${pic(nx)}" alt=""><span class="pcap">Entrer</span></a><br><a class="btn-prev" href="${pv.u}">← Jus précédent : ${pv.name}</a></div>`;
$('portal').addEventListener('click',e=>{e.preventDefault();if(nav)return;const r=e.currentTarget.getBoundingClientRect(),d=document.createElement('div');d.className='pexp';d.style.cssText=`left:${r.left+r.width/2}px;top:${r.top+r.height/2}px;background:${nx.c}`;document.body.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>{d.style.transform=`scale(${Math.max(innerWidth,innerHeight)/30*1.7})`}));setTimeout(()=>go(NEXT),650)})});

/* reveals */
function count(el){const T=+el.dataset.target;let s=null;const st=t=>{if(!s)s=t;const p=Math.min((t-s)/1400,1);el.textContent=Math.floor(p*T);if(p<1)requestAnimationFrame(st)};requestAnimationFrame(st)}
S(()=>{const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target;el.classList.add('in');io.unobserve(el);if(el.classList.contains('plate'))count(el.querySelector('.stat-value'));if(el.classList.contains('flip'))setTimeout(()=>el.classList.add('ready'),1400)}),{threshold:.25});
document.querySelectorAll('.plate,.flip,.rev').forEach(e=>io.observe(e))});
S(()=>document.querySelectorAll('.flip').forEach(f=>{f.addEventListener('click',()=>{if(touch)f.classList.toggle('on')});if(!fx)return;f.addEventListener('mousemove',e=>{const r=f.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;f.style.transform=`perspective(900px) rotateX(${(.5-y)*10}deg) rotateY(${(x-.5)*10}deg)`;f.style.setProperty('--gx',x*100+'%');f.style.setProperty('--gy',y*100+'%')});f.addEventListener('mouseleave',()=>f.style.transform='')}));

/* panier */
const KEY='seve_cart';
const rd=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return []}};
const wr=c=>{try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}};
function ui(){const c=rd();$('cart-count').textContent=c.reduce((a,i)=>a+i.qty,0);let tot=0;const box=$('cart-items');box.innerHTML='';
c.forEach((it,i)=>{tot+=it.price*it.qty;const d=document.createElement('div');d.className='cart-item';d.innerHTML=`<div class="item-details"><span>${it.name}</span><small>${it.size}</small></div><div class="qty"><button data-i="${i}" data-d="-1">−</button><b>${it.qty}</b><button data-i="${i}" data-d="1">+</button></div><span>${eur(it.price*it.qty)}</span>`;box.appendChild(d)});
$('cart-total').textContent=eur(tot)}
function fly(){S(()=>{const a=f3.getBoundingClientRect(),b=$('cart-toggle').getBoundingClientRect(),c=document.createElement('div');c.className='fly';c.innerHTML=FR;c.style.left=a.left+a.width/2-30+'px';c.style.top=a.top+a.height/2-30+'px';document.body.appendChild(c);
const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2);
const an=c.animate([{transform:'translate(0,0) scale(1) rotate(0)'},{transform:`translate(${dx*.45}px,${dy*.45-120}px) scale(.8) rotate(180deg)`,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.2) rotate(360deg)`,opacity:.3}],{duration:700,easing:'ease-in'});
an.onfinish=()=>{c.remove();$('cart-count').animate([{transform:'scale(1)'},{transform:'scale(1.7)'},{transform:'scale(1)'}],{duration:400})};
setTimeout(()=>{if(c.isConnected)c.remove()},1300)})}
S(()=>{
const sel=$('product-size');
sel.onchange=()=>{$('price').textContent=eur(Math.round(CFG.price*+sel.selectedOptions[0].dataset.m*100)/100)};sel.onchange();
$('cart-toggle').onclick=()=>drawer.classList.add('open');
$('close-cart').onclick=()=>drawer.classList.remove('open');
addEventListener('keydown',e=>{if(e.key==='Escape')drawer.classList.remove('open')});
$('add-to-cart').onclick=()=>{const qty=Math.max(1,parseInt($('product-qty').value)||1),pr=Math.round(CFG.price*+sel.selectedOptions[0].dataset.m*100)/100;fly();const c=rd(),ex=c.find(i=>i.id===CFG.id&&i.size===sel.value);if(ex)ex.qty+=qty;else c.push({id:CFG.id,name:CFG.pname,price:pr,size:sel.value,qty});wr(c);ui()};
$('cart-items').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const c=rd(),i=+b.dataset.i;c[i].qty+=+b.dataset.d;if(c[i].qty<=0)c.splice(i,1);wr(c);ui()});
$('checkout-btn').onclick=()=>alert('Merci pour votre commande ! SÈVE prépare votre colis.');
ui()});

/* chargement */
S(()=>{const n=CFG.frames,bar=$('progress-bar'),pc=$('percent'),lq=$('liquid');let c=0;
for(let i=1;i<=n;i++){const im=new Image();im.onload=im.onerror=()=>{c++;const p=Math.floor(c/n*100);bar.style.width=p+'%';pc.textContent=p+'%';lq.style.height=p+'%';if(c===n){loaded=true;setTimeout(()=>{$('loader').classList.add('done');setTimeout(()=>{$('loader').style.display='none'},900)},350)}};
im.src=`${CFG.folder}/ezgif-frame-${String(i).padStart(3,'0')}.jpg`;frames[i-1]=im}});

/* boucle unique */
function tick(){requestAnimationFrame(tick);
if(fx){px+=(mx-px)*.08;py+=(my-py)*.08;cgx+=(gx-cgx)*.12;cgy+=(gy-cgy)*.12;
glow.style.transform=`translate(${cgx}px,${cgy}px) translate(-50%,-50%)`;
par.style.transform=`perspective(900px) rotateY(${px*6}deg) rotateX(${-py*6}deg)`;
for(const f of fls)f.style.transform=`translate3d(${px*f._z}px,${py*f._z}px,0)`}
if(!fdrag&&!reduce)fy+=.35;
f3.style.transform=`rotateX(${fx?-py*24:0}deg) rotateY(${fy}deg)`;
if(Math.abs(tgt-ang)>.05){ang+=(tgt-ang)*.12;ring.style.transform=`translateZ(${-R}px) rotateY(${ang}deg)`}
const fo=((Math.round(-ang/120)%3)+3)%3;if(fo!==focus){focus=fo;rcs.forEach(c=>c.classList.toggle('front',c._i===fo))}
if(!loaded)return;
const r=wrap.getBoundingClientRect(),tt=wrap.offsetHeight-innerHeight;
progress=tt>0?Math.min(1,Math.max(0,-r.top/tt)):0;
const tf=progress*(CFG.frames-1);
if(first){cur=tf;first=false}
cur+=(tf-cur)*.13;if(Math.abs(tf-cur)<.05)cur=tf;
const fi=Math.min(CFG.frames-1,Math.max(0,Math.round(cur)));
if(fi!==last||redraw){const im=frames[fi];if(im&&im.naturalWidth){draw(im);last=fi;redraw=false}}
texts.forEach(t=>t.classList.toggle('active',progress>=+t.dataset.start&&progress<=+t.dataset.end));
hint.style.opacity=Math.max(0,.7-progress*20);
dock.classList.toggle('show',progress>.98&&!drawer.classList.contains('open'))}
requestAnimationFrame(tick);
})();