/* ============================================================
   HASSAN UDDIN KHAN — PORTFOLIO script.js v3
   Modules: Loader | Cursor | SmoothScroll | Particles |
   GSAP | Marquee | Counters | Modal | Form | TopBtn | Clock
============================================================ */

/* ─── Project data ───────────────────────────────────── */
const PROJECTS = [
  {
    num:'01', title:'Idiom Similes', year:'2025', visual:'1',
    url:'https://idiomsimile.com/',
    image:'./Images/idiom similies.png',
    desc:'An educational English-language platform dedicated to helping students and content creators master idioms, similes, and metaphors. The site offers clear explanations, real-life usage examples, and categorised browsing across hundreds of expressive phrases — making advanced English accessible and engaging.',
    tags:['WordPress','Content Platform','SEO','Education'],
    rows:[
      {label:'Role',     val:'Frontend Developer'},
      {label:'Type',     val:'Client Work'},
      {label:'Stack',    val:'WordPress, CSS'},
      {label:'Status',   val:'Live'},
    ],
  },
  {
    num:'02', title:'Tes Pire', year:'2025', visual:'2',
    url:'https://tes-pire.com/',
    image:'./Images/Tes Pire.png',
    desc:'A polished corporate website for TESpire, a professional services company. The site communicates brand authority through a clean, structured layout — featuring seamless navigation across services, careers, and contact pages — designed to convert visitors into qualified leads.',
    tags:['WordPress','Corporate','UI Design','Responsive'],
    rows:[
      {label:'Role',     val:'Web Developer'},
      {label:'Type',     val:'Client Work'},
      {label:'Stack',    val:'WordPress, CSS'},
      {label:'Status',   val:'Live'},
    ],
  },
  {
    num:'03', title:'GSC Gradient', year:'2025', visual:'3',
    url:'https://gradient-cont.com/',
    image:'./Images/GSC-gradient.png',
    desc:'A corporate web presence for Gradient Specialized Contracting, a Saudi-based firm operating across commercial construction, heavy equipment rental, and media production. The site positions the brand as a trusted industry leader, showcasing over 50 client partnerships through a confident, high-impact design.',
    tags:['WordPress','Construction','Corporate','Arabic-ready'],
    rows:[
      {label:'Role',     val:'Web Developer'},
      {label:'Type',     val:'Client Work'},
      {label:'Stack',    val:'WordPress, CSS'},
      {label:'Status',   val:'Live'},
    ],
  },
  {
    num:'04', title:'Burqora', year:'2025', visual:'4',
    url:'https://burqora.io/',
    image:'./Images/Burqora.png',
    desc:'A SaaS product website for BurqOra, an all-in-one workforce management platform redefining how modern businesses handle team performance, goal-driven engagement, and compensation. The site blends clean product storytelling with clear conversion paths — from feature overviews to pricing and booking.',
    tags:['WordPress','SaaS','Product Design','Conversion'],
    rows:[
      {label:'Role',     val:'Frontend Developer'},
      {label:'Type',     val:'Client Work'},
      {label:'Stack',    val:'WordPress, CSS'},
      {label:'Status',   val:'Live'},
    ],
  },
];

/* ─── Easing ─────────────────────────────────────────── */
const easeOut  = t => t===1?1:1-Math.pow(2,-10*t);
const easeInOut= t => t===0?0:t===1?1:t<.5?Math.pow(2,20*t-10)/2:(2-Math.pow(2,-20*t+10))/2;

/* ─── Cursor (desktop only) ──────────────────────────── */
(function(){
  const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 1024;
  const cur=document.getElementById('cursor');

  // Hide cursor entirely on mobile/tablet
  if(isTouchDevice()){
    if(cur) cur.style.display='none';
    document.body.style.cursor='auto';
    return;
  }

  const dot=document.querySelector('.cursor__dot');
  const ring=document.querySelector('.cursor__ring');
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  document.addEventListener('mouseleave',()=>{cur.style.opacity='0';});
  document.addEventListener('mouseenter',()=>{cur.style.opacity='1';});
  document.addEventListener('mouseover',e=>{
    if(e.target.closest('a,button,.project-card,.btn,.cap-item,.service-card,.testimonial-card,.form-submit')){
      cur.classList.add('cursor--hover');
    } else {
      cur.classList.remove('cursor--hover');
    }
  });
  (function tick(){
    dot.style.left=`${mx}px`;dot.style.top=`${my}px`;
    rx+=(mx-rx)*.11;ry+=(my-ry)*.11;
    ring.style.left=`${rx}px`;ring.style.top=`${ry}px`;
    requestAnimationFrame(tick);
  })();
})();

