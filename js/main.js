import { applyLanguage, getCurrentLang, toggleLanguage } from './lang.js';
import { initContactForm } from './contact.js';
import { initHamburger, initScrollSpy, initSubjectsDropdown } from './nav.js';
import { initRevealAnimations } from './reveal.js';

export function initApp() {
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleLanguage);
  }

  applyLanguage(getCurrentLang());

  initHamburger();
  initSubjectsDropdown();
  initScrollSpy();
  initRevealAnimations();
  initContactForm();
}
