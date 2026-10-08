/* GALLERY: placeholder fallback + full-screen photo viewer */
const Gallery={
  list:[],idx:0,
  // If an image/video file is missing, show a friendly placeholder instead
  fail(el,text){const d=document.createElement('div');d.className='ph';d.textContent=text;el.replaceWith(d);},
  open(list,i){this.list=list;this.idx=i;this.show();document.getElementById('lightbox').hidden=false;},
  show(){const im=document.getElementById('lbImg');im.src=this.list[this.idx].src;im.alt=this.list[this.idx].alt;},
  step(d){this.idx=(this.idx+d+this.list.length)%this.list.length;this.show();},
  close(){document.getElementById('lightbox').hidden=true;},
  init(){
    const lb=document.getElementById('lightbox');let x0=0;
    lbClose.onclick=()=>this.close();lbPrev.onclick=()=>this.step(-1);lbNext.onclick=()=>this.step(1);
    lb.addEventListener('click',e=>{if(e.target===lb)this.close();});
    lb.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)this.step(dx<0?1:-1);});
    document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')this.close();if(e.key==='ArrowLeft')this.step(-1);if(e.key==='ArrowRight')this.step(1);});
    // Tap any photo (main or gallery) to enlarge
    document.getElementById('page').addEventListener('click',e=>{
      const b=e.target.closest('[data-photo]');if(!b||!b.querySelector('img'))return;
      const imgs=[...document.querySelectorAll('[data-photo] img')];
      this.open(imgs.map(i=>({src:i.src,alt:i.alt})),imgs.indexOf(b.querySelector('img')));
    });
  }
};
