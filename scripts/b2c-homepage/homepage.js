(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manualReduced=false;
  const isReduced=()=>reduce.matches||manualReduced;
  const isStatic=()=>isReduced()||innerHeight<640;
  const motionToggle=document.getElementById('motion-toggle');
  const journey = document.getElementById('journey');
  const steps = [...document.querySelectorAll('.story-step')];
  const buttons = [...document.querySelectorAll('[data-chapter]')];
  const progress = document.querySelector('.journey-progress i');
  const notes = [
    ['GOOD MORNING','Your day, in context.','Sleep · Goals · Daily guidance'],
    ['MEALS AT HOME','Use what you have. Or plan the week.','Recipes · Full meal plans · Shopping list'],
    ['FIND FOOD NEARBY','See dishes that fit your goals.','Restaurant menus · Nutrition estimates'],
    ['AT PARTNER VENUES','One scan. Your best-fit dishes.','Chef-approved swaps · Portion adjustments'],
    ['PHOTO FOOD LOG','Snap the plate. Keep the context.','Meal photo · Nutrition estimate · Daily log'],
    ['YOUR PERSONAL COACH','Talk to Luma any time.','Meals · Wearable data · Daily check-in'],
    ['DAILY INSIGHT','Tomorrow is sharper than today.','Patterns that compound']
  ];
  let active = -1;
  function setStep(index) {
    if (index === active) return;
    active = index;
    steps.forEach((el,i) => { el.classList.toggle('active',i === index); });
    buttons.forEach((el,i) => { if (i === (index<2?0:index<5?1:2)) el.setAttribute('aria-current','step'); else el.removeAttribute('aria-current'); });
    ['note-label','note-value','note-detail'].forEach((id,i) => document.getElementById(id).textContent=notes[index][i]);
    document.getElementById('scene-space').setAttribute('aria-label',[
      '3D bedroom in the morning','3D breakfast bowl and kitchen ingredients','3D neighbourhood cafe and a personalised meal result',
      '3D restaurant table with a TLC QR stand','3D cafe meal photographed for the daily food log','3D evening scene with Luma and connected signals','A woman sleeping peacefully in bed at night'
    ][index]);
  }
  let queued = false;
  function update() {
    queued=false;
    if (isStatic()) return;
    const top = parseFloat(getComputedStyle(document.querySelector('.journey-pin')).top)||0;
    const distance = journey.offsetHeight - document.querySelector('.journey-pin').offsetHeight;
    const p = Math.max(0,Math.min(1,(top-journey.getBoundingClientRect().top)/distance));
    // Holds at each story beat, moving the camera during the short intervals between them.
    const phase=p*(steps.length-.001);
    const chapter=Math.min(steps.length-1,Math.floor(phase));
    const local=phase-chapter;
    const transition=Math.max(0,Math.min(1,(local-.62)/.38));
    const ease=transition*transition*(3-2*transition);
    const cameraProgress=Math.min(steps.length-1,chapter+ease);
    setStep(Math.min(steps.length-1,Math.round(cameraProgress)));
    progress.style.width=(p*100)+'%';
    window.tlcJourneyProgress=cameraProgress;
    window.dispatchEvent(new CustomEvent('tlc:journey',{detail:{progress:cameraProgress}}));
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  function configure(){document.body.classList.toggle('journey-enhanced',!isStatic());document.body.classList.toggle('motion-reduced',isReduced());document.body.classList.toggle('short-screen',innerHeight<640);motionToggle.textContent=isReduced()?'Enable motion':'Reduce motion';motionToggle.setAttribute('aria-pressed',String(isReduced()));motionToggle.disabled=reduce.matches||innerHeight<640;if(reduce.matches)motionToggle.textContent='Reduced motion';else if(innerHeight<640)motionToggle.textContent='Reading view';window.dispatchEvent(new CustomEvent('tlc:motion'));schedule();}
  configure(); reduce.addEventListener('change',configure);
  motionToggle.addEventListener('click',()=>{manualReduced=!manualReduced;configure();if(isReduced()){cancelAnimationFrame(frame);draw(1);}document.getElementById('journey').scrollIntoView({behavior:'instant'});});
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',configure);
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const index=Number(button.dataset.chapter);
    const pin=document.querySelector('.journey-pin');
    const offset=parseFloat(getComputedStyle(pin).top)||0;
    const distance=journey.offsetHeight-pin.offsetHeight;
    window.scrollTo({top:journey.getBoundingClientRect().top+scrollY-offset+distance*(index+.18)/steps.length,behavior:isReduced()?'instant':'smooth'});
  }));
  // Native menu and ordinary anchor scrolling remain available without WebGL.
  const menu=document.getElementById('mobile-menu');
  const toggle=document.querySelector('.menu-button');
  function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');}
  toggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');});
  menu.querySelectorAll('a,button').forEach(el=>el.addEventListener('click',closeMenu));
  addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeLoginModal();closeContactModal();}});

  // Preserve the original pixel-to-picture Mona Lisa idea in an independent, replayable canvas.
  const canvas=document.getElementById('threadCanvas');
  const ctx=canvas.getContext('2d');
  const source=document.querySelector('.mona-fallback');
  let frame=0,current=0,replaying=false;
  const rail=document.querySelector('.clarity-rail');
  const clarity=document.getElementById('threadHero');
  const clarityLabel=document.getElementById('clarity-label');
  const signals=[...clarity.querySelectorAll('.signal')];
  const mobilePortrait=matchMedia('(max-width:700px)');
  function draw(p){
    if(!ctx||!source.naturalWidth)return;
    current=p;
    const nw=source.naturalWidth,nh=source.naturalHeight;
    const w=Math.round(10+(Math.min(nw,canvas.clientWidth*Math.max(1,devicePixelRatio))-10)*p*p);
    const h=Math.max(1,Math.round(w*canvas.clientHeight/canvas.clientWidth));
    canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=p>.94;
    canvas.style.imageRendering=p>.94?'auto':'pixelated';
    clarityLabel.textContent=p>.98?'Everything comes into focus.':p>.12?'The picture is coming into focus.':'Watch the picture come into focus.';
    signals.forEach((signal,index)=>signal.classList.toggle('is-lit',p>[.08,.35,.62][index]));
    const ease=p*p*p,sw=mobilePortrait.matches?nw:nw*(.10+.90*ease),sh=mobilePortrait.matches?nh:nh*(.10+.90*ease);
    const cx=nw*(.52-.02*ease),cy=nh*(.32+.18*ease);
    const sx=Math.max(0,Math.min(nw-sw,cx-sw/2)),sy=Math.max(0,Math.min(nh-sh,cy-sh/2));
    ctx.drawImage(source,sx,sy,sw,sh,0,0,w,h);
  }
  function replay(){
    cancelAnimationFrame(frame);
    if(isReduced()){draw(1);return;}
    let start;
    replaying=true;
    const tick=ts=>{start??=ts;const p=Math.min(1,(ts-start)/6500);draw(p);if(p<1)frame=requestAnimationFrame(tick);else replaying=false;};
    frame=requestAnimationFrame(tick);
  }
  let revealStarted=false;
  const revealTarget=mobilePortrait.matches?clarity.querySelector('.art-frame'):clarity;
  function startWhenVisible(){
    if(!source.naturalWidth||revealStarted)return;
    const rect=revealTarget.getBoundingClientRect();
    const visible=Math.max(0,Math.min(rect.bottom,innerHeight)-Math.max(rect.top,0));
    const ready=mobilePortrait.matches?visible>=rect.height*.7:rect.top<innerHeight-100&&rect.bottom>100;
    if(ready){revealStarted=true;replay();}
  }
  const revealObserver=new IntersectionObserver(startWhenVisible,{threshold:mobilePortrait.matches?[0,.25,.5,.7,1]:.25});
  revealObserver.observe(revealTarget);
  source.addEventListener('load',()=>{draw(0);startWhenVisible();});
  source.addEventListener('error',()=>{canvas.hidden=true;document.getElementById('replay-clarity').hidden=true;});
  if(source.complete&&source.naturalWidth){draw(0);startWhenVisible();}
  document.getElementById('replay-clarity').addEventListener('click',replay);
  addEventListener('resize',()=>draw(current));
  reduce.addEventListener('change',()=>{cancelAnimationFrame(frame);draw(1);});
  // Dialog focus management supplements the existing, unchanged authentication and contact requests.
  let returnFocus=null;
  const login=document.getElementById('loginOverlay'),contact=document.getElementById('contactOverlay');
  [login,contact].forEach(overlay=>{
    new MutationObserver(()=>{
      const visible=getComputedStyle(overlay).display!=='none'&&getComputedStyle(overlay).visibility!=='hidden';
      const isOpen=overlay===login?overlay.classList.contains('open'):visible;
      if(isOpen&&!overlay.dataset.focused){returnFocus=document.activeElement;overlay.dataset.focused='true';overlay.querySelector('button,input')?.focus();}
      else if(!isOpen&&overlay.dataset.focused){delete overlay.dataset.focused;returnFocus?.focus();}
    }).observe(overlay,{attributes:true,attributeFilter:['class','style']});
    overlay.addEventListener('keydown',e=>{
      if(e.key!=='Tab')return;
      const focusable=[...overlay.querySelectorAll('button,input,textarea,a[href],[tabindex="0"]')].filter(el=>el.offsetParent!==null&&!el.disabled);
      const first=focusable[0],last=focusable.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    });
  });
})();

