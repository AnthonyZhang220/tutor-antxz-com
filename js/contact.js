import { getCurrentLang, t } from './lang.js';

const CONTACT_MIN_MESSAGE_LENGTH = 12;
const CONTACT_COOLDOWN_MS = 15000;
let isContactSubmitting = false;

function setContactStatus(message, type = 'info') {
  const statusEl = document.getElementById('contact-status');
  if (!statusEl) return;
  statusEl.textContent = message || '';
  statusEl.classList.remove('is-success', 'is-error', 'is-info');
  if (message) {
    statusEl.classList.add(type === 'success' ? 'is-success' : type === 'error' ? 'is-error' : 'is-info');
  }
}

function setContactSubmittingState(submitting) {
  const submitBtn = document.getElementById('contact-submit');
  if (!submitBtn) return;
  submitBtn.disabled = submitting;
  submitBtn.textContent = submitting ? t('contact.form.sending') : t('contact.form.submit');
}

function validateContactPayload(payload) {
  if (!payload.name || payload.name.length < 1) {
    return t('contact.form.errorName');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email || '')) {
    return t('contact.form.errorEmail');
  }

  if (!payload.subject) {
    return t('contact.form.errorSubject');
  }

  if (!payload.message || payload.message.length < CONTACT_MIN_MESSAGE_LENGTH) {
    return t('contact.form.errorMessage');
  }

  return null;
}

async function sendContactPayload(endpoint, payload) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return { ok: true };
      }

      let errorMessage = '';
      try {
        const data = await response.json();
        if (data?.error) errorMessage = data.error;
      } catch {
        errorMessage = '';
      }

      if (response.status >= 500 && attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 650));
        continue;
      }

      return { ok: false, error: errorMessage || t('contact.form.error') };
    } catch (error) {
      lastError = error;
      if (attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 650));
        continue;
      }
    }
  }

  return { ok: false, error: lastError?.message || t('contact.form.error') };
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (isContactSubmitting) return;

    const now = Date.now();
    const lastSent = Number(localStorage.getItem('contactLastSentAt') || '0');
    if (lastSent && now - lastSent < CONTACT_COOLDOWN_MS) {
      setContactStatus(t('contact.form.cooldown'), 'error');
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: (formData.get('name') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim(),
      subject: (formData.get('subject') || '').toString().trim(),
      message: (formData.get('message') || '').toString().trim(),
      language: getCurrentLang(),
      page: window.location.href,
      userAgent: navigator.userAgent,
      sentAt: new Date().toISOString(),
      website: (formData.get('website') || '').toString().trim(),
    };

    // Honeypot trap: silently succeed for bots.
    if (payload.website) {
      form.reset();
      setContactStatus(t('contact.form.success'), 'success');
      return;
    }

    const validationError = validateContactPayload(payload);
    if (validationError) {
      setContactStatus(validationError, 'error');
      return;
    }

    isContactSubmitting = true;
    setContactStatus('', 'info');
    setContactSubmittingState(true);

    const endpoint = form.dataset.endpoint || '/api/contact';
    const result = await sendContactPayload(endpoint, payload);

    if (result.ok) {
      form.reset();
      localStorage.setItem('contactLastSentAt', String(Date.now()));
      setContactStatus(t('contact.form.success'), 'success');
    } else {
      setContactStatus(result.error || t('contact.form.error'), 'error');
    }

    isContactSubmitting = false;
    setContactSubmittingState(false);
  });
}