/* ─── Clock (Karachi time) ───────────────────────────── */
(function(){
  const el=document.getElementById('footerTime');
  if(!el)return;
  const upd=()=>{el.textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Karachi',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});};
  upd();setInterval(upd,1000);
})();

/* ─── Loader ─────────────────────────────────────────── */
function runLoader(){
  return new Promise(resolve=>{
    const fill=document.getElementById('loaderFill');
    const pct=document.getElementById('loaderPercent');
    const ldr=document.getElementById('loader');
    let prog=0,t0=null;
    const TOTAL=2000;
    const target=e=>{
      const t=Math.min(e/TOTAL,1);
      if(t<.35) return easeOut(t/.35)*60;
      if(t<.72) return 60+((t-.35)/.37)*25;
      return 85+easeOut((t-.72)/.28)*15;
    };
    const tick=ts=>{
      if(!t0)t0=ts;
      const el=ts-t0;
      prog+=(target(el)-prog)*.14;
      fill.style.width=`${prog}%`;
      pct.textContent=Math.round(Math.min(prog,100));
      if(el<TOTAL||prog<99.5){requestAnimationFrame(tick);}
      else{
        fill.style.width='100%';pct.textContent='100';
        setTimeout(()=>{
          ldr.style.transition='opacity 1s cubic-bezier(.87,0,.13,1)';
          ldr.style.opacity='0';
          setTimeout(()=>{ldr.style.display='none';resolve();},1050);
        },300);
      }
    };
    setTimeout(()=>requestAnimationFrame(tick),500);
  });
}

/* ─── Smooth Scroll Engine ───────────────────────────── */
class SmoothScroll{
  constructor({content,ease=.08}){
    this.content=content;this.ease=ease;
    this.current=0;this.target=0;this.last=0;this.velocity=0;this.limit=0;
    this._cbs=[];this._touch=0;
  }
  init(){
    this._calc();
    window.addEventListener('wheel',e=>{
      e.preventDefault();
      this.target=Math.max(0,Math.min(this.target+e.deltaY,this.limit));
    },{passive:false});
    window.addEventListener('touchstart',e=>{this._touch=e.touches[0].clientY;},{passive:true});
    window.addEventListener('touchmove',e=>{
      e.preventDefault();
      const d=this._touch-e.touches[0].clientY;
      this._touch=e.touches[0].clientY;
      this.target=Math.max(0,Math.min(this.target+d*2,this.limit));
    },{passive:false});
    window.addEventListener('resize',()=>{this._calc();ScrollTrigger&&ScrollTrigger.refresh();});
    this._tick();
  }
  _calc(){setTimeout(()=>{this.limit=this.content.scrollHeight-window.innerHeight;},300);}
  _tick(){
    this.current+=(this.target-this.current)*this.ease;
    if(Math.abs(this.target-this.current)<.05)this.current=this.target;
    this.velocity=this.current-this.last;this.last=this.current;
    this.content.style.transform=`translateY(${-this.current}px)`;
    this._cbs.forEach(fn=>fn(this.current,this.velocity));
    requestAnimationFrame(()=>this._tick());
  }
  on(fn){this._cbs.push(fn);}
  scrollTo(y,instant=false){this.target=Math.max(0,Math.min(y,this.limit));if(instant)this.current=this.target;}
  get scrollY(){return this.current;}
}

/* ─── Marquee ────────────────────────────────────────── */
function initMarquee(){
  const track=document.getElementById('marqueeTrack');
  if(!track)return;
  const inner=track.querySelector('.marquee__inner');
  if(!inner)return;
  track.appendChild(inner.cloneNode(true));
  let x=0;
  (function tick(){
    x-=.55;
    if(Math.abs(x)>=inner.offsetWidth)x=0;
    track.style.transform=`translateX(${x}px)`;
    requestAnimationFrame(tick);
  })();
}

/* ─── Number counters ────────────────────────────────── */
function initCounters(scroller){
  const els=[...document.querySelectorAll('.stat__num[data-count]')];
  if(!els.length)return;
  const triggered=new Set();

  function animateCounter(el){
    const target=parseInt(el.dataset.count,10);
    const suffix=el.dataset.suffix||'+';
    const t0=performance.now();const dur=1800;
    (function frame(now){
      const t=Math.min((now-t0)/dur,1);
      el.textContent=Math.round(easeOut(t)*target)+suffix;
      if(t<1)requestAnimationFrame(frame);
    })(performance.now());
  }

  function check(){
    const scrollY=scroller?scroller.scrollY:window.scrollY;
    const winH=window.innerHeight;
    els.forEach(el=>{
      if(triggered.has(el))return;
      const rect=el.getBoundingClientRect();
      // For smooth-scroll, getBoundingClientRect reflects CSS-transform position
      // so we just check if element is in viewport
      if(rect.top<winH*0.88 && rect.bottom>0){
        triggered.add(el);
        animateCounter(el);
      }
    });
  }

  // Hook into custom scroller ticks
  if(scroller){
    scroller.on(check);
  }
  // Fallback for native scroll
  window.addEventListener('scroll',check,{passive:true});
  // Check immediately in case stats are already in view
  setTimeout(check,400);
}

/* ─── IntersectionObserver for scroll reveals ────────── */
function initRevealObserver(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.reveal-text').forEach(el=>obs.observe(el));
}

/* ─── Three.js Hero Particles ────────────────────────── */
function initParticles(){
  const canvas=document.getElementById('heroCanvas');
  if(!canvas||!window.THREE)return;
  const W=canvas.offsetWidth,H=canvas.offsetHeight;
  const gl=canvas.getContext('webgl')||canvas.getContext('experimental-webgl');
  if(!gl){canvas.style.display='none';return;}
  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false});
  }catch(err){
    canvas.style.display='none';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.setSize(W,H,false);
  renderer.setClearColor(0x000000,0);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(55,W/H,.1,200);
  camera.position.z=55;
  const COUNT=window.innerWidth<768?1000:2500;
  const pos=new Float32Array(COUNT*3);
  const phase=new Float32Array(COUNT);
  for(let i=0;i<COUNT;i++){
    const r=18+Math.random()*44;
    const t=Math.random()*Math.PI*2;
    const p=Math.acos(2*Math.random()-1);
    pos[i*3]=r*Math.sin(p)*Math.cos(t);
    pos[i*3+1]=r*Math.sin(p)*Math.sin(t);
    pos[i*3+2]=r*Math.cos(p);
    phase[i]=Math.random()*Math.PI*2;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:0xaabbff,size:.28,transparent:true,opacity:.4,sizeAttenuation:true});
  const points=new THREE.Points(geo,mat);
  scene.add(points);

  /* Accent cluster */
  const aC=400,aPos=new Float32Array(aC*3);
  for(let i=0;i<aC;i++){
    const r=7+Math.random()*12,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);
    aPos[i*3]=r*Math.sin(p)*Math.cos(t);aPos[i*3+1]=r*Math.sin(p)*Math.sin(t);aPos[i*3+2]=r*Math.cos(p);
  }
  const aGeo=new THREE.BufferGeometry();
  aGeo.setAttribute('position',new THREE.BufferAttribute(aPos,3));
  const aMat=new THREE.PointsMaterial({color:0x7B8EF7,size:.22,transparent:true,opacity:.4,sizeAttenuation:true});
  const acc=new THREE.Points(aGeo,aMat);
  acc.position.set(14,6,-8);
  scene.add(acc);

  let mx=0,my=0,tx=0,ty=0;
  window.addEventListener('mousemove',e=>{
    mx=(e.clientX/window.innerWidth)*2-1;
    my=-(e.clientY/window.innerHeight)*2+1;
  });
  const clock=new THREE.Clock();
  (function tick(){
    const t=clock.getElapsedTime();
    const p=geo.attributes.position.array;
    for(let i=0;i<COUNT;i++) p[i*3+1]+=Math.sin(t*.35+phase[i])*.003;
    geo.attributes.position.needsUpdate=true;
    tx+=(mx-tx)*.04;ty+=(my-ty)*.04;
    camera.rotation.x=ty*.07;camera.rotation.y=tx*.07;
    points.rotation.y=t*.018;acc.rotation.y=-t*.03;acc.rotation.x=t*.015;
    renderer.render(scene,camera);
    requestAnimationFrame(tick);
  })();
  window.addEventListener('resize',()=>{
    const W2=canvas.offsetWidth,H2=canvas.offsetHeight;
    camera.aspect=W2/H2;camera.updateProjectionMatrix();
    renderer.setSize(W2,H2,false);
  });
}

