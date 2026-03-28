/**
 * script.js — Anthony Zhang Tutoring Website
 *
 * Features:
 *  - Bilingual language toggle (English / 中文)
 *  - Language preference persisted in localStorage
 *  - All UI strings stored in the `i18n` object below for easy editing
 *  - Hamburger / mobile-nav toggle
 *  - Sticky-navbar active link highlighting on scroll
 */

'use strict';

/* ============================================================
   LANGUAGE STRINGS
   Add or edit translations here. Every key used as
   data-i18n="…" or data-i18n-placeholder="…" in HTML must
   have an entry for both "en" and "zh".
   ============================================================ */
const i18n = {
  en: {
    // Navbar
    'nav.logo':     'Anthony Zhang',
    'nav.about':    'About',
    'nav.subjects': 'Subjects',
    'nav.why':      'Why Me',
    'nav.contact':  'Contact',

    // Hero
    'hero.eyebrow': 'Professional Tutor',
    'hero.title':   'Expert Tutoring in\nChinese & Math',
    'hero.tagline': 'Let\'s learn together.',
    'hero.cta':     'Book a Session',

    // About
    'about.title': 'About Me',
    'about.p1':    'Hi! I\'m <strong>Anthony Zhang</strong>, a native Mandarin Chinese speaker and a Mathematics graduate from <strong>New York University (NYU)</strong>.',
    'about.p2':    'I\'m passionate about making both language and mathematics accessible, engaging, and rewarding for every student — from beginners finding their footing to advanced learners aiming for top scores.',
    'about.p3':    'Whether you want to ace AP Chinese, conquer the HSK, or finally master algebra, I\'ll build a personalised learning plan just for you.',

    // Subjects
    'subjects.title':        'Subjects',
    'subjects.chinese.title': 'Mandarin Chinese',
    'subjects.chinese.l1':   'Chinese 1, 2, 3, 4',
    'subjects.chinese.l2':   'AP Chinese Language & Culture',
    'subjects.chinese.l3':   'HSK — All Levels (HSK 1–6)',
    'subjects.math.title':   'Mathematics',
    'subjects.math.l1':      'Elementary Math',
    'subjects.math.l2':      'Middle School Math',
    'subjects.math.l3':      'High School Math',

    // Why Choose Me
    'why.title':      'Why Choose Me',
    'why.w1.title':   'Native Mandarin Speaker',
    'why.w1.desc':    'Authentic pronunciation, idiomatic usage, and cultural context you won\'t get from a textbook.',
    'why.w2.title':   'NYU Math Graduate',
    'why.w2.desc':    'Rigorous academic training from New York University with a degree in Mathematics.',
    'why.w3.title':   'Personalised Lesson Plans',
    'why.w3.desc':    'Every student is different — sessions are tailored to your goals, pace, and learning style.',
    'why.w4.title':   'Patient & Encouraging',
    'why.w4.desc':    'A supportive, low-pressure environment where questions are always welcome.',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.sub':   'Ready to start? Fill in the form below and I\'ll get back to you within 24 hours.',
    'contact.form.name':            'Name',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.email':           'Email',
    'contact.form.emailPlaceholder':'you@example.com',
    'contact.form.subject':         'Subject',
    'contact.form.subjectDefault':  'Select a subject…',
    'contact.form.subjectChinese':  'Chinese Tutoring',
    'contact.form.subjectMath':     'Math Tutoring',
    'contact.form.subjectOther':    'Other',
    'contact.form.message':         'Message',
    'contact.form.messagePlaceholder': 'Tell me a bit about what you\'re looking for…',
    'contact.form.submit':          'Send Message',

    // Footer
    'footer.copy': '© 2026 Anthony Zhang · tutor.antxz.com',
  },

  zh: {
    // Navbar
    'nav.logo':     '张老师',
    'nav.about':    '关于我',
    'nav.subjects': '辅导科目',
    'nav.why':      '为什么选我',
    'nav.contact':  '联系我',

    // Hero
    'hero.eyebrow': '专业辅导老师',
    'hero.title':   '专业中文与数学辅导',
    'hero.tagline': '让我们一起学习。',
    'hero.cta':     '预约课程',

    // About
    'about.title': '关于我',
    'about.p1':    '您好！我是<strong>张明远（Anthony Zhang）</strong>，普通话母语者，毕业于<strong>纽约大学（NYU）数学系</strong>。',
    'about.p2':    '我热衷于让每位学生都能轻松、愉快地学习语言和数学——无论是初学者还是希望冲击高分的优秀学生。',
    'about.p3':    '无论您希望在AP中文考试中取得佳绩、攻克HSK各级别，还是彻底掌握代数，我都会为您量身定制专属学习计划。',

    // Subjects
    'subjects.title':        '辅导科目',
    'subjects.chinese.title': '中文',
    'subjects.chinese.l1':   '中文一、二、三、四',
    'subjects.chinese.l2':   'AP中文语言与文化',
    'subjects.chinese.l3':   'HSK — 全级别（HSK 1–6级）',
    'subjects.math.title':   '数学',
    'subjects.math.l1':      '小学数学',
    'subjects.math.l2':      '初中数学',
    'subjects.math.l3':      '高中数学',

    // Why Choose Me
    'why.title':      '为什么选择我',
    'why.w1.title':   '普通话母语者',
    'why.w1.desc':    '地道发音、惯用表达与文化背景，是教材无法替代的真实语言体验。',
    'why.w2.title':   'NYU数学系毕业',
    'why.w2.desc':    '来自纽约大学的严格学术训练，数学功底扎实，讲解深入浅出。',
    'why.w3.title':   '量身定制学习计划',
    'why.w3.desc':    '每位学生各有不同——课程内容将根据您的目标、节奏和学习风格灵活调整。',
    'why.w4.title':   '耐心鼓励的教学风格',
    'why.w4.desc':    '轻松无压力的学习环境，任何问题都随时欢迎提问。',

    // Contact
    'contact.title': '联系我',
    'contact.sub':   '准备好了吗？填写以下表格，我将在24小时内回复您。',
    'contact.form.name':            '姓名',
    'contact.form.namePlaceholder': '请输入您的姓名',
    'contact.form.email':           '电子邮箱',
    'contact.form.emailPlaceholder':'your@email.com',
    'contact.form.subject':         '辅导科目',
    'contact.form.subjectDefault':  '请选择科目…',
    'contact.form.subjectChinese':  '中文辅导',
    'contact.form.subjectMath':     '数学辅导',
    'contact.form.subjectOther':    '其他',
    'contact.form.message':         '留言',
    'contact.form.messagePlaceholder': '请简单描述您的需求…',
    'contact.form.submit':          '发送消息',

    // Footer
    'footer.copy': '© 2026 张明远（Anthony Zhang）· tutor.antxz.com',
  },
};

