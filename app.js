/**
 * DV-Utilitiy Application Business Logic
 */

const AppState = {
  theme: localStorage.getItem('dv_theme') || 'light',
  todos: JSON.parse(localStorage.getItem('dv_todos') || '[]'),
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
  localStorage.setItem('dv_theme', theme);
}

function showCenterDialog(title, message) {
  const backdrop = document.getElementById('center-dialog-backdrop');
  document.getElementById('center-dialog-title').textContent = title;
  document.getElementById('center-dialog-message').textContent = message;
  backdrop.classList.remove('hidden');

  document.getElementById('btn-dialog-ok').onclick = () => {
    backdrop.classList.add('hidden');
  };
}

function setupNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewPanels = document.querySelectorAll('.view-panel');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      viewPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetView = tab.getAttribute('data-view');
      const activePanel = document.getElementById(targetView);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  const drawerLeft = document.getElementById('drawer-left');
  const drawerRight = document.getElementById('drawer-right');

  document.getElementById('btn-left-menu').addEventListener('click', () => {
    drawerLeft.classList.add('open');
  });

  document.getElementById('btn-close-left').addEventListener('click', () => {
    drawerLeft.classList.remove('open');
  });

  document.getElementById('btn-right-menu').addEventListener('click', () => {
    drawerRight.classList.add('open');
  });

  document.getElementById('btn-close-right').addEventListener('click', () => {
    drawerRight.classList.remove('open');
  });
}

function setupModals() {
  const drawerLeft = document.getElementById('drawer-left');
  const modalLinks = document.querySelectorAll('.drawer-link[data-modal]');

  modalLinks.forEach(link => {
    link.addEventListener('click', () => {
      const modalId = link.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        AppState.activeModalHistory.push({ modal: modal, parent: drawerLeft });
      }
    });
  });

  const modalBackButtons = document.querySelectorAll('.btn-modal-back');
  modalBackButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const currentModal = e.target.closest('.fullscreen-modal');
      if (currentModal) {
        currentModal.classList.remove('open');
        const record = AppState.activeModalHistory.pop();
        if (record && record.parent) {
          record.parent.classList.add('open');
        }
      }
    });
  });

  document.getElementById('btn-open-share').addEventListener('click', () => {
    document.getElementById('drawer-right').classList.remove('open');
    const shareModal = document.getElementById('modal-share');
    shareModal.classList.add('open');
    AppState.activeModalHistory.push({ modal: shareModal, parent: document.getElementById('drawer-right') });
  });

  document.getElementById('btn-toggle-dev-bio').addEventListener('click', function() {
    const bio = document.getElementById('dev-bio');
    const isCollapsed = bio.classList.toggle('collapsed');
    this.textContent = isCollapsed ? 'Show More' : 'Show Less';
  });

  document.getElementById('btn-toggle-team-bio').addEventListener('click', function() {
    const bio = document.getElementById('team-bio');
    const isCollapsed = bio.classList.toggle('collapsed');
    this.textContent = isCollapsed ? 'Show More' : 'Show Less';
  });
}

function setupInteractions() {
  document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    const nextTheme = AppState.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  document.getElementById('btn-hit-like').addEventListener('click', async () => {
    const lastLiked = localStorage.getItem('dv_last_liked');
    const now = Date.now();
    if (lastLiked && now - parseInt(lastLiked, 10) < 86400000) {
      showCenterDialog('Notice', 'You have already appreciated the platform within the last 24 hours.');
      return;
    }

    const res = await ApiClient.incrementLike();
    if (res.success) {
      localStorage.setItem('dv_last_liked', String(now));
      document.getElementById('stat-likes-count').textContent = res.count;
      showCenterDialog('Appreciated', 'Thank you for supporting DV-Utilitiy.');
    } else {
      showCenterDialog('Alert', res.error || 'Failed to update appreciation metric.');
    }
  });

  document.getElementById('btn-shorten-submit').addEventListener('click', async () => {
    const input = document.getElementById('input-long-url');
    const url = input.value.trim();

    if (!url || !url.startsWith('http')) {
      showCenterDialog('Validation', 'Please provide a complete link starting with http:// or https://');
      return;
    }

    const res = await ApiClient.shortenUrl(url);
    if (res.success) {
      const output = document.getElementById('output-short-url');
      const constructedUrl = ApiClient.getEndpoint() + '?r=' + res.shortCode;
      output.value = constructedUrl;
      document.getElementById('shortener-result').classList.remove('hidden');
    } else {
      showCenterDialog('Shorten Error', res.error || 'Service returned an execution error.');
    }
  });

  document.getElementById('btn-copy-short-url').addEventListener('click', () => {
    const output = document.getElementById('output-short-url');
    output.select();
    output.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(output.value).then(() => {
      showCenterDialog('Copied', 'Short link copied to device clipboard.');
    });
  });

  document.getElementById('btn-add-todo').addEventListener('click', () => {
    const input = document.getElementById('input-todo');
    const text = input.value.trim();
    if (text) {
      AppState.todos.push({ id: Date.now(), text: text, done: false });
      input.value = '';
      saveAndRenderTodos();
    }
  });

  document.getElementById('btn-share-native').addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'DV-Utilitiy Link Platform',
        text: 'Access lean, zero-dependency URL generation optimized for Android.',
        url: window.location.href
      });
    } else {
      showCenterDialog('Notice', 'Android Native Share is unavailable on this browser.');
    }
  });

  document.getElementById('btn-share-whatsapp').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    window.open('https://api.whatsapp.com/send?text=' + url, '_blank');
  });

  document.getElementById('btn-share-facebook').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
  });

  document.getElementById('btn-share-twitter').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    window.open('https://twitter.com/intent/tweet?url=' + url, '_blank');
  });

  document.getElementById('btn-share-bluetooth').addEventListener('click', () => {
    showCenterDialog('Bluetooth Direct', 'Please ensure Bluetooth is enabled in your Android System Settings to pair with recipient devices.');
  });
}

function renderTodos() {
  const container = document.getElementById('todo-items-list');
  container.innerHTML = '';
  AppState.todos.forEach(item => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (item.done ? ' done' : '');
    li.innerHTML = `
      <span>${escapeHtml(item.text)}</span>
      <div>
        <button class="btn-inline-toggle" onclick="toggleTodo(${item.id})">${item.done ? 'Undo' : 'Done'}</button>
        <button class="btn-inline-toggle" style="color:var(--error-red)" onclick="deleteTodo(${item.id})">Delete</button>
      </div>
    `;
    container.appendChild(li);
  });
}

function saveAndRenderTodos() {
  localStorage.setItem('dv_todos', JSON.stringify(AppState.todos));
  renderTodos();
}

window.toggleTodo = function(id) {
  AppState.todos = AppState.todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveAndRenderTodos();
};

window.deleteTodo = function(id) {
  AppState.todos = AppState.todos.filter(t => t.id !== id);
  saveAndRenderTodos();
};

async function refreshPublicStats() {
  const lastViewRecorded = sessionStorage.getItem('dv_view_logged');
  if (!lastViewRecorded) {
    await ApiClient.incrementView();
    sessionStorage.setItem('dv_view_logged', 'true');
  }

  const res = await ApiClient.getPublicStats();
  if (res.success) {
    document.getElementById('stat-views-count').textContent = res.views;
    document.getElementById('stat-likes-count').textContent = res.likes;
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}