/* BOOK: loads chapters.json, draws one chapter at a time, handles menu + navigation */
const Book={
  chapters:[],i:0,
  async load(){
    const r=await fetch('assets/data/chapters.json');
    this.chapters=(await r.json()).chapters;
    menuList.innerHTML=this.chapters.map((c,n)=>`<li><button data-n="${n}">🍀 ${c.chapter} — ${c.title}</button></li>`).join('');
    menuList.onclick=e=>{const b=e.target.closest('button');if(b){this.go(+b.dataset.n);this.menu(false);}};
    menuBtn.onclick=()=>this.menu(true);menuClose.onclick=()=>this.menu(false);
    menu.addEventListener('click',e=>{if(e.target===menu)this.menu(false);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')this.menu(false);});
    page.addEventListener('click',e=>{
      // Photos / Videos buttons
      const t=e.target.closest('[data-tab]');
      if(t){this.tab(t.dataset.tab);return;}
      // Previous / Chapters / Next buttons
      const a=e.target.closest('[data-nav]');if(!a)return;
      a.dataset.nav==='menu'?this.menu(true):this.go(this.i+ +a.dataset.nav);
    });
    // Swipe between chapters (only clear horizontal swipes, so normal scrolling still works)
    let x=0,y=0;
    page.addEventListener('touchstart',e=>{x=e.touches[0].clientX;y=e.touches[0].clientY;},{passive:true});
    page.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;
      if(Math.abs(dx)>90&&Math.abs(dx)>Math.abs(dy)*2.5&&!e.target.closest('video'))this.go(this.i+(dx<0?1:-1));});
  },
  menu(open){menu.hidden=!open;menuBtn.setAttribute('aria-expanded',open);
    if(open)menuList.querySelectorAll('button').forEach((b,n)=>b.classList.toggle('current',n===this.i));},
  // Opens one panel (photos or videos) and closes the other. Tap again to close.
  tab(name){
    ['photos','videos'].forEach(k=>{
      const p=document.getElementById('panel-'+k),b=page.querySelector('[data-tab="'+k+'"]');
      const open=(k===name)&&p.hidden;
      p.hidden=!open;
      b.setAttribute('aria-expanded',open);
      b.classList.toggle('active',open);
      if(!open)p.querySelectorAll('video').forEach(v=>v.pause()); // stop video when closed
      if(open)p.scrollIntoView({behavior:'smooth',block:'start'});
    });
  },
  go(n){if(n<0||n>=this.chapters.length)return;this.i=n;this.render();window.scrollTo(0,0);},
  render(){
    const c=this.chapters[this.i],last=this.i===this.chapters.length-1;
    const ph=t=>`<div class="ph">${t}</div>`;
    const story=(c.description||'').split('\n').map(p=>`<p>${p}</p>`).join('');
    const photos=(c.photos||[]).map((p,k)=>`<button class="tile" data-photo><img loading="lazy" src="${p}" alt="Chapter ${c.chapter}, photo ${k+1}" onerror="Gallery.fail(this.parentNode,'[YOUR PHOTO HERE]')"></button>`).join('')||ph('[YOUR PHOTO HERE]');
    const videos=(c.videos||[]).map(v=>`<video controls preload="none" playsinline src="${v}" onerror="Gallery.fail(this,'[YOUR VIDEO HERE]')"></video>`).join('')||ph('[YOUR VIDEO HERE]');
    const cover=c.cover?`<button class="frame" data-photo><img src="${c.cover}" alt="Main photo for chapter ${c.chapter}" onerror="Gallery.fail(this.parentNode,'[YOUR PHOTO HERE]')"></button>`:ph('[YOUR PHOTO HERE]');
    const finale=last?`<section class="finale"><h3>ONE YEAR.</h3><p>But this isn't the end of our story.</p><p>There is still so much more to write.</p>
      <button class="btn" id="contBtn">Continue Our Story 💜</button>
      <div id="final" hidden><p class="final-msg">${c.finalMessage||''}</p><svg class="clover big"><use href="#clover"/></svg><div class="hearts" id="hearts"></div></div></section>`:'';
    page.innerHTML=`
      <p class="chap-no">CHAPTER ${c.chapter}</p><h2 class="chap-title">${c.title.toUpperCase()}</h2>
      ${c.subtitle?`<p class="chap-sub">${c.subtitle}</p>`:''}<p class="chap-date">${c.date}</p><div class="divider"></div>
      <div class="main-photo">${cover}</div><div class="story">${story}</div>
      <div class="tabs">
        <button class="btn" data-tab="photos" aria-expanded="false">📷 Photos</button>
        <button class="btn" data-tab="videos" aria-expanded="false">🎬 Videos</button>
      </div>
      <div class="panel" id="panel-photos" hidden><h3 class="sec">Our Memories</h3><div class="gallery">${photos}</div></div>
      <div class="panel" id="panel-videos" hidden><h3 class="sec">Our Memories in Motion</h3><div class="videos">${videos}</div></div>
      ${finale}
      <div class="pagenav">
        ${this.i>0?'<button class="btn" data-nav="-1">← Previous</button>':'<span class="spacer"></span>'}
        <button class="btn" data-nav="menu">Chapters</button>
        ${!last?`<button class="btn" data-nav="1">${this.i===0?'Begin →':'Next →'}</button>`:'<span class="spacer"></span>'}
      </div>`;
    page.classList.remove('turn');void page.offsetWidth;page.classList.add('turn');
    history.replaceState(null,'','#'+c.chapter);
    Music.setTrack(c.music);
    const cb=document.getElementById('contBtn');
    if(cb)cb.onclick=()=>{cb.hidden=true;final.hidden=false;final.scrollIntoView({behavior:'smooth',block:'center'});
      if(!matchMedia('(prefers-reduced-motion:reduce)').matches)for(let k=0;k<14;k++){const s=document.createElement('span');
        s.textContent='♥';s.style.left=Math.random()*100+'%';s.style.animationDuration=(4+Math.random()*4)+'s';s.style.animationDelay=(3+Math.random()*3)+'s';hearts.appendChild(s);}};
  }
};