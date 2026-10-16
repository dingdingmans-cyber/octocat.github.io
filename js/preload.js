/** 图片资源预加载 — 打开页面时后台下载，减少游玩中等待 */
const AssetPreloader = (function () {
  const cache = new Map();
  let total = 0;
  let loaded = 0;
  let criticalDone = false;
  let allDone = false;
  let onProgress = null;
  let startPromise = null;

  function notifyProgress() {
    onProgress?.(loaded, total);
  }

  function collectUrls() {
    const urls = new Set();

    if (typeof PROLOGUE_DATA !== 'undefined') {
      PROLOGUE_DATA.panels.forEach((p) => { if (p.image) urls.add(p.image); });
    }
    if (typeof GAME_DATA !== 'undefined') {
      GAME_DATA.photos?.forEach((p) => urls.add(p.src));
      GAME_DATA.caseboard?.victims?.forEach((v) => urls.add(v.img));
      GAME_DATA.cctv?.cameras?.forEach((cam) => {
        cam.frames?.forEach((f) => urls.add(f.src));
      });
      GAME_DATA.phoneCommunity?.forEach((m) => { if (m.image) urls.add(m.image); });
    }

    [
      'assets/web/web-fcwy-building.jpg',
      'assets/web/web-news-parking.jpg',
      'assets/scare/jumpscare-face.png',
      'assets/maps/b2-parking-map.png',
    ].forEach((u) => urls.add(u));

    return [...urls];
  }

  function getCriticalUrls() {
    const urls = [];
    const first = typeof PROLOGUE_DATA !== 'undefined'
      ? PROLOGUE_DATA.panels.find((p) => p.image)
      : null;
    if (first) urls.push(first.image);
    urls.push('assets/photos/photo-1-sunset.jpg');
    urls.push('assets/prologue/prologue-2-worried-friend.jpg');
    return urls;
  }

  function preloadOne(url) {
    if (cache.has(url)) return cache.get(url);

    const promise = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      const done = () => {
        loaded += 1;
        resolve(url);
      };
      img.onload = done;
      img.onerror = done;
      img.src = url;
    });

    cache.set(url, promise);
    return promise;
  }

  async function preloadBatch(urls, onProgress) {
    const CONCURRENCY = 6;
    for (let i = 0; i < urls.length; i += CONCURRENCY) {
      const chunk = urls.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map((url) => preloadOne(url)));
      onProgress?.(loaded, total);
    }
  }

  async function runPreload() {
    const all = collectUrls();
    const critical = getCriticalUrls().filter((u) => all.includes(u));
    const rest = all.filter((u) => !critical.includes(u));

    total = all.length;
    loaded = 0;
    criticalDone = false;
    allDone = false;

    await preloadBatch(critical, notifyProgress);
    criticalDone = true;
    notifyProgress();
    window.dispatchEvent(new CustomEvent('assets-critical-ready'));

    await preloadBatch(rest, notifyProgress);
    allDone = true;
    notifyProgress();
    window.dispatchEvent(new CustomEvent('assets-all-ready'));
    return { loaded, total };
  }

  function start(progressFn) {
    if (progressFn) onProgress = progressFn;
    if (!startPromise) startPromise = runPreload();
    else if (progressFn) notifyProgress();
    return startPromise;
  }

  function setProgressHandler(fn) {
    onProgress = fn;
    notifyProgress();
  }

  function isCriticalReady() { return criticalDone; }
  function isAllReady() { return allDone; }
  function getProgress() { return { loaded, total }; }

  // 脚本加载后立即开始预下载（不等待 game.js）
  startPromise = runPreload();

  return {
    start,
    setProgressHandler,
    collectUrls,
    isCriticalReady,
    isAllReady,
    getProgress,
  };
})();