/* ─── GSAP Scroll Animations ─────────────────────────── */
function initGSAP(scroller){
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.scrollerProxy('#smooth-content',{
    scrollTop(v){if(arguments.length)scroller.scrollTo(v);return scroller.scrollY;},
    getBoundingClientRect(){return{top:0,left:0,width:window.innerWidth,height:window.innerHeight};},
    pinType:'transform',
  });
  scroller.on(()=>ScrollTrigger.update());
  window.addEventListener('resize',()=>{ScrollTrigger.refresh();});

  /* Hero entrance */
  gsap.fromTo('#nav',{y:-28,opacity:0},{y:0,opacity:1,duration:.8,ease:'expo.out',delay:.3});

  /* ── Horizontal work scroll (fixed for all screen sizes) ── */
  const track=document.getElementById('workTrack');
  const work=document.getElementById('work');
  const bar=document.getElementById('workProgressBar');

  if(track&&work){
    let _horizST=null; // keep reference so we can kill/rebuild on resize

    const setupHorizontalScroll=()=>{
      // Kill previous instance if rebuilding
      if(_horizST){_horizST.kill();_horizST=null;}
      // Reset any leftover transform so measurements are clean
      gsap.set(track,{x:0});

      const trackW = track.scrollWidth;
      const winW   = window.innerWidth;
      // Distance = total track width minus one viewport — no padding double-count
      const dist   = trackW - winW;
      if(dist<=10){
        // All cards already fit — just fill the bar and skip pinning
        if(bar)bar.style.width='100%';
        return;
      }

      // Offset the pin start by the section header height so the header
      // is fully in view BEFORE horizontal scrolling begins
      const header  = work.querySelector('.section-header');
      const headerH = header
        ? header.getBoundingClientRect().height
          + parseFloat(getComputedStyle(header).marginBottom||'0')
        : 0;

      const tween = gsap.to(track,{
        x: -dist,
        ease: 'none',
        scrollTrigger:{
          trigger: work,
          scroller: '#smooth-content',
          // Pin starts AFTER the header has scrolled to the top of the viewport
          start: `top+=${headerH} top`,
          end: `+=${dist}`,
          pin: true,
          pinSpacing: true,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self=>{
            if(bar)bar.style.width=`${self.progress*100}%`;
          },
          onToggle: ()=>setTimeout(()=>scroller._calc(),400),
        },
      });
      _horizST = tween.scrollTrigger;
      setTimeout(()=>scroller._calc(),600);
    };

    // Initial setup — wait for fonts & layout to settle
    requestAnimationFrame(()=>setTimeout(setupHorizontalScroll,200));

    // Rebuild on resize (debounced)
    let _resizeTimer;
    window.addEventListener('resize',()=>{
      clearTimeout(_resizeTimer);
      _resizeTimer=setTimeout(()=>{
        setupHorizontalScroll();
        ScrollTrigger.refresh(true);
        setTimeout(()=>scroller._calc(),400);
      },300);
    });
  }

  /* Hero canvas parallax */
  gsap.to('#heroCanvas',{
    yPercent:18,ease:'none',
    scrollTrigger:{trigger:'#hero',scroller:'#smooth-content',start:'top top',end:'bottom top',scrub:true},
  });

  /* Nav solid */
  const nav=document.getElementById('nav');
  ScrollTrigger.create({
    trigger:'#smooth-content',scroller:'#smooth-content',
    start:'top top',end:'100px top',
    onLeave:()=>nav?.classList.add('nav--solid'),
    onEnterBack:()=>nav?.classList.remove('nav--solid'),
  });

  /* Recalc scroller limit after pin spacers are injected */
  setTimeout(()=>scroller._calc(),800);
  setTimeout(()=>scroller._calc(),1600);
  setTimeout(()=>scroller._calc(),3000);
}

