/**
 * DV-Utilitiy Application Business Logic
 */

// Safe Storage Helper prevents crashes in restricted WebViews / Incognito
const SafeStorage = {
  get: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  },
  getJSON: (key, fallback = []) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  setJSON: (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
};

const AppState = {
  theme: SafeStorage.get('dv_theme', 'light'),
  todos: SafeStorage.getJSON('dv_todos', []),
  activeModalHistory: []
};

function initApp() {
  applyTheme(AppState.theme);
  renderTodos();
  setupNavigation();
  setupModals();
  setupInteractions();
  refreshPublicStats();
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  AppState.theme = theme;
  SafeStorage.set('dv_theme', theme);
}

function showCenterDialog(title, message) {
  const backdrop = document.getElementById('center-dialog-backdrop');
  if (!backdrop) return;
  document.getElementById('center-dialog-title').textContent = title;
  document.getElementById('center-dialog-message').textContent = message;
  backdrop.classList.remove('hidden');

  const okBtn = document.getElementById('btn-dialog-ok');
  okBtn.onclick = () => {
    backdrop.classList.add('hidden');
  };
}

function closeAllDrawers() {
  const drawerLeft = document.getElementById('drawer-left');
  const drawerRight = document.getElementById('drawer-right');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  if (drawerLeft) drawerLeft.classList.remove('open');
  if (drawerRight) drawerRight.classList.remove('open');
  if (drawerBackdrop) drawerBackdrop.classList.remove('active');
}

function setupNavigation() {
  // Bottom Navigation Switcher
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewPanels = document.querySelectorAll('.view-panel');

  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTab = e.currentTarget;
      navTabs.forEach(t => t.classList.remove('active'));
      viewPanels.forEach(p => p.classList.remove('active'));

      currentTab.classList.add('active');
      const targetViewId = currentTab.getAttribute('data-view');
      const targetPanel = document.getElementById(targetViewId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Left & Right Drawer Menus with Overlay Backdrop
  const drawerLeft = document.getElementById('drawer-left');
  const drawerRight = document.getElementById('drawer-right');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const btnLeft = document.getElementById('btn-left-menu');
  const btnRight = document.getElementById('btn-right-menu');
  const btnCloseLeft = document.getElementById('btn-close-left');
  const btnCloseRight = document.getElementById('btn-close-right');

  if (btnLeft && drawerLeft) {
    btnLeft.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDrawers();
      drawerLeft.classList.add('open');
      if (drawerBackdrop) drawerBackdrop.classList.add('active');
    });
  }

  if (btnCloseLeft && drawerLeft) {
    btnCloseLeft.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDrawers();
    });
  }

  if (btnRight && drawerRight) {
    btnRight.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDrawers();
      drawerRight.classList.add('open');
      if (drawerBackdrop) drawerBackdrop.classList.add('active');
    });
  }

  if (btnCloseRight && drawerRight) {
    btnCloseRight.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDrawers();
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => {
      closeAllDrawers();
    });
  }
}

