/**
 * DV-Utilitiy Zero-Dependency Network Client
 */

const ApiClient = (() => {
  // Update this endpoint with your deployed Google Apps Script Web App URL
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_EXEC_ID/exec';

  async function postRequest(payload) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      return { success: false, error: 'Communication error with backend worker.' };
    }
  }

  return {
    getEndpoint: () => SCRIPT_URL,

    getPublicStats: async () => {
      return await postRequest({ action: 'getPublicStats' });
    },

    incrementLike: async () => {
      return await postRequest({ action: 'incrementLike' });
    },

    incrementView: async () => {
      return await postRequest({ action: 'incrementView' });
    },

    shortenUrl: async (longUrl) => {
      return await postRequest({ action: 'shorten', url: longUrl });
    },

    requestOtp: async () => {
      return await postRequest({ action: 'requestOtp' });
    },

    verifyOtp: async (code) => {
      return await postRequest({ action: 'verifyOtp', otp: code });
    },

    getAdminMetrics: async (token) => {
      return await postRequest({ action: 'getAdminMetrics', sessionToken: token });
    },

    toggleSystem: async (token, state) => {
      return await postRequest({ action: 'toggleSystem', sessionToken: token, enabled: state });
    }
  };
})();