/* ─── Anchor scroll ──────────────────────────────────── */
function initAnchorScroll(scroller){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault();
      const id=a.getAttribute('href').slice(1);
      const el=document.getElementById(id);
      if(!el)return;
      const rect=el.getBoundingClientRect();
      const target=scroller.scrollY+rect.top-72;
      const start=scroller.scrollY;
      const dist=target-start;
      const dur=1100;const t0=performance.now();
      (function step(now){
        const p=Math.min((now-t0)/dur,1);
        scroller.scrollTo(start+dist*easeInOut(p),true);
        if(p<1)requestAnimationFrame(step);
      })(performance.now());
    });
  });
}

function initMobileNav(){
  const toggle=document.getElementById('mobileMenuToggle');
  const menu=document.getElementById('mobileMenu');
  if(!toggle||!menu)return;
  const links=menu.querySelectorAll('a');
  const setOpen=open=>{
    document.body.classList.toggle('nav-open',open);
    toggle.classList.toggle('is-active',open);
    toggle.setAttribute('aria-expanded',open?'true':'false');
    toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    menu.setAttribute('aria-hidden',open?'false':'true');
  };
  toggle.addEventListener('click',()=>setOpen(!document.body.classList.contains('nav-open')));
  links.forEach(link=>link.addEventListener('click',()=>setOpen(false)));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
  window.addEventListener('resize',()=>{if(window.innerWidth>760)setOpen(false);});
}