function setupModals() {
  const drawerLeft = document.getElementById('drawer-left');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const modalLinks = document.querySelectorAll('.drawer-link[data-modal]');

  // Open Fullscreen Modal from Sidebar
  modalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = link.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        if (drawerLeft) drawerLeft.classList.remove('open');
        if (drawerBackdrop) drawerBackdrop.classList.remove('active');
        modal.classList.add('open');
        AppState.activeModalHistory.push({ modal: modal, parent: drawerLeft });
      }
    });
  });

  // Native Android Back Arrow returns to Sidebar Menu first
  const modalBackButtons = document.querySelectorAll('.btn-modal-back');
  modalBackButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentModal = btn.closest('.fullscreen-modal');
      if (currentModal) {
        currentModal.classList.remove('open');
        const record = AppState.activeModalHistory.pop();
        if (record && record.parent) {
          record.parent.classList.add('open');
          if (drawerBackdrop) drawerBackdrop.classList.add('active');
        }
      }
    });
  });

  // Share Modal Open Trigger
  const btnOpenShare = document.getElementById('btn-open-share');
  if (btnOpenShare) {
    btnOpenShare.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDrawers();
      const shareModal = document.getElementById('modal-share');
      if (shareModal) {
        shareModal.classList.add('open');
        AppState.activeModalHistory.push({ modal: shareModal, parent: document.getElementById('drawer-right') });
      }
    });
  }

  // Show More / Show Less for Developer Bio
  const btnToggleDev = document.getElementById('btn-toggle-dev-bio');
  if (btnToggleDev) {
    btnToggleDev.addEventListener('click', function(e) {
      e.preventDefault();
      const bio = document.getElementById('dev-bio');
      const isCollapsed = bio.classList.toggle('collapsed');
      this.textContent = isCollapsed ? 'Show More' : 'Show Less';
    });
  }

  // Show More / Show Less for Team Bio
  const btnToggleTeam = document.getElementById('btn-toggle-team-bio');
  if (btnToggleTeam) {
    btnToggleTeam.addEventListener('click', function(e) {
      e.preventDefault();
      const bio = document.getElementById('team-bio');
      const isCollapsed = bio.classList.toggle('collapsed');
      this.textContent = isCollapsed ? 'Show More' : 'Show Less';
    });
  }
}

function setupInteractions() {
  // Dark Mode Toggle
  const btnTheme = document.getElementById('btn-theme-toggle');
  if (btnTheme) {
    btnTheme.addEventListener('click', (e) => {
      e.preventDefault();
      const nextTheme = AppState.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  // 24-Hour Rate-Limited Like Trigger
  const btnLike = document.getElementById('btn-hit-like');
  if (btnLike) {
    btnLike.addEventListener('click', async (e) => {
      e.preventDefault();
      const lastLiked = SafeStorage.get('dv_last_liked');
      const now = Date.now();

      if (lastLiked && now - parseInt(lastLiked, 10) < 86400000) {
        showCenterDialog('Appreciation Recorded', 'You have already appreciated the platform within the last 24 hours.');
        return;
      }

      btnLike.disabled = true;
      const res = await ApiClient.incrementLike();
      btnLike.disabled = false;

      if (res && res.success) {
        SafeStorage.set('dv_last_liked', String(now));
        document.getElementById('stat-likes-count').textContent = res.count;
        showCenterDialog('Appreciated', 'Thank you for supporting DV-Utilitiy.');
      } else {
        showCenterDialog('Notice', (res && res.error) ? res.error : 'Connection to server could not be established.');
      }
    });
  }

  // Shorten URL Form Submission
  const btnShorten = document.getElementById('btn-shorten-submit');
  if (btnShorten) {
    btnShorten.addEventListener('click', async (e) => {
      e.preventDefault();
      const input = document.getElementById('input-long-url');
      const url = input.value.trim();

      if (!url || !url.startsWith('http')) {
        showCenterDialog('Invalid URL', 'Please provide a valid address starting with http:// or https://');
        return;
      }

      btnShorten.disabled = true;
      btnShorten.textContent = 'Generating...';
      const res = await ApiClient.shortenUrl(url);
      btnShorten.disabled = false;
      btnShorten.textContent = 'Generate Secure Short Link';

      if (res && res.success) {
        const output = document.getElementById('output-short-url');
        const constructedUrl = ApiClient.getEndpoint() + '?r=' + res.shortCode;
        output.value = constructedUrl;
        document.getElementById('shortener-result').classList.remove('hidden');
      } else {
        showCenterDialog('Shorten Error', (res && res.error) ? res.error : 'Server rejected the request or service is inactive.');
      }
    });
  }

  // Copy Short URL to Clipboard
  const btnCopy = document.getElementById('btn-copy-short-url');
  if (btnCopy) {
    btnCopy.addEventListener('click', (e) => {
      e.preventDefault();
      const output = document.getElementById('output-short-url');
      output.select();
      output.setSelectionRange(0, 99999);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output.value).then(() => {
          showCenterDialog('Copied', 'Short link copied to device clipboard.');
        }).catch(() => {
          showCenterDialog('Copied', 'Link ready: ' + output.value);
        });
      } else {
        document.execCommand('copy');
        showCenterDialog('Copied', 'Short link copied to device clipboard.');
      }
    });
  }

  // Add Task to Checklist
  const btnAddTodo = document.getElementById('btn-add-todo');
  if (btnAddTodo) {
    btnAddTodo.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.getElementById('input-todo');
      const text = input.value.trim();
      if (text) {
        AppState.todos.push({ id: Date.now(), text: text, done: false });
        input.value = '';
        saveAndRenderTodos();
      }
    });
  }

  // Share Channels
  const btnShareNative = document.getElementById('btn-share-native');
  if (btnShareNative) {
    btnShareNative.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.share) {
        navigator.share({
          title: 'DV-Utilitiy',
          text: 'Lean URL routing engine for Android.',
          url: window.location.href
        }).catch(() => {});
      } else {
        showCenterDialog('Android Share', 'Native share sheet unavailable in this environment.');
      }
    });
  }

  const btnShareWA = document.getElementById('btn-share-whatsapp');
  if (btnShareWA) {
    btnShareWA.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(window.location.href), '_blank');
    });
  }

  const btnShareFB = document.getElementById('btn-share-facebook');
  if (btnShareFB) {
    btnShareFB.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
    });
  }

  const btnShareTW = document.getElementById('btn-share-twitter');
  if (btnShareTW) {
    btnShareTW.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href), '_blank');
    });
  }

  const btnShareBT = document.getElementById('btn-share-bluetooth');
  if (btnShareBT) {
    btnShareBT.addEventListener('click', (e) => {
      e.preventDefault();
      showCenterDialog('Bluetooth', 'Turn on Bluetooth in your Android device settings to pair and transfer.');
    });
  }
}

