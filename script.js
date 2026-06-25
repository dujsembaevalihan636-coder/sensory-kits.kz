const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* mobile menu */
const burger=document.getElementById('burger'), navLinks=document.getElementById('navLinks');
if(burger && navLinks){
  burger.addEventListener('click',()=>{const o=navLinks.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
}

/* puzzle (логотип-мозг есть только на главной странице) */
const brain=document.getElementById('brain'), tip=document.getElementById('senseTip');
if(brain){
  if(!reduce){brain.classList.add('assemble');setTimeout(()=>{brain.classList.remove('assemble');brain.classList.add('breathe');},1300);}
  brain.querySelectorAll('.piece').forEach(p=>{const l=p.getAttribute('data-sense');
    p.addEventListener('mouseenter',()=>{if(tip){tip.textContent=l;tip.classList.add('show');}});
    p.addEventListener('mouseleave',()=>{if(tip)tip.classList.remove('show');});});
}

/* reveal */
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* count-up */
function countUp(el){const t=+el.dataset.count,pre=el.dataset.prefix||'',suf=el.dataset.suffix||'';
  if(reduce){el.textContent=pre+t+suf;return;}
  const dur=1400,st=performance.now();
  function step(n){const k=Math.min(1,(n-st)/dur),e=1-Math.pow(1-k,3);el.textContent=pre+Math.round(t*e)+suf;if(k<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);}
const co=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){countUp(e.target);co.unobserve(e.target);}});},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));

/* modals (есть только на главной странице) */
let lastFocus=null;
function openModal(id){const m=document.getElementById(id);if(!m)return;lastFocus=document.activeElement;m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';const c=m.querySelector('.modal-close');if(c)c.focus();}
function closeModal(m){m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
document.querySelectorAll('[data-modal]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.modal)));
document.querySelectorAll('.modal').forEach(m=>m.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',()=>closeModal(m))));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=document.querySelector('.modal.open');if(o)closeModal(o);}});

/* box open + items fly out (есть только на странице "Подробнее") */
const boxwrap=document.getElementById('boxwrap'), spark=document.getElementById('spark');
if(boxwrap){
  const items=[...document.querySelectorAll('.item')];
  const openBtn=document.getElementById('openBtn'), openWrap=document.getElementById('openWrap'), replayBtn=document.getElementById('replayBtn');
  let opened=false, timers=[];
  function mouthCenter(){const r=boxwrap.getBoundingClientRect();return {x:r.left+r.width/2, y:r.top+r.height*0.40};}
  function resetItems(){timers.forEach(clearTimeout);timers=[];items.forEach(c=>{c.style.transition='none';c.style.transform='';c.style.opacity='0';c.classList.remove('shown');});}
  function fly(){
    if(reduce){items.forEach(c=>{c.style.opacity='1';c.classList.add('shown');});boxwrap.classList.add('open');return;}
    boxwrap.classList.add('open');
    const m=mouthCenter();
    items.forEach(c=>{const r=c.getBoundingClientRect();const dx=m.x-(r.left+r.width/2),dy=m.y-(r.top+r.height/2);const rot=(Math.random()*40-20).toFixed(1);
      c.style.transition='none';c.style.transform=`translate(${dx}px,${dy}px) scale(.18) rotate(${rot}deg)`;c.style.opacity='0';});
    void boxwrap.offsetWidth;
    items.forEach((c,i)=>{const t=setTimeout(()=>{
        c.style.transition='transform .68s cubic-bezier(.2,.9,.35,1.25), opacity .35s ease';
        c.style.transform='none';c.style.opacity='1';c.classList.add('shown');
        if(spark){spark.classList.remove('go');void spark.offsetWidth;spark.classList.add('go');}
      },380+i*300);timers.push(t);});
    timers.push(setTimeout(()=>{if(replayBtn)replayBtn.classList.add('show');},380+items.length*300+400));
  }
  function openBox(){if(opened)return;opened=true;if(openWrap)openWrap.style.display='none';fly();}
  if(openBtn)openBtn.addEventListener('click',openBox);
  if(replayBtn)replayBtn.addEventListener('click',()=>{boxwrap.classList.remove('open');replayBtn.classList.remove('show');resetItems();setTimeout(fly,350);});
  const auto=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting&&!opened){openBox();auto.disconnect();}});},{threshold:.35});
  auto.observe(boxwrap);
}
