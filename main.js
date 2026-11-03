(() => {
  const $ = s => document.querySelector(s), E = DV.esc, ic = DV.ic;

  /* ---- Short-link redirect (runs before the Android guard: it is not app use) ---- */
  const code = new URLSearchParams(location.search).get('c');
  if (code) {
    DV.theme();
    document.body.innerHTML = '<div class="block"><div><div class="ring"></div><p>Redirecting…</p></div></div>';
    api('resolve', { c: code, r: document.referrer.slice(0, 200), u: navigator.userAgent.slice(0, 200) }).then(r => {
      if (r.ok && /^https?:\/\//i.test(r.u)) { location.replace(r.u); return; }
      document.body.innerHTML = `<div class="block"><div>${ic('alert')}<p>${r.e === 'off' ? 'This service is currently unavailable.' : 'This link is invalid or has been disabled.'}</p><a class="btn" href="./">Open DV-Utilitiy</a></div></div>`;
    });
    return;
  }

  if (!DV.guard()) return;
  DV.theme();
  document.querySelectorAll('[data-ic]').forEach(e => (e.innerHTML = ic(e.dataset.ic)));

  /* ---- Swap these with your real details ---- */
  const DEV_PHOTO = '';   // paste developer photo URL
  const TEAM_PHOTO = '';  // paste team photo URL
  const PH = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#CCD0D5"/><circle cx="80" cy="62" r="28" fill="#fff"/><path d="M26 160a54 54 0 0 1 108 0z" fill="#fff"/></svg>');
  const ORG = 'DV-Utilitiy Team';
  const SHARE_TEXT = 'DV-Utilitiy – fast, private URL shortener';
  const MSG = { off: 'Service is currently disabled', url: 'Enter a valid link', blocked: 'This link is not allowed', limit: 'Limit reached. Try again later', net: 'Network error', err: 'Something went wrong' };

  /* ---- Drawers ---- */
  const LEFT = [['about', 'info', 'About the App'], ['dev', 'user', 'About Developer'], ['team', 'team', 'Team'], ['how', 'help', 'How to Use'], ['terms', 'doc', 'Terms of Use'], ['support', 'heart', 'Support Us'], ['contact', 'mail', 'Contact Us']];
  const dh = t => `<div class="dh"><button class="ib" data-back aria-label="Back">${ic('back')}</button><span>${t}</span><span class="ib"></span></div>`;
  $('#dL').innerHTML = dh('DV-Utilitiy') + LEFT.map(x => `<button class="mi" data-k="${x[0]}">${ic(x[1])}<span>${x[2]}</span></button>`).join('');
  $('#dR').innerHTML = `${dh('Menu')}
    <button class="mi" data-r="todo">${ic('list')}<span>To-do-list</span></button>
    <button class="mi" data-r="dark"><span data-theme-ic></span><span>Dark mode</span><span class="sw" role="switch" data-sw="dark" aria-checked="false"></span></button>
    <button class="mi" data-r="share">${ic('android')}<span>Share App</span></button>
    <button class="mi" data-r="install">${ic('download')}<span>Install App</span></button>`;
  DV.theme(DV.ls('dvt') || 'light');

  const drawer = el => {
    el.classList.add('open'); document.body.classList.add('dr');
    DV.push(() => { el.classList.remove('open'); document.body.classList.remove('dr'); });
  };
  $('#bL').onclick = () => drawer($('#dL'));
  $('#bR').onclick = () => drawer($('#dR'));
  $('#sc').onclick = () => history.back();

  /* ---- Stats ---- */
  let S = JSON.parse(DV.ls('dvst') || '{"v":0,"l":0}');
  const paint = () => { const v = $('#sv'), l = $('#sl'); if (v) v.textContent = S.v; if (l) l.textContent = S.l; };
  const save = () => DV.ls('dvst', JSON.stringify(S));
  const DAY = 864e5, HALF = 18e5;
  const due = () => Date.now() - Number(DV.ls('dvf') || 0) >= HALF;
  const sync = view => {
    DV.ls('dvf', String(Date.now()));
    return api(view ? 'view' : 'counts', { d: DV.dev() }).then(r => { if (r.ok) { S = { v: r.v, l: r.l }; save(); paint(); } });
  };
  /* GAS is contacted only by: 1 view per device per 24h, 1 like per device per 24h,
     a scheduled sync at most once per 30 minutes (max 48 a day), shortening a link, opening a short link. */
  if (Date.now() - Number(DV.ls('dvv') || 0) >= DAY) { DV.ls('dvv', String(Date.now())); S.v++; save(); sync(true); }
  else if (due()) sync(false);
  setInterval(() => { if (due()) sync(false); }, HALF);

  /* ---- History of created links ---- */
  const H = () => JSON.parse(DV.ls('dvh') || '[]');
  const base = () => location.origin + location.pathname;
  const copy = t => navigator.clipboard.writeText(t).then(() => DV.toast('Copied'), () => DV.toast('Copy failed', 'err'));
  const linkRow = x => `<div class="card"><p><b>${E(x.l)}</b></p><p class="mut">${E(x.u)}</p><button class="btn" data-copy="${E(x.l)}">${ic('copy')}Copy</button></div>`;

  /* ---- Pages ---- */
  const PAGES = {
    home: () => `<div class="card hero"><div class="stat">${ic('eye')}<span>Views</span><b id="sv">0</b></div><div class="dv"></div><div class="stat">${ic('heart')}<span>Likes</span><b id="sl">0</b></div></div>
      <button class="btn" id="like">${ic('heart')}Like</button>
      <div class="card"><h2>Welcome</h2><p>Turn long links into short, shareable ones in seconds. Open the Editor tab, paste your link and tap Shorten.</p></div>`,
    editor: () => `<div class="card"><label for="u">Long URL</label><input id="u" type="url" inputmode="url" autocomplete="off" placeholder="https://example.com/very/long/link"><button class="btn" id="go">Shorten</button></div><div id="res"></div>`,
    more: () => { const h = H(); return `<div class="card"><h2>My links</h2><p class="mut">Links created on this device.</p></div>${h.length ? h.map(linkRow).join('') + '<button class="btn danger" id="clr">' + ic('trash') + 'Clear history</button>' : '<p class="mut">No links yet.</p>'}`; }
  };
  let page = 'home';
  const go = p => {
    page = p;
    document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.p === p));
    const pg = $('#pg'); pg.innerHTML = PAGES[p](); pg.scrollTop = 0;
    if (p === 'home') paint();
  };
  $('#nav').onclick = e => { const b = e.target.closest('button'); if (b) go(b.dataset.p); };

  $('#pg').onclick = async e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.copy) return copy(t.dataset.copy);
    if (t.id === 'like') {
      if (Date.now() - Number(DV.ls('dvl') || 0) < 864e5) return DV.toast('You already liked in the last 24 hours', 'err');
      DV.ls('dvl', String(Date.now())); S.l++; save(); paint(); DV.toast('Thanks for the like');
      api('like', { d: DV.dev() }).then(r => { if (r.v !== undefined) { S = { v: r.v, l: r.l }; save(); paint(); } });
    }
    if (t.id === 'go') {
      const u = $('#u').value.trim();
      if (!/^https?:\/\/\S{3,}$/i.test(u)) return DV.toast(MSG.url, 'err');
      DV.busy(true); const r = await api('shorten', { u, d: DV.dev() }); DV.busy(false);
      if (!r.ok) return DV.toast(MSG[r.e] || MSG.err, 'err');
      const x = { l: base() + '?c=' + r.c, u };
      DV.ls('dvh', JSON.stringify([x].concat(H()).slice(0, 20)));
      $('#res').innerHTML = linkRow(x); $('#u').value = '';
      DV.toast('Short link created');
    }
    if (t.id === 'clr' && await DV.ask('Delete all saved links on this device?', 'Delete', { danger: true })) { DV.ls('dvh', '[]'); go('more'); DV.toast('History cleared'); }
  };

  /* ---- Left sidebar modals ---- */
  const soc = () => `<div class="soc">
    <a class="sb" href="mailto:info@example.com" aria-label="Gmail">${ic('gmail')}</a>
    <a class="sb" href="https://wa.me/0000000000" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('whatsapp')}</a>
    <a class="sb" href="tel:+0000000000" aria-label="Phone">${ic('phone')}</a>
    <a class="sb" href="https://facebook.com/yourpage" target="_blank" rel="noopener" aria-label="Facebook">${ic('facebook')}</a></div>`;
  const card = (h, ...p) => `<div class="card"><h2>${h}</h2>${p.map(x => `<p>${x}</p>`).join('')}</div>`;
  const person = (id, ring, size, photo, name, role, bio) => `<div class="who"><div class="rw ${ring ? '' : 't'}">${ring ? `<svg class="gear" viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="85" fill="none" stroke="#1877F2" stroke-width="8" stroke-dasharray="9 7"/><circle cx="90" cy="90" r="81" fill="none" stroke="#1877F2" stroke-width="2"/></svg>` : ''}<img class="ph" width="${size}" height="${size}" alt="${name}" src="${photo || PH}"></div>
    <h2>${name}</h2><p class="mut">${role}</p></div><div class="card"><p class="bio clamp">${bio}</p><button class="btn ghost" data-more style="margin:12px 0 0">Show more</button></div>`;

  const MODALS = {
    about: ['About the App', () => card('DV-Utilitiy', 'A fast, private URL shortener from ' + ORG + '. Paste a long link and get a clean short one you can share anywhere.') + card('Our Mission', 'To provide simple, reliable and free digital tools for everyone.') + card('What You Get', 'Instant short links, one-tap copy, a link history on your device, light and dark themes, and installation as an Android app.') + card('Your Privacy', 'We keep only what is needed to route links and count visits. We never sell your data.')],
    dev: ['About Developer', () => person('d', true, 160, DEV_PHOTO, 'Developer Name', 'Lead Developer', 'Hello! I design and build Android-first web apps that are fast, secure and easy to use.\nMy focus is simple tools that work fast, stay secure and respect your data.\nI believe good software should serve people, load quickly on any phone and be easy to use.\nThank you for using DV-Utilitiy and for your feedback.')],
    team: ['Team', () => person('t', false, 150, TEAM_PHOTO, 'Team Member Name', 'Role / Department', 'Short introduction of this team member goes here.\nThey support the project with design, testing and community care.\nAdd a few lines about experience, passion and how they serve the mission.\nReplace this text with the real biography.')],
    how: ['How to Use', () => card('Shorten a link', '1. Tap Editor in the bottom bar.', '2. Paste your long link starting with http:// or https://.', '3. Tap Shorten.', '4. Tap Copy and share your new short link.') + card('Other tips', 'Open More to see links created on this device.', 'Use the three-dot menu for dark mode, sharing and installing the app.', 'Tap Like on Home once every 24 hours to support us.')],
    terms: ['Terms of Use', () => card('1. Acceptance', 'By using DV-Utilitiy you agree to these terms.') + card('2. Acceptable use', 'Do not shorten links to illegal, harmful, deceptive, adult or spam content. Blocked domains and keywords may be rejected.') + card('3. Availability', 'The service is provided as is and may be paused or limited at any time.') + card('4. Removal', 'We may disable any link that breaks these terms without notice.') + card('5. Changes', 'We may update these terms. Continued use means you accept the changes.')],
    support: ['Support Us', () => card('Support the Mission', 'DV-Utilitiy is free to use. Your feedback and sharing help ' + ORG + ' keep improving the app.') + soc() + card('Ways to help', 'Share the app with friends.', 'Send feedback or ideas.', 'Reach out through the contact channels above.')],
    contact: ['Contact Us', () => card('We would love to hear from you', 'Reach ' + ORG + ' through any channel below.') + soc() + card('Details', 'Address: Your Street, Your City, Your Country', 'Hours: Mon – Fri, 9:00 – 17:00')]
  };
  const bindMore = m => {
    m.querySelectorAll('img').forEach(i => (i.onerror = () => { i.onerror = null; i.src = PH; }));
    m.querySelectorAll('[data-more]').forEach(b => (b.onclick = () => { const c = b.previousElementSibling.classList.toggle('clamp'); b.textContent = c ? 'Show more' : 'Show less'; }));
  };
  $('#dL').onclick = e => { if (e.target.closest('[data-back]')) return history.back(); const b = e.target.closest('[data-k]'); if (!b) return; const d = MODALS[b.dataset.k]; DV.open(d[0], d[1](), bindMore); };

  /* ---- Right sidebar ---- */
  let ip = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); ip = e; });

  const todo = () => {
    const T = () => JSON.parse(DV.ls('dvtd') || '[]'), W = a => DV.ls('dvtd', JSON.stringify(a));
    const m = DV.open('To-do-list', `<div class="row2"><input id="ti" maxlength="200" placeholder="New task"><button class="btn sm" id="ta">Add</button></div><div id="tl"></div>`);
    const draw = () => { const a = T(); m.querySelector('#tl').innerHTML = a.length ? a.map((x, i) => `<div class="card row2"><button class="ib ck" data-c="${i}" aria-label="Toggle">${ic(x.d ? 'check' : 'circle')}</button><span class="${x.d ? 'done' : ''}">${E(x.t)}</span><button class="ib" data-x="${i}" aria-label="Delete">${ic('trash')}</button></div>`).join('') : '<p class="mut">No tasks yet.</p>'; };
    const add = () => { const i = m.querySelector('#ti'), t = i.value.trim(); if (!t) return DV.toast('Type a task first', 'err'); W(T().concat({ t, d: 0 })); i.value = ''; draw(); };
    m.onclick = async e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.id === 'ta') return add();
      const a = T();
      if (b.dataset.c !== undefined) { a[b.dataset.c].d = a[b.dataset.c].d ? 0 : 1; W(a); draw(); }
      if (b.dataset.x !== undefined && await DV.ask('Delete this task?', 'Delete', { danger: true })) { a.splice(b.dataset.x, 1); W(a); draw(); DV.toast('Task deleted'); }
    };
    m.querySelector('#ti').onkeydown = e => { if (e.key === 'Enter') add(); };
    draw();
  };

  const share = () => {
    const u = base(), enc = encodeURIComponent, native = () => (navigator.share ? navigator.share({ title: 'DV-Utilitiy', text: SHARE_TEXT, url: u }).catch(() => {}) : copy(u));
    const C = [['whatsapp', 'WhatsApp', () => open('https://wa.me/?text=' + enc(SHARE_TEXT + ' ' + u), '_blank', 'noopener')],
      ['facebook', 'Facebook', () => open('https://www.facebook.com/sharer/sharer.php?u=' + enc(u), '_blank', 'noopener')],
      ['twitter', 'Twitter', () => open('https://twitter.com/intent/tweet?text=' + enc(SHARE_TEXT) + '&url=' + enc(u), '_blank', 'noopener')],
      ['bluetooth', 'Bluetooth', native], ['android', 'Android share sheet', native]];
    const m = DV.open('Share App', C.map((c, i) => `<button class="sh" data-i="${i}">${ic(c[0])}<span>${c[1]}</span></button>`).join(''));
    m.onclick = e => { const b = e.target.closest('[data-i]'); if (b) C[b.dataset.i][2](); };
  };

  $('#dR').onclick = async e => {
    if (e.target.closest('[data-back]')) return history.back();
    const b = e.target.closest('[data-r]'); if (!b) return;
    const r = b.dataset.r;
    if (r === 'todo') todo();
    if (r === 'dark') DV.toggleTheme();
    if (r === 'share') share();
    if (r === 'install') {
      if (matchMedia('(display-mode: standalone)').matches) return DV.ask('The app is already installed.', 'OK', { cancel: false });
      if (ip) { ip.prompt(); ip = null; }
      else DV.ask('Open the Chrome menu (three dots) and tap "Install app" or "Add to Home screen".', 'OK', { cancel: false });
    }
  };

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
  go('home');
})();
