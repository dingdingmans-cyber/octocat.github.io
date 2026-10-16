/** 游戏 UI 音效 — Web Audio 合成 */
const Sfx = (function () {
  let ctx = null;
  let master = null;
  let enabled = true;

  function ensureContext() {
    if (ctx) return ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    return ctx;
  }

  function resume() {
    const c = ensureContext();
    if (c && c.state === 'suspended') c.resume();
    return c;
  }

  function setEnabled(on) {
    enabled = on;
    if (master) master.gain.value = on ? 0.55 : 0;
  }

  function tone(freq, type, start, dur, vol, dest) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g);
    g.connect(dest || master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  function noiseBurst(start, dur, vol, filterFreq) {
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = filterFreq || 1200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(master);
    src.start(start);
    src.stop(start + dur + 0.02);
  }

  const SOUNDS = {
    /** 通用按钮点击 */
    click() {
      const t = ctx.currentTime;
      tone(880, 'sine', t, 0.06, 0.12);
      tone(1320, 'sine', t + 0.01, 0.04, 0.06);
    },

    /** 主要操作按钮 */
    button() {
      const t = ctx.currentTime;
      tone(620, 'triangle', t, 0.1, 0.18);
      tone(930, 'sine', t + 0.02, 0.08, 0.1);
    },

    /** 剧情翻页 */
    prologue_page() {
      const t = ctx.currentTime;
      noiseBurst(t, 0.12, 0.08, 800);
      tone(340, 'sine', t + 0.04, 0.25, 0.06);
    },

    /** 开场标题 */
    prologue_start() {
      const t = ctx.currentTime;
      tone(220, 'sine', t, 0.5, 0.15);
      tone(330, 'sine', t + 0.08, 0.6, 0.1);
      noiseBurst(t + 0.1, 0.4, 0.04, 400);
    },

    /** 开机 */
    boot() {
      const t = ctx.currentTime;
      tone(440, 'square', t, 0.05, 0.04);
      tone(660, 'square', t + 0.06, 0.05, 0.03);
    },

    /** 登录成功 */
    login_success() {
      const t = ctx.currentTime;
      [523, 659, 784].forEach((f, i) => tone(f, 'sine', t + i * 0.1, 0.2, 0.14));
    },

    /** 登录失败 */
    login_fail() {
      const t = ctx.currentTime;
      tone(180, 'sawtooth', t, 0.2, 0.1);
      tone(140, 'sawtooth', t + 0.12, 0.25, 0.08);
    },

    /** 打开应用窗口 */
    window_open() {
      const t = ctx.currentTime;
      tone(400, 'sine', t, 0.08, 0.1);
      tone(800, 'sine', t + 0.03, 0.1, 0.08);
      noiseBurst(t, 0.06, 0.04, 2000);
    },

    /** 关闭窗口 */
    window_close() {
      const t = ctx.currentTime;
      tone(700, 'sine', t, 0.06, 0.08);
      tone(350, 'sine', t + 0.04, 0.1, 0.1);
    },

    /** 邮件 */
    mail() {
      const t = ctx.currentTime;
      tone(880, 'sine', t, 0.15, 0.12);
      tone(1100, 'sine', t + 0.08, 0.2, 0.1);
      noiseBurst(t + 0.05, 0.1, 0.05, 1500);
    },

    /** 新邮件到达 */
    mail_arrive() {
      const t = ctx.currentTime;
      tone(784, 'sine', t, 0.12, 0.14);
      tone(988, 'sine', t + 0.1, 0.15, 0.12);
      tone(1175, 'sine', t + 0.2, 0.18, 0.1);
    },

    /** 讯息 / iMessage */
    message() {
      const t = ctx.currentTime;
      tone(740, 'sine', t, 0.08, 0.14);
      tone(980, 'sine', t + 0.07, 0.12, 0.12);
    },

    /** 收到新消息 */
    message_in() {
      const t = ctx.currentTime;
      tone(600, 'sine', t, 0.06, 0.1);
      tone(900, 'sine', t + 0.05, 0.08, 0.12);
      tone(1200, 'sine', t + 0.1, 0.1, 0.08);
    },

    /** 打开文件夹 */
    folder() {
      const t = ctx.currentTime;
      noiseBurst(t, 0.08, 0.1, 600);
      tone(280, 'triangle', t + 0.02, 0.12, 0.12);
      tone(420, 'sine', t + 0.05, 0.1, 0.08);
    },

    /** 打开文件 */
    file() {
      const t = ctx.currentTime;
      noiseBurst(t, 0.06, 0.07, 900);
      tone(500, 'sine', t + 0.02, 0.08, 0.1);
    },

    /** 文件夹解锁成功 */
    folder_unlock() {
      const t = ctx.currentTime;
      tone(440, 'sine', t, 0.15, 0.12);
      tone(554, 'sine', t + 0.1, 0.15, 0.12);
      tone(659, 'sine', t + 0.2, 0.2, 0.1);
    },

    /** 打开手机 */
    phone_open() {
      const t = ctx.currentTime;
      tone(520, 'sine', t, 0.1, 0.1);
      tone(1040, 'sine', t + 0.08, 0.15, 0.12);
      noiseBurst(t + 0.05, 0.12, 0.06, 3000);
    },

    /** 手机返回桌面 */
    phone_close() {
      const t = ctx.currentTime;
      tone(900, 'sine', t, 0.08, 0.08);
      tone(600, 'sine', t + 0.05, 0.1, 0.1);
    },

    /** 手机拨号键 */
    phone_key() {
      const t = ctx.currentTime;
      tone(700 + Math.random() * 200, 'sine', t, 0.05, 0.1);
    },

    /** 手机解锁成功 */
    phone_unlock() {
      const t = ctx.currentTime;
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', t + i * 0.07, 0.15, 0.1));
    },

    /** 手机解锁失败 */
    phone_fail() {
      const t = ctx.currentTime;
      tone(200, 'square', t, 0.1, 0.08);
      tone(160, 'square', t + 0.08, 0.15, 0.06);
    },

    /** 系统通知 */
    notify() {
      const t = ctx.currentTime;
      tone(660, 'sine', t, 0.1, 0.1);
      tone(880, 'sine', t + 0.12, 0.12, 0.08);
    },

    /** 恐怖通知 */
    notify_creepy() {
      const t = ctx.currentTime;
      tone(110, 'sawtooth', t, 0.3, 0.08);
      tone(220, 'sine', t + 0.1, 0.4, 0.06);
    },

    /** 开始菜单 */
    start_menu() {
      const t = ctx.currentTime;
      tone(350, 'sine', t, 0.06, 0.1);
      tone(500, 'sine', t + 0.03, 0.08, 0.08);
    },

    /** 浏览器导航 */
    browser() {
      const t = ctx.currentTime;
      noiseBurst(t, 0.05, 0.05, 2500);
      tone(600, 'sine', t + 0.02, 0.08, 0.08);
    },

    /** 错误 / 拒绝 */
    error() {
      const t = ctx.currentTime;
      tone(150, 'sawtooth', t, 0.2, 0.1);
    },

    /** 结局血涌 */
    ending_blood() {
      const t = ctx.currentTime;
      tone(55, 'sawtooth', t, 2.5, 0.15);
      noiseBurst(t, 2.8, 0.12, 200);
    },
  };

  function play(name) {
    if (!enabled) return;
    if (!resume()) return;
    const fn = SOUNDS[name];
    if (fn) fn();
  }

  /** 绑定通用按钮音效（不覆盖已单独处理的区域） */
  function bindUI() {
    const SELECTOR = [
      'button:not([disabled]):not(.ios-key)',
      '.title-start',
      '.title-skip',
      '.prologue-next',
      '.prologue-prev',
      '.prologue-dot',
      '.prologue-skip',
      '.ending-restart',
      '.login-package-clue',
      '.btn-win7',
      '.window-btn',
      '.taskbar-app',
      '.cctv-btn',
      '.cctv-cam-tab',
      '.caseboard-card',
      '.cal-day:not([disabled])',
      '.browser-tab-btn',
      '.browser-nav-btn',
      '.photo-thumb',
      '.ios-app-nav-back',
      '#phone-app-back',
    ].join(',');

    document.addEventListener('click', (e) => {
      if (!enabled) return;
      const el = e.target.closest(SELECTOR);
      if (!el || el.disabled) return;
      if (el.classList.contains('window-btn')) {
        const action = el.dataset.action;
        if (action === 'close') play('window_close');
        else play('click');
        return;
      }
      if (el.classList.contains('prologue-next') || el.classList.contains('prologue-prev') || el.classList.contains('prologue-dot')) {
        return; // 由剧情逻辑单独播放 prologue_page
      }
      if (el.classList.contains('title-start')) return;
      if (el.classList.contains('btn-win7') || el.classList.contains('title-skip') || el.classList.contains('prologue-skip')) {
        play('button');
        return;
      }
      play('click');
    }, false);
  }

  return { play, resume, ensureContext, setEnabled, bindUI, getContext: ensureContext };
})();

/** 供 scare.js 共用音频上下文 */
function initScareAudio() {
  return Sfx.ensureContext();
}
