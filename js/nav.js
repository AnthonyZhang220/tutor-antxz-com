export function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navbar-links');
  if (!hamburger || !navLinks) return;

  const setMenuState = isOpen => {
    navLinks.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.classList.toggle('menu-open', isOpen);
  };

  hamburger.addEventListener('click', () => {
    const isOpen = !navLinks.classList.contains('open');
    setMenuState(isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) {
      setMenuState(false);
    }
  });
}

export function initSubjectsDropdown() {
  const dropdown = document.getElementById('subjects-dropdown');
  const toggle = document.getElementById('subjects-dropdown-toggle');
  const navLinks = document.getElementById('navbar-links');
  if (!dropdown || !toggle || !navLinks) return;

  const closeDropdown = () => {
    dropdown.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', e => {
    e.preventDefault();
    const willOpen = !dropdown.classList.contains('open');
    dropdown.classList.toggle('open', willOpen);
    toggle.setAttribute('aria-expanded', willOpen.toString());
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeDropdown();
    });
  });

  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });
}

export function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.navbar-links a[href^="#"]');

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