/* ─── Jump to top button ─────────────────────────────── */
function initTopBtn(scroller){
  const btn=document.getElementById('topBtn');
  if(!btn)return;
  scroller.on(y=>{
    if(y>300)btn.classList.add('is-visible');
    else btn.classList.remove('is-visible');
  });
}

window.scrollToTop=function(){
  const scroller=window._scroller;
  if(!scroller)return;
  const start=scroller.scrollY;
  const dur=1000;const t0=performance.now();
  (function step(now){
    const p=Math.min((now-t0)/dur,1);
    scroller.scrollTo(start*(1-easeInOut(p)),true);
    if(p<1)requestAnimationFrame(step);
  })(performance.now());
};

/* ─── Contact Form (Web3Forms) ───────────────────────── */
/*
  ⚠️  SETUP — 1 step only:
  1. web3forms.com par jao
  2. Apna email daalo → Access Key milegi
  3. index.html mein hidden input ke value="YOUR_WEB3FORMS_KEY" replace karo
*/
function initContactForm(){
  const form=document.getElementById('contactForm');
  if(!form)return;

  const btn=document.getElementById('formSubmit');
  const success=document.getElementById('formSuccess');
  const error=document.getElementById('formError');

  form.addEventListener('submit', async e=>{
    e.preventDefault();
    btn.classList.add('is-loading');
    btn.disabled=true;
    success.classList.remove('visible');
    error.classList.remove('visible');
    success.style.display='none';
    error.style.display='none';

    // Check if access key is configured
    const keyInput=form.querySelector('input[name="access_key"]');
    if(!keyInput || keyInput.value==='YOUR_WEB3FORMS_KEY'){
      // Show friendly error
      btn.classList.remove('is-loading');
      btn.disabled=false;
      showError('⚙️ Form abhi configure nahi hua — web3forms.com se key lo aur index.html mein paste karo.');
      return;
    }

    try{
      const formData=new FormData(form);
      // Combine first + last name
      const firstName=formData.get('firstName')||'';
      const lastName=formData.get('lastName')||'';
      formData.set('name', `${firstName} ${lastName}`.trim());

      const res=await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        body: formData,
      });
      const json=await res.json();
      if(res.ok && json.success){
        showSuccess();
        form.reset();
      } else {
        throw new Error(json.message||'Submission failed');
      }
    } catch(err){
      console.error('Form error:',err);
      showError();
    } finally{
      btn.classList.remove('is-loading');
      btn.disabled=false;
    }
  });

  function showSuccess(){
    success.style.display='flex';
    success.classList.add('visible');
    setTimeout(()=>{success.classList.remove('visible');success.style.display='none';},6000);
  }
  function showError(msg){
    error.style.display='flex';
    error.classList.add('visible');
    if(msg){const span=error.querySelector('span');if(span)span.textContent=msg;}
    setTimeout(()=>{error.classList.remove('visible');error.style.display='none';},7000);
  }
}

