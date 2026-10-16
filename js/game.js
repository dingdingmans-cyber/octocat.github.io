/** 遗落的屏幕 — 主游戏逻辑 */
(function () {
  'use strict';

  const STORAGE_KEY = 'mystery-game-save-v2';

  let state = {
    loggedIn: false,
    encryptedUnlocked: false,
    phoneUnlocked: false,
    shadowUnlocked: false,
    shadowAppVisible: false,
    selectedMail: null,
    selectedContact: 0,
    mobileShowMailList: true,
    mobileShowChatList: true,
    selectedPhoto: null,
    filePreview: null,
    cameraViewed: false,
    scaresSeen: [],
    shadowAppOpened: false,
    discoveredClues: [],
    endingReached: false,
    prologueSeen: false,
    journalOpened: false,
    missionBriefed: false,
    browserTabs: null,
    activeBrowserUrl: 'about:history',
    visitedUrls: [],
    milestones: [],
    notesOpened: false,
    viewedFiles: [],
    selectedVictim: null,
    caseboardViewedVictims: [],
    cctvCamera: 'b2-west',
    cctvFrame: 0,
    selectedCalDay: null,
  };

  let prologueIndex = 0;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function matchPassword(input, expected) {
    const val = input.trim();
    const list = Array.isArray(expected) ? expected : [expected];
    return list.some(p => p === val || p.toLowerCase() === val.toLowerCase());
  }

  function applyMobileWindowLayout(win) {
    if (!isMobile()) return;
    win.classList.add('window-mobile');
    win.style.width = 'calc(100vw - 16px)';
    win.style.height = 'calc(100dvh - 52px - env(safe-area-inset-bottom, 0px))';
    win.style.left = '8px';
    win.style.top = '8px';
    win.style.maxWidth = 'calc(100vw - 16px)';
    win.style.minWidth = '0';
    win.style.resize = 'none';
  }

  function getDesktopWindowStyle() {
    const left = 80 + windows.length * 30;
    const top = 60 + windows.length * 20;
    return `width:520px;height:400px;left:${left}px;top:${top}px;z-index:${++zIndex}`;
  }

  let windows = [];
  let zIndex = 10;
  let mailReadTimer = null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function save() {
    try {
      const { loggedIn, ...persist } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch (_) {}
  }

  function markClue(id) {
    if (!state.discoveredClues.includes(id)) {
      state.discoveredClues.push(id);
      save();
    }
  }

  function unlockMilestone(id) {
    if (!state.milestones) state.milestones = [];
    if (state.milestones.includes(id)) return;
    state.milestones.push(id);
    const m = GAME_DATA.milestones?.find(x => x.id === id);
    if (m?.notify) notify(m.notify, !!m.creepy);
    save();
    refreshJournalIfOpen();
    checkTaskCompletions();
  }

  function checkTaskCompletions() {
    const { done, total } = getTaskProgress(state);
    if (done === total && !state.allTasksDone) {
      state.allTasksDone = true;
      save();
    }
    refreshJournalIfOpen();
  }

  function refreshJournalIfOpen() {
    const win = windows.find(w => w.appId === 'journal' && !w.minimized);
    if (win) refreshWindow(win.id, 'journal');
  }

  function checkMilestones() {
    if (!state.milestones) state.milestones = [];

    const chenmoMail = GAME_DATA.mail.find(m => m.id === 'mail-2');
    if (chenmoMail?.read) unlockMilestone('read-chenmo-mail');

    if (state.visitedUrls?.includes('https://news.citydaily.cn/local/2024/0315-missing')) {
      unlockMilestone('visit-news');
    }
    if (state.visitedUrls?.includes('file:///shadow-readme.html') ||
        state.visitedUrls?.includes('https://hengrui-tech.com/products/security')) {
      unlockMilestone('visit-shadow-doc');
    }
    if (state.visitedUrls?.includes('https://flights.example.cn/track/CA1832')) {
      unlockMilestone('visit-flight');
    }
    if (state.visitedUrls?.includes('https://news.citydaily.cn/local/2024/serial-missing')) {
      const firstSerial = !state.milestones?.includes('visit-serial');
      unlockMilestone('visit-serial');
      if (firstSerial) {
        unlockMilestone('cctv-unlocked');
        renderDesktopIcons();
        renderStartMenu();
      }
      if (firstSerial) {
        triggerScare(state, 'serial-case', save);
        setTimeout(() => notify('幽影后台：新增观察者记录 #008', true), 2800);
      }
    }
    if (state.viewedFiles?.includes('case-compare')) {
      unlockMilestone('found-pattern');
    }
    checkTaskCompletions();
  }

  function navigateBrowser(win, appId, url) {
    if (url === 'back') {
      const idx = state.browserTabs?.findIndex(t => t.url === state.activeBrowserUrl) ?? -1;
      if (idx > 0) {
        state.activeBrowserUrl = state.browserTabs[idx - 1].url;
      } else {
        state.activeBrowserUrl = 'about:history';
      }
    } else if (url === 'about:history' || WEB_SITES[url]) {
      BrowserEngine.navigate(state, url);
      checkMilestones();
    }
    refreshWindow(win.id, appId);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('mystery-game-save');
      if (raw) Object.assign(state, JSON.parse(raw));
    } catch (_) {}
    state.loggedIn = false;
  }

  function lockScreen() {
    state.loggedIn = false;
    windows.forEach(w => w.el.remove());
    windows = [];
    showScreen('login-screen');
    $('#login-password').value = '';
    $('#login-error').textContent = '';
  }

  function showScreen(id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${id}`)?.classList.add('active');
  }

  const APP_OPEN_SFX = {
    mail: 'mail',
    messages: 'message',
    files: 'folder',
    browser: 'browser',
    journal: 'window_open',
    notes: 'file',
    photos: 'window_open',
    caseboard: 'file',
    calendar: 'window_open',
    cctv: 'window_open',
    trash: 'folder',
    settings: 'window_open',
    shadow: 'error',
  };

  function notify(text, creepy = false) {
    Sfx.play(creepy ? 'notify_creepy' : 'notify');
    const el = document.createElement('div');
    el.className = `notification${creepy ? ' creepy' : ''}`;
    el.textContent = text;
    $('#notifications').appendChild(el);
    setTimeout(() => el.remove(), creepy ? 5000 : 3500);
  }

  function glitchDesktop() {
    const d = $('#desktop');
    if (!d) return;
    d.classList.add('desktop-glitch');
    setTimeout(() => d.classList.remove('desktop-glitch'), 300);
  }

  function scare(id) {
    if (id) triggerScare(state, id, save);
  }

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const str = `${h}:${m}`;
    const timeEl = document.querySelector('#taskbar-clock .clock-time');
    const dateEl = document.querySelector('#taskbar-clock .clock-date');
    if (timeEl) timeEl.textContent = str;
    if (dateEl) {
      dateEl.textContent = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
    }
    const pt = $('#phone-time');
    if (pt) pt.textContent = str;
    const plt = $('#phone-lock-time');
    if (plt) plt.textContent = str;
  }

  /* ===== PRELOAD ===== */
  function updatePreloadUI(loaded, total) {
    const pct = total ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
    const fill = $('#preload-bar-fill');
    const label = $('#preload-label');
    if (fill) fill.style.width = `${pct}%`;
    if (label && !$('#preload-status')?.classList.contains('preload-done')) {
      label.textContent = `正在预加载图片资源… ${pct}%`;
    }
  }

  function setTitleButtonsEnabled(on) {
    const start = $('#title-start-btn');
    const skip = $('#title-skip-btn');
    if (start) {
      start.disabled = !on;
      start.textContent = on ? '开始游戏' : '加载中…';
    }
    if (skip) skip.disabled = !on;
  }

  function initPreload() {
    if (typeof AssetPreloader === 'undefined') {
      setTitleButtonsEnabled(true);
      return;
    }

    setTitleButtonsEnabled(false);

    window.addEventListener('assets-critical-ready', () => {
      setTitleButtonsEnabled(true);
    });

    window.addEventListener('assets-all-ready', () => {
      const label = $('#preload-label');
      if (label) label.textContent = '资源已就绪';
      setTimeout(() => $('#preload-status')?.classList.add('preload-done'), 400);
    });

    AssetPreloader.setProgressHandler(updatePreloadUI);
    if (AssetPreloader.isCriticalReady()) setTitleButtonsEnabled(true);
    if (AssetPreloader.isAllReady()) {
      updatePreloadUI(AssetPreloader.getProgress().loaded, AssetPreloader.getProgress().total);
      $('#preload-status')?.classList.add('preload-done');
    }
    AssetPreloader.start().catch(() => {
      setTitleButtonsEnabled(true);
    });
  }

  /* ===== TITLE & PROLOGUE ===== */
  function initTitle() {
    $('#title-start-btn')?.addEventListener('click', startPrologue);
    $('#title-skip-btn')?.addEventListener('click', () => {
      if (!state.prologueSeen && !confirm('确定跳过剧情？建议先看一遍了解故事背景。')) return;
      state.prologueSeen = true;
      save();
      startBoot();
    });
  }

  function startPrologue() {
    Sfx.resume();
    Sfx.play('prologue_start');
    prologueIndex = 0;
    showScreen('prologue-screen');
    renderProloguePanel(0);
  }

  function initPrologue() {
    const panels = PROLOGUE_DATA.panels;
    const dots = $('#prologue-dots');
    dots.innerHTML = panels.map((_, i) =>
      `<button type="button" class="prologue-dot" data-i="${i}" aria-label="第 ${i + 1} 页"></button>`
    ).join('');

    dots.querySelectorAll('.prologue-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.i, 10);
        if (idx === prologueIndex) return;
        Sfx.play('prologue_page');
        prologueIndex = idx;
        renderProloguePanel(prologueIndex);
      });
    });

    $('#prologue-next')?.addEventListener('click', advancePrologue);
    $('#prologue-prev')?.addEventListener('click', retreatPrologue);
    $('#prologue-skip')?.addEventListener('click', () => {
      if (!confirm('确定跳过剩余剧情？')) return;
      finishPrologue();
    });

    document.addEventListener('keydown', (e) => {
      if (!$('#prologue-screen')?.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        retreatPrologue();
      } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        advancePrologue();
      }
    });
  }

  function updatePrologueNav() {
    const prev = $('#prologue-prev');
    const next = $('#prologue-next');
    const isLast = prologueIndex >= PROLOGUE_DATA.panels.length - 1;

    if (prev) prev.disabled = prologueIndex <= 0;
    if (!next) return;

    next.disabled = false;
    if (isLast) {
      next.textContent = '开始调查 ▶';
      next.classList.add('mission-start');
    } else {
      next.textContent = '下一页 ▶';
      next.classList.remove('mission-start');
    }
  }

  function renderProloguePanel(i) {
    const panel = PROLOGUE_DATA.panels[i];
    const img = $('#prologue-image');
    const wrap = $('#prologue-image-wrap');
    const speaker = $('#prologue-speaker');
    const text = $('#prologue-text');

    $$('.prologue-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));

    if (panel.image) {
      img.src = panel.image;
      img.hidden = false;
      img.classList.remove('visible');
      setTimeout(() => img.classList.add('visible'), 50);
      wrap.className = 'prologue-image-wrap';
      wrap.style.background = '';
    } else {
      img.hidden = true;
      wrap.className = `prologue-image-wrap ${panel.style || ''}-bg`;
      wrap.style.background = panel.bg || '#000';
    }

    speaker.textContent = panel.speaker || '';
    speaker.style.display = panel.speaker ? 'block' : 'none';

    if (panel.style === 'mission-card' && panel.mission) {
      text.className = 'prologue-text';
      text.innerHTML = `
        <div class="mission-card">
          <h3>${panel.mission.title}</h3>
          <ul>${panel.mission.items.map(item => `<li>${item}</li>`).join('')}</ul>
          <p class="mission-hint">💡 ${panel.mission.hint}</p>
        </div>`;
    } else {
      text.className = `prologue-text${panel.style === 'title-card' ? ' title-style' : ''}`;
      text.textContent = panel.text;
    }

    updatePrologueNav();
  }

  function advancePrologue() {
    if (prologueIndex >= PROLOGUE_DATA.panels.length - 1) {
      Sfx.play('button');
      finishPrologue();
      return;
    }
    Sfx.play('prologue_page');
    prologueIndex++;
    renderProloguePanel(prologueIndex);
  }

  function retreatPrologue() {
    if (prologueIndex <= 0) return;
    Sfx.play('prologue_page');
    prologueIndex--;
    renderProloguePanel(prologueIndex);
  }

  function finishPrologue() {
    state.prologueSeen = true;
    save();
    startBoot();
  }

  function startBoot() {
    showScreen('boot-screen');
    $('#boot-fill').style.width = '0%';
    boot();
  }

  /* ===== BOOT ===== */
  function boot() {
    const fill = $('#boot-fill');
    const text = $('#boot-text');
    const steps = [
      { pct: 15, msg: 'Starting Windows...' },
      { pct: 40, msg: '加载系统文件...' },
      { pct: 65, msg: '准备桌面...' },
      { pct: 85, msg: '检测到未正常关机' },
      { pct: 100, msg: '欢迎使用 Windows' },
    ];
    let i = 0;
    const tick = () => {
      if (i >= steps.length) {
        setTimeout(() => {
          if (state.loggedIn) {
            showScreen('desktop');
            initDesktop();
          } else {
            showScreen('login-screen');
          }
        }, 600);
        return;
      }
      fill.style.width = steps[i].pct + '%';
      text.textContent = steps[i].msg;
      Sfx.play('boot');
      if (i === 3) glitchDesktop();
      i++;
      setTimeout(tick, 500 + Math.random() * 400);
    };
    tick();
  }

  /* ===== LOGIN ===== */
  function initLogin() {
    $('#login-package-clue')?.addEventListener('click', () => {
      const hint = $('#login-clue-hint');
      if (hint) {
        hint.hidden = false;
        hint.innerHTML = '翡翠湾物业通知复印件：<br>A 栋 <strong>1024</strong> 室 · 林雨<br><span style="opacity:0.7;font-size:0.85em">（门牌号……难道密码就是这个？）</span>';
      }
    });

    $('#login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const pw = $('#login-password').value.trim();
      const err = $('#login-error');
      if (pw === GAME_DATA.passwords.desktop) {
        Sfx.play('login_success');
        state.loggedIn = true;
        err.textContent = '';
        showScreen('desktop');
        initDesktop();
        checkTaskCompletions();
        if (!state.missionBriefed) {
          state.missionBriefed = true;
          save();
          setTimeout(() => {
            notify('调查开始：打开「调查手记」查看任务清单');
            openApp('journal');
          }, 600);
        }
        setTimeout(() => notify('邮件 — 您有多封未读邮件（含连环案专题推送）', false), 2500);
        setTimeout(() => notify('线索墙、日历 — 林雨留下的调查工具在桌面上', false), 4500);
        setTimeout(() => notify('浏览器 — 历史记录第一条即为连环失踪专题', false), 6500);
      } else {
        Sfx.play('login_fail');
        err.textContent = '密码错误';
        $('#login-password').value = '';
      }
    });
  }

  /* ===== DESKTOP ===== */
  function initDesktop() {
    renderDesktopIcons();
    renderStartMenu();
    updatePhoneDock();
    updateClock();
    setInterval(updateClock, 30000);

    $('#start-btn').onclick = (e) => {
      e.stopPropagation();
      const menu = $('#start-menu');
      const open = menu.hidden;
      menu.hidden = !open;
      $('#start-btn').classList.toggle('start-active', open);
      if (open) Sfx.play('start_menu');
    };

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
        $('#start-menu').hidden = true;
        $('#start-btn').classList.remove('start-active');
      }
    });

    $('#shutdown-btn')?.addEventListener('click', () => {
      $('#start-menu').hidden = true;
      $('#start-btn').classList.remove('start-active');
      notify('正在锁定计算机...');
      setTimeout(lockScreen, 800);
    });

    $('#phone-toggle')?.addEventListener('click', () => {
      Sfx.play('phone_open');
      showScreen('phone-screen');
      initPhone();
    });

    markClue('desktop-login');
    checkTaskCompletions();
  }

  function isAppVisible(app) {
    if (app.id === 'shadow') return !!state.shadowAppVisible;
    if (app.unlockMilestone) {
      return !!(state.milestones && state.milestones.includes(app.unlockMilestone));
    }
    if (app.locked) return false;
    return true;
  }

  function renderDesktopIcons() {
    const container = $('#desktop-icons');
    container.innerHTML = GAME_DATA.desktopApps.map(app => {
      if (!isAppVisible(app)) return '';
      return `
        <div class="desktop-icon" data-app="${app.id}">
          <div class="icon-img">${app.icon}</div>
          <span>${app.name}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.desktop-icon').forEach(el => {
      el.addEventListener('dblclick', () => openApp(el.dataset.app));
      el.addEventListener('click', () => {
        if ('ontouchstart' in window) openApp(el.dataset.app);
      });
    });
  }

  function renderStartMenu() {
    const apps = GAME_DATA.desktopApps.filter(a => isAppVisible(a));
    const html = apps.map(app => `
      <div class="start-menu-app" data-app="${app.id}">
        <span class="start-app-icon">${app.icon}</span>
        <span class="start-app-name">${app.name}</span>
      </div>
    `).join('');
    $('#start-menu-apps').innerHTML = html;
    $('#start-menu-apps').querySelectorAll('.start-menu-app').forEach(el => {
      el.addEventListener('click', () => {
        openApp(el.dataset.app);
        $('#start-menu').hidden = true;
        $('#start-btn').classList.remove('start-active');
      });
    });
  }

  function updatePhoneDock() {
    const dock = $('#phone-dock');
    if (state.encryptedUnlocked) {
      dock.hidden = false;
    }
  }

  /* ===== WINDOWS ===== */
  function openApp(appId) {
    const existing = windows.find(w => w.appId === appId && !w.minimized);
    if (existing) {
      focusWindow(existing.id);
      Sfx.play('click');
      return;
    }

    Sfx.play(APP_OPEN_SFX[appId] || 'window_open');

    if (isMobile()) {
      [...windows].forEach(w => closeWindow(w.id));
      if (appId === 'mail') {
        state.mobileShowMailList = true;
        state.selectedMail = null;
      }
      if (appId === 'messages') {
        state.mobileShowChatList = true;
      }
    }

    const app = GAME_DATA.desktopApps.find(a => a.id === appId);
    const title = app?.name ?? appId;
    const id = 'win-' + Date.now();

    const win = document.createElement('div');
    win.className = 'window focused';
    win.id = id;
    win.style.cssText = getDesktopWindowStyle();
    if ((appId === 'browser' || appId === 'cctv' || appId === 'caseboard') && !isMobile()) {
      win.style.height = appId === 'browser' ? '480px' : '440px';
    }
    applyMobileWindowLayout(win);

    const renderer = AppRenderers[appId];
    const content = renderer ? renderer(state) : '<p>应用无法打开</p>';

    win.innerHTML = `
      <div class="window-header">
        <span class="window-icon">${app?.icon ?? '📄'}</span>
        <span class="window-title">${title}</span>
        <div class="window-controls">
          <button class="window-btn minimize" data-action="minimize" title="最小化"><span>_</span></button>
          <button class="window-btn maximize" data-action="maximize" title="最大化"><span>□</span></button>
          <button class="window-btn close" data-action="close" title="关闭"><span>×</span></button>
        </div>
      </div>
      <div class="window-body" id="${id}-body">${content}</div>
    `;

    $('#window-layer').appendChild(win);
    windows.push({ id, appId, minimized: false, maximized: false, el: win });

    bindWindowEvents(win, appId);
    updateTaskbar();

    if (appId === 'trash') {
      triggerScare(state, 'trash-open', save);
    }
    if (appId === 'shadow' && !state.shadowAppOpened) {
      state.shadowAppOpened = true;
      save();
      triggerScare(state, 'shadow-app-open', save);
    }
    if (appId === 'mail') {
      bindMailEvents(win);
    }
    if (appId === 'browser') {
      BrowserEngine.initState(state);
      if (!state.milestones?.includes('open-browser')) {
        unlockMilestone('open-browser');
      }
    }
    if (appId === 'notes' && !state.notesOpened) {
      state.notesOpened = true;
      save();
      setTimeout(() => unlockMilestone('read-notes-dream'), 800);
    }
    if (appId === 'caseboard' && !state.milestones?.includes('caseboard-opened')) {
      unlockMilestone('caseboard-opened');
    }
  }

  function bindWindowEvents(win, appId) {
    const header = win.querySelector('.window-header');
    let dragging = false, ox, oy;

    if (!isMobile()) {
      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-btn')) return;
        dragging = true;
        focusWindow(win.id);
        ox = e.clientX - win.offsetLeft;
        oy = e.clientY - win.offsetTop;
      });
      document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        win.style.left = (e.clientX - ox) + 'px';
        win.style.top = (e.clientY - oy) + 'px';
      });
      document.addEventListener('mouseup', () => { dragging = false; });
    }

    win.addEventListener('mousedown', () => focusWindow(win.id));

    win.querySelector('[data-action="close"]').onclick = () => closeWindow(win.id);
    win.querySelector('[data-action="minimize"]').onclick = () => minimizeWindow(win.id);
    win.querySelector('[data-action="maximize"]').onclick = () => toggleMaximize(win.id);

    bindAppEvents(win, appId);
  }

  function bindAppEvents(win, appId) {
    const body = win.querySelector('.window-body');

    body.addEventListener('click', (e) => {
      const photoId = e.target.closest('[data-photo-id]')?.dataset.photoId;
      if (photoId) {
        state.selectedPhoto = photoId;
        refreshWindow(win.id, appId);
        if (photoId === 'photo-3') {
          if (!state.discoveredClues.includes('photo-creepy')) {
            state.discoveredClues.push('photo-creepy');
            save();
          }
          triggerScare(state, 'photo-parking', save);
          setTimeout(() => notify('照片拍摄于凌晨 03:17', true), 1200);
        }
        if (photoId === 'photo-4') {
          triggerScare(state, 'photo-mirror', save);
        }
        return;
      }

      if (e.target.closest('[data-action="photo-back"]')) {
        state.selectedPhoto = null;
        refreshWindow(win.id, appId);
        return;
      }

      const fileEl = e.target.closest('[data-file-content]');
      if (fileEl) {
        Sfx.play('file');
        state.filePreview = decodeURIComponent(fileEl.dataset.fileContent);
        const fileId = fileEl.dataset.fileId;
        if (fileId) {
          if (!state.viewedFiles) state.viewedFiles = [];
          if (!state.viewedFiles.includes(fileId)) {
            state.viewedFiles.push(fileId);
            save();
            checkMilestones();
          }
        }
        refreshWindow(win.id, appId);
        return;
      }

      if (e.target.closest('[data-action="file-back"]')) {
        state.filePreview = null;
        refreshWindow(win.id, appId);
        return;
      }

      if (e.target.closest('[data-action="mail-back"]')) {
        state.mobileShowMailList = true;
        refreshWindow(win.id, appId);
        return;
      }

      if (e.target.closest('[data-action="chat-back"]')) {
        state.mobileShowChatList = true;
        refreshWindow(win.id, appId);
        return;
      }

      if (appId === 'browser') {
        const closeTab = e.target.closest('[data-browser-close]');
        if (closeTab) {
          e.preventDefault();
          e.stopPropagation();
          BrowserEngine.closeTab(state, closeTab.dataset.browserClose);
          refreshWindow(win.id, appId);
          return;
        }

        const tabBtn = e.target.closest('[data-browser-tab]');
        if (tabBtn && !e.target.closest('[data-browser-close]')) {
          e.preventDefault();
          state.activeBrowserUrl = tabBtn.dataset.browserTab;
          refreshWindow(win.id, appId);
          return;
        }

        const navGo = e.target.closest('[data-browser-go]');
        if (navGo) {
          e.preventDefault();
          navigateBrowser(win, appId, navGo.dataset.browserGo);
          return;
        }

        if (e.target.closest('[data-browser-refresh]')) {
          refreshWindow(win.id, appId);
          return;
        }

        const urlLink = e.target.closest('[data-browser-url]');
        if (urlLink) {
          e.preventDefault();
          Sfx.play('browser');
          navigateBrowser(win, appId, urlLink.dataset.browserUrl);
          return;
        }
      }

      const victimId = e.target.closest('[data-caseboard-victim]')?.dataset.caseboardVictim;
      if (victimId && appId === 'caseboard') {
        state.selectedVictim = victimId;
        if (!state.caseboardViewedVictims) state.caseboardViewedVictims = [];
        if (!state.caseboardViewedVictims.includes(victimId)) {
          state.caseboardViewedVictims.push(victimId);
          save();
          if (state.caseboardViewedVictims.length >= 4) {
            unlockMilestone('caseboard-all-victims');
            triggerScare(state, 'caseboard-complete', save);
          }
        }
        refreshWindow(win.id, appId);
        return;
      }

      const calDay = e.target.closest('[data-cal-day]')?.dataset.calDay;
      if (calDay && appId === 'calendar') {
        state.selectedCalDay = parseInt(calDay, 10);
        refreshWindow(win.id, appId);
        return;
      }

      if (appId === 'cctv') {
        const camBtn = e.target.closest('[data-cctv-camera]');
        if (camBtn) {
          state.cctvCamera = camBtn.dataset.cctvCamera;
          state.cctvFrame = 0;
          refreshWindow(win.id, appId);
          return;
        }
        const cctvAction = e.target.closest('[data-cctv-action]')?.dataset.cctvAction;
        if (cctvAction) {
          const cam = GAME_DATA.cctv.cameras.find(c => c.id === (state.cctvCamera || 'b2-west'));
          const max = (cam?.frames.length || 1) - 1;
          if (cctvAction === 'next' || cctvAction === 'play') {
            state.cctvFrame = Math.min((state.cctvFrame ?? 0) + 1, max);
            const frame = cam.frames[state.cctvFrame];
            if (frame?.creepy && !state.milestones?.includes('cctv-glitch-seen')) {
              unlockMilestone('cctv-glitch-seen');
              triggerScare(state, 'cctv-face', save);
            }
          } else if (cctvAction === 'pause') {
            /* keep frame */
          }
          refreshWindow(win.id, appId);
          return;
        }
      }

      const contactIdx = e.target.closest('[data-contact]')?.dataset.contact;
      if (contactIdx !== undefined && appId === 'messages') {
        Sfx.play('message');
        state.selectedContact = parseInt(contactIdx, 10);
        if (isMobile()) state.mobileShowChatList = false;
        refreshWindow(win.id, appId);
      }
    });

    const folderBtn = body.querySelector('#folder-unlock-btn');
    if (folderBtn) {
      folderBtn.onclick = () => {
        const pw = body.querySelector('#folder-password').value.trim().toLowerCase();
        const err = body.querySelector('#folder-error');
        if (pw === GAME_DATA.passwords.encryptedFolder.toLowerCase()) {
          Sfx.play('folder_unlock');
          state.encryptedUnlocked = true;
          save();
          refreshWindow(win.id, appId);
          updatePhoneDock();
          markClue('encrypted');
          notify('私密文件夹已解锁');
          notify('检测到已连接的手机设备');
          checkTaskCompletions();
        } else {
          Sfx.play('error');
          err.textContent = '密码错误';
        }
      };
    }

    const shadowBtn = body.querySelector('#shadow-unlock-btn');
    if (shadowBtn) {
      shadowBtn.onclick = () => {
        const pw = body.querySelector('#shadow-password').value.trim();
        const err = body.querySelector('#shadow-error');
        if (matchPassword(pw, GAME_DATA.passwords.shadowApp)) {
          state.shadowUnlocked = true;
          markClue('shadow');
          save();
          checkTaskCompletions();
          refreshWindow(win.id, appId);
          setTimeout(() => triggerEnding(), 4000);
        } else {
          err.textContent = '拒绝访问';
          triggerScare(state, 'shadow-denied', save);
        }
      };
    }
  }

  function bindMailEvents(win) {
    const body = win.querySelector('.window-body');
    body.querySelectorAll('[data-mail-id]').forEach(el => {
      el.addEventListener('click', () => {
        const mailId = el.dataset.mailId;
        state.selectedMail = mailId;
        if (isMobile()) state.mobileShowMailList = false;
        const mail = GAME_DATA.mail.find(m => m.id === mailId);
        if (mail) {
          Sfx.play('mail');
          if (!mail.read) {
            mail.read = true;
            if (mail.creepy) {
              triggerScare(state, 'mail-unknown', save);
              setTimeout(() => notify('未知发件人', true), 900);
            } else {
              Sfx.play('mail_arrive');
            }
            checkMilestones();
          }
        }
        refreshWindow(win.id, 'mail');
      });
    });
  }

  function refreshWindow(winId, appId) {
    const w = windows.find(w => w.id === winId);
    if (!w) return;
    const renderer = AppRenderers[appId];
    if (renderer) {
      w.el.querySelector('.window-body').innerHTML = renderer(state);
      bindAppEvents(w.el, appId);
      if (appId === 'mail') bindMailEvents(w.el);
      if (appId === 'browser') BrowserEngine.initState(state);
      if (appId === 'shadow' && state.shadowUnlocked) {
        revealShadowApp();
      }
    }
  }

  function revealShadowApp() {
    if (!state.shadowAppVisible) {
      state.shadowAppVisible = true;
      renderDesktopIcons();
      renderStartMenu();
      save();
    }
  }

  function focusWindow(winId) {
    windows.forEach(w => {
      w.el.classList.toggle('focused', w.id === winId);
      if (w.id === winId) w.el.style.zIndex = ++zIndex;
    });
    updateTaskbar();
  }

  function closeWindow(winId) {
    const idx = windows.findIndex(w => w.id === winId);
    if (idx === -1) return;
    Sfx.play('window_close');
    windows[idx].el.remove();
    windows.splice(idx, 1);
    updateTaskbar();
  }

  function minimizeWindow(winId) {
    const w = windows.find(w => w.id === winId);
    if (!w) return;
    w.minimized = !w.minimized;
    w.el.style.display = w.minimized ? 'none' : 'flex';
    updateTaskbar();
  }

  function toggleMaximize(winId) {
    if (isMobile()) return;
    const w = windows.find(w => w.id === winId);
    if (!w) return;
    w.maximized = !w.maximized;
    if (w.maximized) {
      w.prevStyle = w.el.style.cssText;
      w.el.style.cssText = 'left:0!important;top:0!important;width:100%!important;height:calc(100% - 0px)!important;max-width:none!important;resize:none!important;z-index:' + (++zIndex);
      w.el.classList.add('maximized');
    } else {
      w.el.style.cssText = w.prevStyle || getDesktopWindowStyle();
      w.el.classList.remove('maximized');
    }
    focusWindow(winId);
  }

  function updateTaskbar() {
    const bar = $('#taskbar-apps');
    bar.innerHTML = windows.map(w => {
      const app = GAME_DATA.desktopApps.find(a => a.id === w.appId);
      const active = w.el.classList.contains('focused') && !w.minimized ? 'active' : '';
      return `<button type="button" class="taskbar-app ${active}" data-win="${w.id}">
        <span class="tb-icon">${app?.icon ?? '📄'}</span>
        <span class="tb-label">${app?.name ?? w.appId}</span>
      </button>`;
    }).join('');
    bar.querySelectorAll('.taskbar-app').forEach(el => {
      el.onclick = () => {
        const w = windows.find(w => w.id === el.dataset.win);
        if (w.minimized) {
          w.minimized = false;
          w.el.style.display = 'flex';
        }
        focusWindow(w.id);
      };
    });
  }

  /* ===== PHONE (iOS) ===== */
  let phoneKeypadBuilt = false;

  function buildIosKeypad() {
    if (phoneKeypadBuilt) return;
    const keypad = $('#ios-keypad');
    if (!keypad) return;
    const keys = [
      { n: '1', sub: '' }, { n: '2', sub: 'ABC' }, { n: '3', sub: 'DEF' },
      { n: '4', sub: 'GHI' }, { n: '5', sub: 'JKL' }, { n: '6', sub: 'MNO' },
      { n: '7', sub: 'PQRS' }, { n: '8', sub: 'TUV' }, { n: '9', sub: 'WXYZ' },
      { n: '', sub: '', cls: 'key-empty' }, { n: '0', sub: '' }, { n: '⌫', sub: '', cls: 'key-delete' },
    ];
    keypad.innerHTML = keys.map(k =>
      `<button type="button" class="ios-key ${k.cls || ''}" data-key="${k.n}">${k.n}${k.sub ? `<small>${k.sub}</small>` : ''}</button>`
    ).join('');
    keypad.querySelectorAll('.ios-key').forEach(btn => {
      btn.addEventListener('click', () => handleIosKey(btn.dataset.key));
    });
    phoneKeypadBuilt = true;
  }

  function updatePasscodeDots() {
    const input = $('#phone-password');
    const dots = $('#ios-passcode-dots');
    if (!input || !dots) return;
    const len = input.value.length;
    dots.querySelectorAll('span').forEach((dot, i) => {
      dot.classList.toggle('filled', i < len);
    });
  }

  function handleIosKey(key) {
    const input = $('#phone-password');
    const err = $('#phone-lock-error');
    if (!input || state.phoneUnlocked) return;

    if (key === '⌫') {
      Sfx.play('phone_key');
      input.value = input.value.slice(0, -1);
      updatePasscodeDots();
      if (err) err.textContent = '';
      return;
    }
    if (!key || input.value.length >= 4) return;

    Sfx.play('phone_key');
    input.value += key;
    updatePasscodeDots();
    if (err) err.textContent = '';

    if (input.value.length === 4) {
      setTimeout(() => tryPhoneUnlock(), 150);
    }
  }

  function tryPhoneUnlock() {
    const input = $('#phone-password');
    const err = $('#phone-lock-error');
    const dots = $('#ios-passcode-dots');
    const pw = input?.value.trim() || '';

    if (pw === GAME_DATA.passwords.phone) {
      Sfx.play('phone_unlock');
      state.phoneUnlocked = true;
      markClue('phone');
      save();
      const lock = $('#phone-lock');
      lock?.classList.add('ios-unlock-anim');
      setTimeout(() => {
        lock.hidden = true;
        lock.classList.remove('ios-unlock-anim');
        $('#phone-home').hidden = false;
        renderPhoneApps();
        notify('iPhone 已解锁');
        checkTaskCompletions();
      }, 400);
    } else {
      Sfx.play('phone_fail');
      if (err) err.textContent = '密码错误，请重试';
      dots?.classList.add('shake');
      setTimeout(() => {
        dots?.classList.remove('shake');
        if (input) input.value = '';
        updatePasscodeDots();
      }, 450);
    }
  }

  function showPhoneScreen() {
    if (state.phoneUnlocked) {
      $('#phone-lock').hidden = true;
      $('#phone-home').hidden = false;
      $('#phone-app-view').hidden = true;
      renderPhoneApps();
    } else {
      $('#phone-lock').hidden = false;
      $('#phone-home').hidden = true;
      $('#phone-app-view').hidden = true;
      const input = $('#phone-password');
      if (input) input.value = '';
      updatePasscodeDots();
      $('#phone-lock-error').textContent = '';
    }
  }

  function initPhone() {
    buildIosKeypad();
    showPhoneScreen();

    $('#phone-back-desktop').onclick = () => {
      Sfx.play('phone_close');
      showScreen('desktop');
    };
  }

  function renderPhoneIcon(app) {
    return `
      <div class="ios-app-icon" data-phone-app="${app.id}">
        <div class="ios-app-squircle" style="background:${app.iosBg}">${app.icon}</div>
        <span class="ios-app-name">${app.name}</span>
      </div>`;
  }

  function renderPhoneApps() {
    const apps = GAME_DATA.phoneApps;
    const grid = $('#phone-apps');
    const dock = $('#phone-dock-apps');
    if (!grid) return;

    grid.innerHTML = apps.map(renderPhoneIcon).join('');
    if (dock) dock.innerHTML = apps.map(renderPhoneIcon).join('');

    const bind = (container) => {
      container?.querySelectorAll('.ios-app-icon').forEach(el => {
        el.addEventListener('click', () => openPhoneApp(el.dataset.phoneApp));
      });
    };
    bind(grid);
    bind(dock);
  }

  function openPhoneApp(appId) {
    const PHONE_SFX = {
      'phone-messages': 'message',
      'phone-community': 'message_in',
      'phone-voice': 'file',
      'phone-gallery': 'window_open',
      'phone-camera': 'window_open',
      'phone-map': 'browser',
    };
    Sfx.play(PHONE_SFX[appId] || 'click');

    const view = $('#phone-app-view');
    const home = $('#phone-home');
    const content = $('#phone-app-content');
    const title = $('#phone-app-title');
    const renderer = AppRenderers[appId];
    const app = GAME_DATA.phoneApps.find(a => a.id === appId);
    if (!renderer || !view || !content) return;

    home.hidden = true;
    view.hidden = false;
    if (title) title.textContent = app?.name || '应用';
    content.innerHTML = renderer(state);

    $('#phone-app-back').onclick = () => {
      view.hidden = true;
      home.hidden = false;
    };

    if (appId === 'phone-gallery') {
      content.querySelectorAll('[data-photo-id]').forEach(el => {
        el.addEventListener('click', () => {
          const p = GAME_DATA.photos.find(ph => ph.id === el.dataset.photoId);
          if (!p) return;
          if (p.id === 'photo-3') triggerScare(state, 'photo-parking', save);
          if (p.id === 'photo-4') triggerScare(state, 'photo-mirror', save);
          content.innerHTML = `
            <div class="photo-view">
              <img class="photo-large" src="${p.src}" alt="${p.title}" style="width:100%;border-radius:8px">
              <p class="photo-caption" style="margin-top:0.5rem;font-size:0.85rem">${p.caption}</p>
              <p class="photo-date-meta" style="font-size:0.75rem;color:#888">${p.date}</p>
            </div>`;
        });
      });
    }

    if (appId === 'phone-camera' && !state.cameraViewed) {
      content.addEventListener('click', () => {
        if (!state.cameraViewed) {
          state.cameraViewed = true;
          triggerScare(state, 'phone-camera', save);
          save();
          setTimeout(() => {
            content.innerHTML = '<p style="text-align:center;padding:3rem 1rem;color:#c00;font-size:0.95rem">相机画面：一张模糊的脸正对着镜头</p>';
          }, 500);
        }
      });
    }

    if (appId === 'phone-voice' && state.phoneUnlocked && !state.shadowAppVisible) {
      state.shadowAppVisible = true;
      renderDesktopIcons();
      renderStartMenu();
      save();
      notify('电脑上出现了一个未知应用', true);
    }
  }

  /* ===== ENDING ===== */
  function playEndingBloodSound() {
    Sfx.play('ending_blood');
  }

  function playEndingSequence() {
    const screen = $('#ending-screen');
    const bloodFx = $('#ending-blood-fx');
    const content = $('#ending-content');
    const restartBtn = $('#restart-btn');
    const ending = GAME_DATA.endings.truth;

    content.innerHTML = `<h2>${ending.title}</h2><div>${ending.text}</div>`;
    content.classList.remove('visible');
    restartBtn.hidden = true;
    restartBtn.classList.remove('visible');
    screen.classList.remove('ending-shake', 'ending-flooded');
    bloodFx.classList.remove('active', 'flooded');

    showScreen('ending-screen');

    // 阶段1：剧烈抖动（黑屏）
    screen.classList.add('ending-shake');

    setTimeout(() => {
      // 阶段2：血液外涌
      screen.classList.remove('ending-shake');
      bloodFx.classList.add('active');
      playEndingBloodSound();
    }, 1600);

    setTimeout(() => {
      // 阶段3：血幕全覆盖
      bloodFx.classList.add('flooded');
      screen.classList.add('ending-flooded');
    }, 4000);

    setTimeout(() => {
      // 阶段4：在血红环境中显示真相
      content.classList.add('visible');
      restartBtn.hidden = false;
      restartBtn.classList.add('visible');
    }, 5200);
  }

  function triggerEnding() {
    if (state.endingReached) return;
    state.endingReached = true;
    save();

    setTimeout(() => {
      triggerScare(state, 'ending', save);
      setTimeout(playEndingSequence, 850);
    }, 2000);
  }

  function initRestart() {
    $('#restart-btn').onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('mystery-game-save');
      location.reload();
    };
    // restart also resets to title on reload via cleared storage
  }

  /* ===== INIT ===== */
  function init() {
    load();
    if (isMobile()) {
      state.mobileShowMailList = true;
      state.mobileShowChatList = true;
    } else {
      state.mobileShowMailList = false;
      state.mobileShowChatList = false;
    }
    initPreload();
    initTitle();
    initPrologue();
    initLogin();
    initRestart();
    buildIosKeypad();
    window.addEventListener('resize', () => {
      windows.forEach(w => applyMobileWindowLayout(w.el));
      document.body.classList.toggle('is-mobile', isMobile());
    });
    document.body.classList.toggle('is-mobile', isMobile());
    Sfx.bindUI();
    const unlockAudio = () => Sfx.resume();
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
