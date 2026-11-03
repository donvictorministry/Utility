const API_URL = 'https://script.google.com/macros/s/AKfycbyaeMDgxFd15W5vx8Mwj6hHyBktbQ40Laqcl6K9XkYS2I0Rxl5YdF3AFwiHBuG9yLISKg/exec';

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