/* ─── Modal ──────────────────────────────────────────── */
let _modalOpen=false;

window.openModal=function(idx){
  const p=PROJECTS[idx];
  const modal=document.getElementById('projectModal');
  if(!p||!modal)return;

  /* Image — use real screenshot if available, else fall back to abstract visual */
  const img=document.getElementById('modalImage');
  if(p.image){
    img.className='modal__image modal__image--photo';
    img.innerHTML=`<img src="${p.image}" alt="${p.title} screenshot" style="width:100%;height:100%;object-fit:cover;object-position:top;display:block;border-radius:inherit;" />`;
  } else {
    img.className=`modal__image project-card__visual project-card__visual--${p.visual}`;
    img.innerHTML='';
    const decorators={1:'<div class="visual__noise"></div><div class="visual__grid"></div><div class="visual__orb"></div>',2:'<div class="visual__noise"></div><div class="visual__rings"></div>',3:'<div class="visual__noise"></div><div class="visual__waves"></div>',4:'<div class="visual__noise"></div><div class="visual__grid"></div><div class="visual__lines"></div>'};
    img.innerHTML=decorators[p.visual]||'';
  }

  document.getElementById('modalYear').textContent=p.year;
  document.getElementById('modalNum').textContent=p.num;
  document.getElementById('modalTitle').textContent=p.title;
  document.getElementById('modalDesc').textContent=p.desc;
  /* Tags removed — clear the container */
  document.getElementById('modalTags').innerHTML='';
  document.getElementById('modalTable').innerHTML=p.rows.map(r=>`<div class="modal__row"><span class="modal__row-label">${r.label}</span><span class="modal__row-val">${r.val}</span></div>`).join('');

  const liveBtn=document.getElementById('modalLiveBtn');
  if(liveBtn){
    liveBtn.href=p.url||'#';
    liveBtn.style.pointerEvents=p.url?'auto':'none';
    liveBtn.style.opacity=p.url?'1':'0.4';
    liveBtn.setAttribute('aria-disabled', p.url ? 'false' : 'true');
    liveBtn.onclick=function(event){
      event.preventDefault();
      event.stopPropagation();
      if(!p.url)return;
      window.open(p.url, '_blank', 'noopener,noreferrer');
    };
  }

  modal.setAttribute('aria-hidden','false');
  modal.classList.add('is-open');
  document.body.style.cursor='auto';
  _modalOpen=true;
  document.getElementById('smooth-wrapper').style.pointerEvents='none';
};

window.closeModal=function(){
  const modal=document.getElementById('projectModal');
  if(!modal)return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.cursor='none';
  _modalOpen=false;
  document.getElementById('smooth-wrapper').style.pointerEvents='';
};

window.addEventListener('keydown',e=>{if(e.key==='Escape'&&_modalOpen)closeModal();});

/* ─── Boot ───────────────────────────────────────────── */
initMarquee();

runLoader().then(()=>{
  try{initParticles();}catch(err){const canvas=document.getElementById('heroCanvas');if(canvas)canvas.style.display='none';}

  const scroller=new SmoothScroll({
    content:document.getElementById('smooth-content'),
    ease:.076,
  });
  scroller.init();
  window._scroller=scroller;

  initGSAP(scroller);
  initRevealObserver();
  initCounters(scroller);
  initAnchorScroll(scroller);
  initMobileNav();
  initTopBtn(scroller);
  initContactForm();
});
