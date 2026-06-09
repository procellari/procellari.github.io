document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });

  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('.card-grid, .tech-grid, .process-grid, .portfolio-grid, .blog-grid, .perk-grid')
    .forEach(grid => {
      if (!grid.classList.contains('fade-in')) grid.classList.add('fade-in');
      grid.classList.add('stagger-children');
    });

  document.querySelectorAll('.job-item').forEach((item, i) => {
    item.classList.add('fade-in');
    item.style.transitionDelay = `${i * 0.08}s`;
  });

  document.querySelectorAll('.case-study-card').forEach((card, i) => {
    card.classList.add('fade-in');
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  const aboutGrid = document.querySelector('.about-grid');
  if (aboutGrid) {
    const [left, right] = aboutGrid.children;
    if (left) left.classList.add('fade-in-left');
    if (right) right.classList.add('fade-in-right');
  }

  const contactGrid = document.querySelector('.contact-grid');
  if (contactGrid) {
    const [info, form] = contactGrid.children;
    if (info) info.classList.add('fade-in-left');
    if (form) form.classList.add('fade-in-right');
  }

  const animatedSelectors = '.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-children';
  const animatedElements = document.querySelectorAll(animatedSelectors);

  if (animatedElements.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          el.classList.add('visible');

          if (el.classList.contains('stagger-children')) {
            [...el.children].forEach((child, i) => {
              child.style.animationDelay = `${i * 0.08}s`;
            });
          }

          if (el.querySelector('.stat-item strong')) {
            animateCounters(el);
          }

          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    animatedElements.forEach(el => observer.observe(el));

    document.querySelectorAll('.hero-stats').forEach(stats => {
      const statObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCounters(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      statObserver.observe(stats);
    });
  }

  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterItems = document.querySelectorAll('[data-category]');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.filter;

      filterItems.forEach(item => {
        const show = category === 'all' || item.dataset.category === category;
        item.classList.toggle('filter-hide', !show);
        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          setTimeout(() => {
            if (item.classList.contains('filter-hide')) {
              item.style.display = 'none';
            }
          }, 400);
        }
      });
    });
  });

  document.querySelectorAll('.card-link').forEach(link => {
    if (link.textContent.includes('→') && !link.querySelector('.arrow')) {
      link.innerHTML = link.innerHTML.replace('→', '<span class="arrow">→</span>');
    }
  });

  document.querySelectorAll('.custom-select').forEach(initCustomSelect);

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
        contactForm.querySelectorAll('.custom-select').forEach(syncCustomSelect);
      }, 3000);
    });
  }
});

function initCustomSelect(wrapper) {
  const select = wrapper.querySelector('select');
  const trigger = wrapper.querySelector('.custom-select-trigger');
  const label = trigger.querySelector('.custom-select-label');
  const menu = wrapper.querySelector('.custom-select-menu');

  if (!select || !trigger || !menu) return;

  menu.innerHTML = '';
  [...select.options].forEach((opt, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.dataset.value = opt.value;
    li.textContent = opt.textContent;
    if (i === select.selectedIndex) li.classList.add('selected');
    li.addEventListener('click', () => setValue(opt.value));
    menu.appendChild(li);
  });

  function setValue(value) {
    select.value = value;
    const opt = select.options[select.selectedIndex];
    label.textContent = opt ? opt.textContent : 'Select a service';
    menu.querySelectorAll('li').forEach(li => {
      li.classList.toggle('selected', li.dataset.value === value);
    });
    close();
  }

  function open() {
    wrapper.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
  }

  function close() {
    wrapper.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  }

  function toggle() {
    wrapper.classList.contains('open') ? close() : open();
  }

  trigger.addEventListener('click', toggle);

  document.addEventListener('click', e => {
    if (!wrapper.contains(e.target)) close();
  });

  trigger.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  wrapper._syncCustomSelect = () => setValue(select.value || '');
}

function syncCustomSelect(wrapper) {
  if (wrapper._syncCustomSelect) wrapper._syncCustomSelect();
}

function animateCounters(container) {
  container.querySelectorAll('.stat-item strong, .case-metrics .metric strong').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const text = el.textContent.trim();
    const match = text.match(/^([\d,.]+)(.*)$/);
    if (!match) return;

    const target = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2];
    const isDecimal = match[1].includes('.');
    const duration = 1800;
    const start = performance.now();

    el.classList.add('counting');
    el.textContent = '0' + suffix;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = target * eased;

      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else if (target >= 1000) {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = text;
    }

    requestAnimationFrame(tick);
  });
}
