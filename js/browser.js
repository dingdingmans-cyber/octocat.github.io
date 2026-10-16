/** 浏览器标签页与导航 */
const BrowserEngine = {
  initState(state) {
    if (!state.browserTabs) {
      state.browserTabs = [{ url: 'about:history', title: '历史记录' }];
      state.activeBrowserUrl = 'about:history';
      state.visitedUrls = [];
    }
  },

  navigate(state, url) {
    this.initState(state);
    const site = WEB_SITES[url];
    if (!site) return false;

    if (!state.visitedUrls.includes(url)) {
      state.visitedUrls.push(url);
    }

    const existing = state.browserTabs.find(t => t.url === url);
    if (!existing) {
      state.browserTabs.push({ url, title: site.title });
    }
    state.activeBrowserUrl = url;
    return true;
  },

  closeTab(state, url) {
    if (state.browserTabs.length <= 1) return;
    const idx = state.browserTabs.findIndex(t => t.url === url);
    if (idx === -1) return;
    state.browserTabs.splice(idx, 1);
    if (state.activeBrowserUrl === url) {
      state.activeBrowserUrl = state.browserTabs[Math.max(0, idx - 1)].url;
    }
  },

  render(state) {
    this.initState(state);
    const activeUrl = state.activeBrowserUrl;
    const site = WEB_SITES[activeUrl];
    const content = site ? site.render(state) : '<p>无法访问此页面</p>';

    const tabs = state.browserTabs.map(tab => `
      <button type="button" class="browser-tab-btn ${tab.url === activeUrl ? 'active' : ''}"
              data-browser-tab="${tab.url}">
        <span class="browser-tab-title">${tab.title}</span>
        ${state.browserTabs.length > 1 ? `<span class="browser-tab-close" data-browser-close="${tab.url}">×</span>` : ''}
      </button>
    `).join('');

    const displayUrl = activeUrl === 'about:history' ? 'about:history' : activeUrl;

    return `
      <div class="browser-chrome">
        <div class="browser-toolbar">
          <button type="button" class="browser-nav-btn" data-browser-go="about:history" title="主页">⌂</button>
          <button type="button" class="browser-nav-btn" data-browser-go="back" title="后退">◀</button>
          <div class="browser-url-bar">
            <span class="browser-url-icon">${activeUrl.startsWith('https') ? '🔒' : '📄'}</span>
            <input class="browser-url-input" value="${displayUrl}" readonly>
          </div>
          <button type="button" class="browser-nav-btn" data-browser-refresh title="刷新">↻</button>
        </div>
        <div class="browser-tab-bar">${tabs}</div>
      </div>
      <div class="browser-page-view" id="browser-page-view">${content}</div>
    `;
  },
};
