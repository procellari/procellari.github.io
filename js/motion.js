(function () {
  const player = document.getElementById('mg-player');
  if (!player) return;

  const toggle = player.querySelector('.mg-toggle');
  const timeEl = player.querySelector('.mg-time');
  const indicator = player.querySelector('.mg-scene-indicator');
  const DURATION = 30;

  const scenes = [
    { label: 'Intro', start: 0, end: 5 },
    { label: 'Our Process', start: 5, end: 13 },
    { label: 'Services', start: 13, end: 22 },
    { label: 'Technology', start: 22, end: 30 }
  ];

  let startTime = performance.now();
  let paused = false;
  let pausedAt = 0;
  let elapsed = 0;

  function currentElapsed() {
    if (paused) return elapsed;
    return (performance.now() - startTime) / 1000;
  }

  function updateUI() {
    const t = currentElapsed() % DURATION;
    const mm = String(Math.floor(t / 60)).padStart(2, '0');
    const ss = String(Math.floor(t % 60)).padStart(2, '0');
    if (timeEl) timeEl.textContent = `${mm}:${ss} / 0:30`;

    const scene = scenes.find(s => t >= s.start && t < s.end) || scenes[0];
    if (indicator) indicator.textContent = scene.label;
  }

  function tick() {
    updateUI();
    if (!paused) requestAnimationFrame(tick);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      paused = !paused;
      player.classList.toggle('paused', paused);
      toggle.textContent = paused ? '▶' : '⏸';
      toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');

      if (paused) {
        elapsed = (performance.now() - startTime) / 1000;
        pausedAt = performance.now();
      } else {
        startTime = performance.now() - elapsed * 1000;
        requestAnimationFrame(tick);
      }
    });
    toggle.textContent = '⏸';
  }

  requestAnimationFrame(tick);
})();
