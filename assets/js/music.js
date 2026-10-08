/* MUSIC: ONE song for the whole website. Never autoplays: she taps the button to start it. */

// ✏️ CHANGE THIS to your song's file name (put the file in assets/music/)
const SONG = 'assets/music/song.mp3';

const Music={
  audio:new Audio(),active:false,
  init(){
    this.audio.src=SONG;
    this.audio.loop=true;      // repeats forever
    this.audio.volume=0.6;
    // Tap the main button: start music (or turn it off)
    musicBtn.onclick=()=>{
      this.active=!this.active;
      this.active?this.audio.play().catch(()=>{}):this.audio.pause();
      this.ui();
    };
    // Play / pause (keeps your place in the song)
    pauseBtn.onclick=()=>{this.audio.paused?this.audio.play().catch(()=>{}):this.audio.pause();};
    // Stop (goes back to the start of the song)
    stopBtn.onclick=()=>{this.active=false;this.audio.pause();this.audio.currentTime=0;this.ui();};
    vol.oninput=()=>{this.audio.volume=vol.value;};
    this.audio.onplay=this.audio.onpause=()=>this.ui();
  },
  // The book calls this on every chapter. Nothing to do now: the one song keeps playing without restarting.
  setTrack(){},
  ui(){
    const on=this.active&&!this.audio.paused;
    musicBtn.textContent=on?'🎵 Music On':'🎵 Music Off';
    musicPanel.hidden=!this.active;
  }
};