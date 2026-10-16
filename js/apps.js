/** 各应用内容渲染 */
function onMobileView() {
  return window.innerWidth <= 768;
}

function visiblePhotos(state) {
  return GAME_DATA.photos.filter(p =>
    !p.unlockMilestone || state.milestones?.includes(p.unlockMilestone)
  );
}

function checkClueUnlocked(clueId, state) {
  switch (clueId) {
    case 'desktop-login': return state.loggedIn;
    case 'encrypted': return state.encryptedUnlocked;
    case 'phone': return state.phoneUnlocked;
    case 'shadow': return state.shadowUnlocked;
    default: return false;
  }
}

const AppRenderers = {
  journal(state) {
    const discovered = STORY_JOURNAL.clues.filter(c =>
      state.discoveredClues.includes(c.id) || checkClueUnlocked(c.id, state)
    );
    const undiscovered = STORY_JOURNAL.clues.filter(c =>
      !state.discoveredClues.includes(c.id) && !checkClueUnlocked(c.id, state)
    );
    const chapters = STORY_CHAPTERS.filter(ch => isChapterUnlocked(ch, state));
    const lockedChapters = STORY_CHAPTERS.filter(ch => !isChapterUnlocked(ch, state));
    const { tasks, done, total } = getTaskProgress(state);
    const nextHint = getNextTaskHint(state);

    return `
      <div class="journal-app">
        <pre class="journal-overview">${STORY_JOURNAL.overview}</pre>
        <h4 class="journal-section-title">调查任务 <span class="journal-progress">${done}/${total}</span></h4>
        <ul class="journal-task-list">
          ${tasks.map(t => `
            <li class="journal-task ${t.done ? 'done' : ''}">
              <span class="journal-task-check">${t.done ? '✓' : '○'}</span>
              <div class="journal-task-body">
                <strong>${t.title}</strong>
                <span class="journal-task-phase">${t.phase}</span>
                ${!t.done && tasks.find(x => !x.done)?.id === t.id ? `<em class="journal-task-hint">提示：${t.hint}</em>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
        ${nextHint && done < total ? `<p class="journal-next">▶ 下一步：${nextHint}</p>` : ''}
        ${chapters.length ? `
          <h4 class="journal-section-title">故事进展</h4>
          ${chapters.map(ch => `
            <div class="journal-chapter">
              <strong>${ch.title}</strong>
              <p>${ch.content}</p>
            </div>
          `).join('')}
        ` : ''}
        ${lockedChapters.length ? `<p class="journal-hint">继续调查可解锁更多章节（${chapters.length}/${STORY_CHAPTERS.length}）</p>` : ''}
        <h4 class="journal-section-title">已掌握的线索</h4>
        ${discovered.length ? discovered.map(c => `<div class="journal-clue found">✓ ${c.text}</div>`).join('') : '<p class="journal-empty">继续调查电脑里的应用……</p>'}
        ${undiscovered.length ? `
          <h4 class="journal-section-title">待解开</h4>
          ${undiscovered.map(() => `<div class="journal-clue locked">??? （尚未发现）</div>`).join('')}
        ` : ''}
      </div>
    `;
  },

  mail(state) {
    const mails = GAME_DATA.mail;
    const mobile = onMobileView();
    const selected = state.selectedMail ?? (mobile && state.mobileShowMailList ? null : mails[0]?.id);
    const current = selected ? mails.find(m => m.id === selected) : null;
    const mobileMode = mobile ? (state.mobileShowMailList ? 'mobile-list' : 'mobile-detail') : '';

    const sidebar = mails.map(m => `
      <div class="list-item ${!m.read ? 'unread' : ''} ${m.id === selected ? 'active' : ''}"
           data-mail-id="${m.id}">
        <div class="item-title">${m.subject}</div>
        <div class="item-meta">${m.from} · ${m.date}</div>
      </div>
    `).join('');

    const body = current ? `
      <button class="mobile-back-btn" data-action="mail-back">← 返回列表</button>
      <div class="mail-header">
        <h3>${current.subject}</h3>
        <div class="mail-meta">发件人: ${current.from} · ${current.date}</div>
      </div>
      <div class="mail-body ${current.creepy ? 'creepy-text' : ''}">${current.body}</div>
    ` : '<p class="mail-empty">选择一封邮件</p>';

    return `
      <div class="app-sidebar-layout ${mobileMode}">
        <div class="app-sidebar" id="mail-sidebar">${sidebar}</div>
        <div class="app-main" id="mail-main">${body}</div>
      </div>
    `;
  },

  messages(state) {
    const contacts = GAME_DATA.messages;
    const selected = state.selectedContact ?? 0;
    const current = contacts[selected];
    const mobile = onMobileView();
    const mobileMode = mobile ? (state.mobileShowChatList ? 'mobile-list' : 'mobile-detail') : '';

    const contactList = contacts.map((c, i) => `
      <div class="chat-contact ${i === selected ? 'active' : ''}" data-contact="${i}">
        <div class="chat-avatar">${c.avatar}</div>
        <span>${c.contact}</span>
      </div>
    `).join('');

    const bubbles = current.chats.map(msg => `
      <div class="chat-bubble ${msg.from}">
        ${msg.text}
        <div class="chat-time">${msg.time}</div>
      </div>
    `).join('');

    return `
      <div class="chat-layout ${mobileMode}" id="chat-layout">
        <div class="chat-contacts" id="chat-contacts">${contactList}</div>
        <div class="chat-messages" id="chat-messages">
          <button class="mobile-back-btn" data-action="chat-back">← 返回联系人</button>
          ${bubbles}
        </div>
      </div>
    `;
  },

  notes() {
    const notes = GAME_DATA.notes;
    return notes.map(n => `
      <div class="note-block" style="margin-bottom:1.5rem">
        <h3 style="margin-bottom:0.25rem">${n.title}</h3>
        <div class="item-meta" style="margin-bottom:0.5rem">${n.date}</div>
        <div class="note-content">${n.content.replace(/\n/g, '<br>')}</div>
      </div>
    `).join('<hr style="border-color:var(--border);margin:1rem 0">');
  },

  caseboard(state) {
    const board = GAME_DATA.caseboard;
    const selected = board.victims.find(v => v.id === state.selectedVictim);
    const cards = board.victims.map((v, i) => `
      <button type="button" class="caseboard-card ${state.selectedVictim === v.id ? 'active' : ''}"
              data-caseboard-victim="${v.id}" style="--rot:${v.rot}deg">
        <img src="${v.img}" alt="${v.name}" loading="lazy">
        <div class="caseboard-card-meta">
          <strong>${v.name}</strong>
          ${v.date} · ${v.job}
        </div>
      </button>
    `).join('');

    return `
      <div class="caseboard-app">
        <div class="caseboard-title">📌 林雨的自查线索墙 · 翡翠湾连环失踪</div>
        <div class="caseboard-grid">${cards}</div>
        ${selected ? `
          <div class="caseboard-detail">
            <strong>${selected.name}</strong> — ${selected.date}<br>
            ${selected.detail}
          </div>
        ` : '<p class="caseboard-strings">点击照片查看林雨整理的备注 · ' + board.footer + '</p>'}
      </div>
    `;
  },

  calendar(state) {
    const cal = GAME_DATA.calendar;
    const firstDay = new Date(cal.year, cal.month - 1, 1).getDay();
    const daysInMonth = new Date(cal.year, cal.month, 0).getDate();
    const eventMap = {};
    cal.days.forEach(d => { eventMap[d.day] = d; });

    let cells = '';
    for (let i = 0; i < firstDay; i++) cells += '<div class="cal-day empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const ev = eventMap[d];
      const cls = [
        'cal-day',
        ev?.type || '',
        d === 13 ? 'today' : '',
        state.selectedCalDay === d ? 'selected' : '',
      ].filter(Boolean).join(' ');
      cells += `<button type="button" class="${cls}" data-cal-day="${d}" ${ev ? '' : 'disabled'}>
        ${d}${ev?.type === 'victim' ? '<span class="cal-day-dot"></span>' : ''}
      </button>`;
    }

    const selectedEv = state.selectedCalDay ? eventMap[state.selectedCalDay] : null;
    const prevList = cal.prevEvents.map(e =>
      `<li><strong>${e.date}</strong> — ${e.label}</li>`
    ).join('');

    return `
      <div class="calendar-app">
        <div class="calendar-header">
          <h3>${cal.monthLabel}</h3>
          <span class="web-muted">林雨的标记</span>
        </div>
        <div class="calendar-legend">
          <span class="cal-dot-victim">失联日</span>
          <span class="cal-dot-note">重要事件</span>
        </div>
        <div class="calendar-weekdays">
          <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
        </div>
        <div class="calendar-grid">${cells}</div>
        ${selectedEv ? `
          <div class="calendar-event-panel">
            <strong>${selectedEv.label}</strong><br>${selectedEv.detail}
          </div>
        ` : ''}
        <ul class="web-muted" style="margin-top:0.75rem;font-size:0.75rem;padding-left:1rem">${prevList}</ul>
      </div>
    `;
  },

  cctv(state) {
    const camId = state.cctvCamera || GAME_DATA.cctv.cameras[0].id;
    const cam = GAME_DATA.cctv.cameras.find(c => c.id === camId) || GAME_DATA.cctv.cameras[0];
    const frameIdx = state.cctvFrame ?? 0;
    const frame = cam.frames[Math.min(frameIdx, cam.frames.length - 1)];
    const tabs = GAME_DATA.cctv.cameras.map(c => `
      <button type="button" class="cctv-cam-tab ${c.id === cam.id ? 'active' : ''}" data-cctv-camera="${c.id}">
        ${c.name}
      </button>
    `).join('');

    return `
      <div class="cctv-app">
        <div class="cctv-camera-list">${tabs}</div>
        <div class="cctv-screen">
          <img src="${frame.src}" alt="监控画面" id="cctv-frame-img">
          <div class="cctv-overlay"></div>
        </div>
        <div class="cctv-controls">
          <button type="button" class="cctv-btn" data-cctv-action="play">▶ 播放</button>
          <button type="button" class="cctv-btn" data-cctv-action="pause">⏸ 暂停</button>
          <button type="button" class="cctv-btn" data-cctv-action="next">下一帧 ⏭</button>
          <span class="cctv-time">${frame.time} · ${frame.label}</span>
        </div>
        <p class="cctv-hint">物业授权回放 · B2西侧 · 帧 ${frameIdx + 1}/${cam.frames.length}</p>
      </div>
    `;
  },

  photos(state) {
    const photos = visiblePhotos(state);
    if (state.selectedPhoto) {
      const p = photos.find(ph => ph.id === state.selectedPhoto) ||
        GAME_DATA.photos.find(ph => ph.id === state.selectedPhoto);
      if (!p) return '';
      return `
        <div class="photo-view">
          <button class="photo-back-btn" data-action="photo-back">← 返回相册</button>
          <div class="photo-large-wrap ${p.creepy ? 'photo-creepy' : ''}">
            <img class="photo-large" src="${p.src}" alt="${p.title}" loading="lazy">
          </div>
          <p class="photo-caption">${p.caption}</p>
          <p class="photo-date-meta">${p.date}</p>
          ${p.metadata ? `<pre class="photo-meta">${p.metadata}</pre>` : ''}
        </div>
      `;
    }

    return `
      <div class="photo-grid">
        ${photos.map(p => `
          <div class="photo-thumb ${p.creepy ? 'photo-thumb-creepy' : ''}" data-photo-id="${p.id}">
            <img src="${p.src}" alt="${p.title}" loading="lazy">
            <span class="photo-thumb-label">${p.title}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  browser(state) {
    return BrowserEngine.render(state);
  },

  files(state) {
    const unlocked = state.encryptedUnlocked;

    function renderTree(items, depth = 0) {
      return items.map(item => {
        if (item.type === 'folder') {
          if (item.encrypted && !unlocked) {
            return `
              <div class="indent" style="padding-left:${depth * 1.25}rem">
                <div class="folder">🔒 ${item.name}</div>
                <div class="encrypt-prompt">
                  <p>此文件夹已加密</p>
                  <input type="password" id="folder-password" placeholder="输入密码" autocomplete="off">
                  <button id="folder-unlock-btn">解锁</button>
                  <p class="encrypt-error" id="folder-error"></p>
                </div>
              </div>
            `;
          }
          const children = item.children ? renderTree(item.children, depth + 1) : '';
          return `
            <div class="indent" style="padding-left:${depth * 1.25}rem">
              <div class="folder">📂 ${item.name}</div>
              ${children}
            </div>
          `;
        }
        const fileId = item.id ? ` data-file-id="${item.id}"` : '';
        return `
          <div class="file indent" style="padding-left:${(depth + 1) * 1.25}rem" data-file-content="${encodeURIComponent(item.content)}"${fileId}>
            📄 ${item.name}
          </div>
        `;
      }).join('');
    }

    const tree = renderTree(GAME_DATA.files.folders);
    const preview = state.filePreview ? `
      <div class="file-content" style="margin-top:1rem;padding:0.75rem;background:rgba(0,0,0,0.3);border-radius:8px">
        <button data-action="file-back" style="cursor:pointer;background:none;border:1px solid var(--border);color:var(--text);padding:0.2rem 0.5rem;border-radius:4px;margin-bottom:0.5rem">← 关闭</button>
        <p>${state.filePreview}</p>
      </div>
    ` : '';

    return `<div class="file-tree">${tree}</div>${preview}`;
  },

  trash() {
    return GAME_DATA.trash.map(t => `
      <div style="margin-bottom:1rem;padding:0.75rem;background:rgba(255,255,255,0.03);border-radius:8px">
        <strong>${t.name}</strong>
        <pre style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-dim);white-space:pre-wrap">${t.content}</pre>
      </div>
    `).join('');
  },

  settings() {
    const s = GAME_DATA.settings;
    return `
      <div class="settings-list">
        <div class="settings-item"><span class="settings-label">壁纸</span><span>${s.wallpaper}</span></div>
        <div class="settings-item"><span class="settings-label">上次登录</span><span>${s.lastLogin}</span></div>
        <div class="settings-item"><span class="settings-label">已连接设备</span><span>${s.devices.join(', ')}</span></div>
        <div class="settings-item"><span class="settings-label">安全</span><span>${s.security}</span></div>
      </div>
    `;
  },

  shadow(state) {
    if (!state.shadowUnlocked) {
      return `
        <div style="text-align:center;padding:2rem">
          <div style="font-size:3rem;margin-bottom:1rem">👁️</div>
          <p style="color:var(--danger);margin-bottom:1rem">幽影 — 访问受限</p>
          <input type="text" id="shadow-password" placeholder="输入访问密码" lang="zh-CN" autocomplete="off" inputmode="text"
                 style="padding:0.5rem 1rem;border:1px solid var(--border);border-radius:6px;background:rgba(0,0,0,0.3);color:var(--text);font-family:var(--mono);width:200px;text-align:center">
          <p style="font-size:0.75rem;color:var(--text-dim);margin-top:0.5rem">拒绝访问。林雨留下的线索散落在各处。</p>
          <br><br>
          <button id="shadow-unlock-btn" style="padding:0.5rem 1.5rem;border:none;border-radius:6px;background:var(--danger);color:#fff;cursor:pointer">进入</button>
          <p class="encrypt-error" id="shadow-error" style="margin-top:0.5rem"></p>
        </div>
      `;
    }

    const logs = GAME_DATA.shadowApp.logs.map((line, i) =>
      `<div class="log-line" style="animation-delay:${i * 0.4}s">${line}</div>`
    ).join('');

    return `
      <div style="padding:0.5rem">
        <h3 style="color:var(--danger);margin-bottom:1rem">幽影 — 活动日志</h3>
        <div class="shadow-log">${logs}</div>
      </div>
    `;
  },

  'phone-messages'() {
    return GAME_DATA.phoneMessages.map(m => `
      <div style="padding:0.75rem;border-bottom:1px solid var(--border)">
        <div style="font-size:0.75rem;color:var(--text-dim)">${m.from} · ${m.time}</div>
        <div style="margin-top:0.25rem" class="${m.creepy ? 'creepy-text' : ''}">${m.text}</div>
      </div>
    `).join('');
  },

  'phone-voice'() {
    return GAME_DATA.phoneVoice.map(v => `
      <div style="padding:0.75rem;border-bottom:1px solid var(--border);cursor:pointer" class="voice-item">
        <div style="display:flex;justify-content:space-between">
          <strong>${v.title}</strong>
          <span style="color:var(--text-dim);font-size:0.75rem">${v.duration}</span>
        </div>
        <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-dim)" class="${v.creepy ? 'creepy-text' : ''}">"${v.text}"</p>
      </div>
    `).join('');
  },

  'phone-camera'(state) {
    if (state.cameraViewed) {
      return `<p style="text-align:center;padding:2rem;color:var(--text-dim)">相机无法启动 — 硬件被占用</p>`;
    }
    return `<p style="text-align:center;padding:2rem">点击拍照...</p>`;
  },

  'phone-gallery'(state) {
    const ids = ['photo-3'];
    if (state.milestones?.includes('visit-serial')) ids.push('photo-4');
    const items = ids.map(id => GAME_DATA.photos.find(ph => ph.id === id)).filter(Boolean);
    return `
      <div class="photo-grid">
        ${items.filter(Boolean).map(p => `
          <div class="photo-thumb ${p.creepy ? 'photo-thumb-creepy' : ''}" data-photo-id="${p.id}">
            <img src="${p.src}" alt="${p.title}" loading="lazy">
            <span class="photo-thumb-label">${p.title}</span>
          </div>
        `).join('')}
      </div>
      <p class="phone-gallery-hint">与电脑相册同步 — 林雨未能删干净的照片</p>
    `;
  },

  'phone-community'() {
    return `
      <div class="community-app">
        <div class="community-header">
          <h4>翡翠湾业主群（128人）</h4>
          <p>林雨置顶了此聊天</p>
        </div>
        ${GAME_DATA.phoneCommunity.map(m => `
          <div class="community-msg">
            <div class="community-avatar">${m.avatar}</div>
            <div>
              <div class="community-meta">${m.user} · ${m.time}</div>
              <div class="community-bubble ${m.creepy ? 'creepy-text' : ''}">
                ${m.text}
                ${m.image ? `<img class="community-img" src="${m.image}" alt="" loading="lazy">` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  'phone-map'() {
    return `
      <div class="phone-map-app">
        <img src="assets/maps/b2-parking-map.png" alt="B2停车场地图" loading="lazy">
        <p class="phone-map-caption">林雨在地图中标记了四名受害者的车位与 748 储物柜位置。红线串联各案发点。</p>
        <ul class="phone-map-markers">
          <li>方晓 · 2/22 · 西侧 A区</li>
          <li>赵婷 · 3/1 · 西侧 B区</li>
          <li>周岚 · 3/8 · 东侧入口</li>
          <li>林雨 · 3/15 · 西侧 C区（镜中拍到的位置）</li>
          <li>748 储物柜 · 陈默邮件提及</li>
        </ul>
      </div>
    `;
  },
};