function renderTodos() {
  const container = document.getElementById('todo-items-list');
  if (!container) return;
  container.innerHTML = '';
  AppState.todos.forEach(item => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (item.done ? ' done' : '');
    li.innerHTML = `
      <span class="todo-text">${escapeHtml(item.text)}</span>
      <div class="todo-actions">
        <button class="btn-inline-toggle btn-todo-toggle" data-id="${item.id}">${item.done ? 'Undo' : 'Done'}</button>
        <button class="btn-inline-toggle btn-todo-del" data-id="${item.id}" style="color:var(--error-red)">Delete</button>
      </div>
    `;
    container.appendChild(li);
  });

  // Event Delegation for To-Do buttons
  container.querySelectorAll('.btn-todo-toggle').forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const id = Number(b.getAttribute('data-id'));
      AppState.todos = AppState.todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
      saveAndRenderTodos();
    });
  });

  container.querySelectorAll('.btn-todo-del').forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const id = Number(b.getAttribute('data-id'));
      AppState.todos = AppState.todos.filter(t => t.id !== id);
      saveAndRenderTodos();
    });
  });
}

function saveAndRenderTodos() {
  SafeStorage.setJSON('dv_todos', AppState.todos);
  renderTodos();
}

async function refreshPublicStats() {
  try {
    const lastView = SafeStorage.get('dv_view_logged');
    if (!lastView) {
      await ApiClient.incrementView();
      SafeStorage.set('dv_view_logged', 'true');
    }

    const res = await ApiClient.getPublicStats();
    if (res && res.success) {
      const vEl = document.getElementById('stat-views-count');
      const lEl = document.getElementById('stat-likes-count');
      if (vEl) vEl.textContent = res.views;
      if (lEl) lEl.textContent = res.likes;
    }
  } catch (err) {}
}

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}