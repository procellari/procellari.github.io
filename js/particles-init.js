(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof particlesJS !== 'function') return;

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1100;

  const config = {
    particles: {
      number: {
        value: isMobile ? 35 : isTablet ? 55 : 80,
        density: { enable: true, value_area: 900 }
      },
      color: { value: ['#1E90FF', '#0057C8', '#4da3ff'] },
      shape: { type: 'circle' },
      opacity: {
        value: 0.35,
        random: true,
        anim: { enable: true, speed: 0.6, opacity_min: 0.12, sync: false }
      },
      size: {
        value: 2.5,
        random: true,
        anim: { enable: true, speed: 1.5, size_min: 0.8, sync: false }
      },
      line_linked: {
        enable: true,
        distance: isMobile ? 110 : 150,
        color: '#1E90FF',
        opacity: 0.15,
        width: 1
      },
      move: {
        enable: true,
        speed: isMobile ? 0.8 : 1.2,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: !isMobile, mode: 'grab' },
        onclick: { enable: false },
        resize: true
      },
      modes: {
        grab: { distance: 130, line_linked: { opacity: 0.35 } }
      }
    },
    retina_detect: true
  };

  document.querySelectorAll('.particles-bg').forEach((el, i) => {
    if (el.dataset.initialized) return;
    if (!el.id) el.id = 'particles-bg-' + i;
    el.dataset.initialized = 'true';
    particlesJS(el.id, config);
  });
})();
