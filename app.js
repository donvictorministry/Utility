/* Shared UI kit: icons, guard, theme, centered toast/dialog/loader, history-aware modals */
const DV = {};

DV.I = {
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  dots: '<circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>',
  home: '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>',
  edit: '<path d="M4 20h4L20 8l-4-4L4 16zM14 6l4 4"/>',
  more: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  back: '<path d="M19 12H5M12 5l-7 7 7 7"/>',
  heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  android: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  team: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M19 20a7 7 0 0 0-3-5.7"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5"/>',
  doc: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h.5M4 12h.5M4 18h.5"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  logout: '<path d="M9 21H5V3h4M16 17l5-5-5-5M21 12H9"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  alert: '<path d="M12 3l10 18H2zM12 10v5M12 18v.5"/>',
  twitter: '<path d="M4 4l16 16M20 4L4 20"/>',
  bluetooth: '<path d="M7 7l10 10-5 5V2l5 5L7 17"/>',
  gmail: '<rect x="2" y="5" width="20" height="14" rx="2" fill="#fff" stroke="#EA4335" stroke-width="2"/><path d="M2 7l10 7 10-7" stroke="#EA4335" stroke-width="2.5"/>',
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z" fill="#25D366" stroke="none"/><path d="M8.5 7.5c-.5.6-.9 1.7.3 3.4 1.3 1.9 3 3 4.7 3.4 1 .2 1.8-.5 2-1.1l-1.8-1-.8.8c-1-.4-2-1.3-2.5-2.3l.7-.8-.9-1.9c-.3-.7-1.2-.5-1.7-.5z" fill="#fff" stroke="none"/>',
  facebook: '<circle cx="12" cy="12" r="10" fill="#1877F2" stroke="none"/><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.7c0-.9.3-1.4 1.5-1.4h1.5V4.6c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.2H8.1v3h2.5V21z" fill="#fff" stroke="none"/>',
  phone: '<circle cx="12" cy="12" r="10" fill="#34A853" stroke="none"/><path d="M8 6.5l2 .5.8 2.2-1.2 1c.7 1.4 1.8 2.5 3.2 3.2l1-1.2 2.2.8.5 2c0 .6-.6 1.5-1.5 1.5C10.5 16.5 7.5 13.5 7.5 8c0-.9.9-1.5.5-1.5z" fill="#fff" stroke="none"/>'
};

DV.ic = (n, c) => `<svg class="ic ${c || ''}" viewBox="0 0 24 24" aria-hidden="true">${DV.I[n]}</svg>`;
DV.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
DV.ls = (key, v) => { try { if (v === undefined) return localStorage.getItem(key); localStorage.setItem(key, v); } catch (e) { return null; } };
DV.dev = () => {
  let d = DV.ls('dvd');
  if (!d) {
    const a = new Uint8Array(16);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
    else a.forEach((_, i) => { a[i] = Math.random() * 256; });
    d = Array.from(a, x => x.toString(16).padStart(2, '0')).join('');
    DV.ls('dvd', d);
  }
  return d;
};

/* Android-only guard (desktop blocker) */
DV.guard = () => {
  const ok = /Android/i.test(navigator.userAgent) && matchMedia('(pointer:coarse)').matches && !matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (ok) return true;
  document.body.innerHTML = `<div class="block"><div>${DV.ic('alert')}<p>This app works on Android phones only.</p></div></div>`;
  return false;
};

/* Theme */
DV.theme = t => {
  if (!t) t = DV.ls('dvt') || 'light';
  document.body.classList.toggle('dark-mode', t === 'dark');
  DV.ls('dvt', t);
  document.querySelectorAll('[data-theme-ic]').forEach(e => (e.innerHTML = DV.ic(t === 'dark' ? 'sun' : 'moon')));
  document.querySelectorAll('[data-sw="dark"]').forEach(e => e.setAttribute('aria-checked', t === 'dark'));
};
DV.toggleTheme = () => DV.theme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');

/* Centered feedback */
DV.toast = (m, t) => {
  let e = document.getElementById('toast');
  if (!e) { e = document.createElement('div'); e.id = 'toast'; document.body.appendChild(e); }
  e.className = 'toast show ' + (t || '');
  e.innerHTML = DV.ic(t === 'err' ? 'alert' : 'check') + '<span>' + DV.esc(m) + '</span>';
  clearTimeout(DV._t);
  DV._t = setTimeout(() => e.classList.remove('show'), 2400);
};
DV.busy = on => {
  let e = document.getElementById('busy');
  if (!on) { if (e) e.remove(); return; }
  if (e) return;
  e = document.createElement('div'); e.id = 'busy'; e.className = 'scrim'; e.innerHTML = '<div class="ring"></div>';
  document.body.appendChild(e);
};
DV.ask = (msg, ok, o) => new Promise(res => {
  o = o || {};
  const s = document.createElement('div');
  s.className = 'scrim';
  s.innerHTML = `<div class="dlg"><p>${DV.esc(msg)}</p><div class="row">${o.cancel === false ? '' : '<button class="btn ghost" data-v="0">Cancel</button>'}<button class="btn ${o.danger ? 'danger' : ''}" data-v="1">${DV.esc(ok || 'OK')}</button></div></div>`;
  s.onclick = e => {
    const b = e.target.closest('button');
    if (b || e.target === s) { s.remove(); res(!!b && b.dataset.v === '1'); }
  };
  document.body.appendChild(s);
});

/* History-aware layers: Android back closes the top modal/drawer first */
DV.stack = [];
DV.push = close => { DV.stack.push({ close }); history.pushState({}, ''); };
addEventListener('popstate', () => { const t = DV.stack.pop(); if (t) t.close(); });
DV.open = (title, html, done) => {
  const m = document.createElement('section');
  m.className = 'modal';
  m.innerHTML = `<header class="bar"><button class="ib" data-back aria-label="Back">${DV.ic('back')}</button><h1>${DV.esc(title)}</h1><span class="ib"></span></header><div class="mbody">${html}</div>`;
  m.querySelector('[data-back]').onclick = () => history.back();
  document.body.appendChild(m);
  DV.push(() => m.remove());
  if (done) done(m);
  return m;
};
