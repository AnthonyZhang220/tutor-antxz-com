import { i18n } from './i18n.js';

let currentLang = localStorage.getItem('lang') || 'en';

export function getCurrentLang() {
  return currentLang;
}

export function t(key) {
  return i18n[currentLang]?.[key] ?? i18n.en[key] ?? key;
}

export function applyLanguage(lang) {
  const strings = i18n[lang];
  if (!strings) return;

  currentLang = lang;
  localStorage.setItem('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (strings[key] !== undefined) {
      el.innerHTML = strings[key].replace(/\n/g, '<br>');
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (strings[key] !== undefined) {
      el.setAttribute('placeholder', strings[key]);
    }
  });

  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = lang === 'en' ? '中文' : 'English';
    toggleBtn.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : '切换为英文');
  }

  const metaTitle = strings['meta.title'];
  if (metaTitle) {
    document.title = metaTitle;
  }

  const metaDesc = strings['meta.description'];
  if (metaDesc) {
    const descriptionEl = document.querySelector('meta[name="description"]');
    if (descriptionEl) {
      descriptionEl.setAttribute('content', metaDesc);
    }
  }

  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : 'en');
  document.body.classList.toggle('lang-zh', lang === 'zh');
}

export function toggleLanguage() {
  const next = currentLang === 'en' ? 'zh' : 'en';
  applyLanguage(next);
}
