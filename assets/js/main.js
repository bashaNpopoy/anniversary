/* MAIN: starts everything */
// Floating sparkles / hearts / clovers in the background (lightweight: 16 elements)
(function(){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const box=document.getElementById('particles'),sym=['✦','♥','🍀','·','✧'];
  for(let k=0;k<16;k++){const s=document.createElement('span');s.textContent=sym[k%sym.length];
    s.style.left=Math.random()*100+'%';s.style.fontSize=(10+Math.random()*14)+'px';
    s.style.animationDuration=(9+Math.random()*10)+'s';s.style.animationDelay=(-Math.random()*15)+'s';box.appendChild(s);}
})();
Gallery.init();Music.init();
Book.load().then(()=>{
  openBtn.onclick=()=>{
    cover.classList.add('opening');
    setTimeout(()=>{cover.hidden=true;book.hidden=false;
      const n=parseInt(location.hash.slice(1));Book.go(isNaN(n)?0:Math.min(n,12));},800);
  };
}).catch(()=>{openBtn.onclick=()=>alert('Could not load chapters.json. Open the site through XAMPP or GitHub Pages, not by double-clicking index.html.');});
