/**
 * DV-Utilitiy Main Entry & Lifecycle Coordinator
 */

let deferredPrompt = null;

function enforceAndroidOnly() {
  const blocker = document.getElementById('desktop-blocker');
  if (!blocker) return;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isAndroid = /android/i.test(navigator.userAgent);

  // Allow mobile viewport or Android touch environments
  if (window.innerWidth > 768 && !isTouchDevice && !isAndroid) {
    blocker.style.display = 'flex';
  } else {
    blocker.style.display = 'none';
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && !isTouchDevice && !isAndroid) {
      blocker.style.display = 'flex';
    } else {
      blocker.style.display = 'none';
    }
  });
}

function initServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
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
        if (typeof showCenterDialog === 'function') {
          showCenterDialog('Install App', 'To install DV-Utilitiy on Android: open Chrome menu (3 vertical dots) and tap "Install app" or "Add to Home screen".');
        }
      }
    });
  }
}

// Fail-safe boot sequence (fires whether DOM is already parsed or loading)
function bootSystem() {
  if (window.__dv_booted) return;
  window.__dv_booted = true;

  enforceAndroidOnly();
  if (typeof initApp === 'function') {
    initApp();
  }
  initServiceWorker();
  initInstallPrompt();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootSystem);
} else {
  bootSystem();
}