// The approved TLC green nebula, scoped to the Mona Lisa reveal.
(()=>{
  const canvas=document.getElementById('clarityNebula');
  if(!canvas)return;
  const section=canvas.closest('.clarity-section');
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const green=[46,168,74];
  const rgba=(alpha)=>`rgba(${green[0]},${green[1]},${green[2]},${alpha})`;
  const nodes=[
    {a:0,rx:.32,ry:.28,spd:.004,dot:2,bright:.24},
    {a:1.05,rx:.24,ry:.20,spd:-.005,dot:1.8,bright:.19},
    {a:2.09,rx:.38,ry:.32,spd:.003,dot:2.2,bright:.25},
    {a:3.14,rx:.18,ry:.22,spd:-.006,dot:1.5,bright:.17},
    {a:4.19,rx:.30,ry:.25,spd:.0045,dot:1.8,bright:.21},
    {a:5.24,rx:.35,ry:.18,spd:-.0035,dot:1.6,bright:.19},
    {a:.52,rx:.15,ry:.30,spd:.007,dot:1.5,bright:.16},
    {a:2.62,rx:.40,ry:.15,spd:-.003,dot:1.8,bright:.19}
  ];
  let width=0,height=0,dpr=1,visible=false,frame=0,t=0,ring=0;
  function resize(){
    const rect=section.getBoundingClientRect();
    dpr=Math.min(devicePixelRatio||1,2);
    width=rect.width;height=rect.height;
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    draw();
  }
  function draw(){
    if(!width||!height)return;
    const cx=width*.5,cy=height*.52;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,width,height);
    const points=nodes.map(n=>({n,x:cx+Math.cos(n.a)*n.rx*width,y:cy+Math.sin(n.a)*n.ry*height}));
    const wash=ctx.createRadialGradient(cx,cy,20,cx,cy,Math.max(width,height)*.52);
    wash.addColorStop(0,'rgba(57,186,118,.07)');wash.addColorStop(1,'rgba(57,186,118,0)');
    ctx.fillStyle=wash;ctx.fillRect(0,0,width,height);
    if(ring>0){ctx.beginPath();ctx.arc(cx,cy,ring,0,Math.PI*2);ctx.strokeStyle=rgba(.10*(1-ring/Math.max(width,height)));ctx.lineWidth=1;ctx.stroke();}
    points.forEach(p=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.strokeStyle=rgba(.10);ctx.lineWidth=.8;ctx.stroke();});
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
      const a=points[i],b=points[j],distance=Math.hypot(a.x-b.x,a.y-b.y),limit=Math.min(width,height)*.44;
      if(distance<limit){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=rgba((1-distance/limit)*.13);ctx.lineWidth=.7;ctx.stroke();}
    }
    points.forEach(p=>{const n=p.n,g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,15);g.addColorStop(0,rgba(n.bright*.24));g.addColorStop(1,rgba(0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,15,0,Math.PI*2);ctx.fill();ctx.fillStyle=rgba(n.bright+.18);ctx.beginPath();ctx.arc(p.x,p.y,n.dot,0,Math.PI*2);ctx.fill();});
  }
  function tick(){
    if(!visible||reduce.matches){frame=0;return;}
    t++;
    nodes.forEach(n=>n.a+=n.spd);
    ring=(ring+1.1)%(Math.max(width,height)*.55);
    draw();frame=requestAnimationFrame(tick);
  }
  new ResizeObserver(resize).observe(section);
  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible&&!frame&&!reduce.matches)frame=requestAnimationFrame(tick);
  },{threshold:.05}).observe(section);
  reduce.addEventListener('change',()=>{if(reduce.matches){cancelAnimationFrame(frame);frame=0;draw();}else if(visible&&!frame)frame=requestAnimationFrame(tick);});
})();