/* ============================================================
   LANGUAGE TOGGLE
   ============================================================ */
let currentLang = localStorage.getItem('lang') || 'en';

/**
 * Apply all translations for the given language.
 * Elements are identified by data-i18n (text content / innerHTML)
 * and data-i18n-placeholder (placeholder attribute).
 */
function applyLanguage(lang) {
  const strings = i18n[lang];
  if (!strings) return;

  // Update text/HTML content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (strings[key] !== undefined) {
      el.innerHTML = strings[key].replace(/\n/g, '<br>');
    }
  });

  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (strings[key] !== undefined) {
      el.setAttribute('placeholder', strings[key]);
    }
  });

  // Update the toggle button label to show the OTHER language
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = lang === 'en' ? '中文' : 'English';
    toggleBtn.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : '切换为英文');
  }

  // Set lang attribute on <html> for accessibility and font rendering
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : 'en');

  // Toggle body class so CSS can load the correct font stack
  document.body.classList.toggle('lang-zh', lang === 'zh');
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  localStorage.setItem('lang', currentLang);
  applyLanguage(currentLang);
}

/* ============================================================
   HAMBURGER / MOBILE NAV
   ============================================================ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navbar-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.navbar-links a[href^="#"]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Language toggle button
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleLanguage);

  // Apply saved or default language
  applyLanguage(currentLang);

  // Hamburger menu
  initHamburger();

  // Scroll spy for active nav link
  initScrollSpy();
});
