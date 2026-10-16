/** 剧情触发的突脸惊吓（非定时） */
const SCARE_EVENTS = {
  'trash-open':       { duration: 600, img: 'assets/scare/jumpscare-face.png', delay: 1800 },
  'mail-unknown':     { duration: 650, img: 'assets/scare/jumpscare-face.png', delay: 500 },
  'photo-parking':    { duration: 700, img: 'assets/scare/jumpscare-face.png', delay: 400 },
  'photo-mirror':     { duration: 650, img: 'assets/scare/jumpscare-face.png', delay: 500 },
  'serial-case':      { duration: 600, img: 'assets/scare/jumpscare-face.png', delay: 600 },
  'cctv-face':        { duration: 750, img: 'assets/scare/jumpscare-face.png', delay: 200 },
  'caseboard-complete': { duration: 650, img: 'assets/scare/jumpscare-face.png', delay: 350 },
  'shadow-app-open':  { duration: 700, img: 'assets/scare/jumpscare-face.png', delay: 1200 },
  'shadow-denied':    { duration: 550, img: 'assets/scare/jumpscare-face.png', delay: 0 },
  'phone-camera':     { duration: 650, img: 'assets/scare/jumpscare-face.png', delay: 0 },
  'ending':           { duration: 800, img: 'assets/scare/jumpscare-face.png', delay: 0 },
};

function playScareSound() {
  const ctx = Sfx.resume();
  if (!ctx) return;

  const t = ctx.currentTime;

  // 低频撞击
  const thud = ctx.createOscillator();
  thud.type = 'sine';
  thud.frequency.setValueAtTime(95, t);
  thud.frequency.exponentialRampToValueAtTime(28, t + 0.22);
  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0.85, t);
  thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  const master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(ctx.destination);
  thud.connect(thudGain);
  thudGain.connect(master);
  thud.start(t);
  thud.stop(t + 0.3);

  // 高频刺耳瞬态
  const scream = ctx.createOscillator();
  scream.type = 'sawtooth';
  scream.frequency.setValueAtTime(920, t);
  scream.frequency.exponentialRampToValueAtTime(180, t + 0.12);
  const screamGain = ctx.createGain();
  screamGain.gain.setValueAtTime(0.12, t);
  screamGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  scream.connect(screamGain);
  screamGain.connect(master);
  scream.start(t);
  scream.stop(t + 0.2);

  const len = Math.floor(ctx.sampleRate * 0.18);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.35, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  noise.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(t);
}

function showScareVisual(cfg) {
  const overlay = document.getElementById('scare-overlay');
  const imgEl = document.getElementById('scare-face-img');
  const emojiEl = document.getElementById('scare-face');
  if (!overlay) return;

  if (cfg?.img && imgEl) {
    imgEl.src = cfg.img;
    imgEl.hidden = false;
    if (emojiEl) emojiEl.hidden = true;
  } else if (emojiEl) {
    emojiEl.hidden = false;
    emojiEl.textContent = cfg?.emoji || '👁️';
    if (imgEl) imgEl.hidden = true;
  }

  overlay.hidden = false;
  overlay.classList.remove('scare-active');
  void overlay.offsetWidth;
  overlay.classList.add('scare-active');

  const dur = cfg?.duration || 550;
  setTimeout(() => {
    overlay.hidden = true;
    overlay.classList.remove('scare-active');
  }, dur);
}

/**
 * 触发剧情惊吓（每种 id 仅一次）
 * @returns {boolean} 是否实际触发
 */
function triggerScare(state, id, onSave) {
  if (!SCARE_EVENTS[id]) return false;
  if (!state.scaresSeen) state.scaresSeen = [];
  if (state.scaresSeen.includes(id)) return false;

  state.scaresSeen.push(id);
  if (onSave) onSave();

  const cfg = SCARE_EVENTS[id];
  const run = () => {
    playScareSound();
    showScareVisual(cfg);
  };

  if (cfg.delay > 0) {
    setTimeout(run, cfg.delay);
  } else {
    run();
  }
  return true;
}
