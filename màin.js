/**
 * DV-Utilitiy Main Entry & Lifecycle Coordinator
 */

let deferredPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  enforceAndroidOnly();
  initApp();
  initServiceWorker();
  initInstallPrompt();
});

function enforceAndroidOnly() {
  const blocker = document.getElementById('desktop-blocker');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isAndroid = /android/i.test(navigator.userAgent);

  if (window.innerWidth > 768 || (!isTouchDevice && !isAndroid)) {
    if (blocker) blocker.style.display = 'flex';
  } else {
    if (blocker) blocker.style.display = 'none';
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      if (blocker) blocker.style.display = 'flex';
    } else {
      if (blocker) blocker.style.display = 'none';
    }
  });
}

function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

function initInstallPrompt() {
  const installBtn = document.getElementById('btn-install-app');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'block';
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
          installBtn.style.display = 'none';
        }
      } else {
        showCenterDialog('Install', 'To install DV-Utilitiy on Android: open Chrome menu (3 dots) and tap "Install app" or "Add to Home screen".');
      }
    });
  }
}
