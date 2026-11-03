const API_URL = 'PASTE_WEB_APP_URL_HERE';

async function api(a, d) {
  try {
    const r = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ a }, d)),
      keepalive: true
    });
    return await r.json();
  } catch (e) {
    return { ok: false, e: 'net' };
  }
}
