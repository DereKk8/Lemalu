/*
===========================================
LEMALU - TESTIMONIOS (CAROUSEL)
===========================================
Pequeño carrusel con autoplay y controles
*/

(function() {
  const viewport = document.querySelector('.carousel-viewport');
  const track = document.querySelector('.carousel-track');
  const indicators = document.querySelectorAll('.indicator');

  if (!viewport || !track) return;

  // Duplicamos clones al inicio y al final para loop infinito
  const originals = Array.from(track.children);
  originals.forEach((el) => track.appendChild(el.cloneNode(true)));
  originals.forEach((el) => track.insertBefore(el.cloneNode(true), track.firstChild));

  const cards = Array.from(track.children);
  const originalsCount = originals.length;
  let index = originalsCount; // iniciamos en el primer original visible
  let autoplayId = null;
  const gap = 24; // debe coincidir con CSS

  function cardWidth() {
    // Ancho real de una tarjeta (incluye gap virtual)
    const card = cards[0];
    if (!card) return 0;
    const rect = card.getBoundingClientRect();
    return rect.width + gap;
  }

  function normalizeIndex() {
    // Permitir que termine la transición antes de normalizar
    if (index >= originalsCount * 2) {
      setTimeout(() => {
        index = originalsCount;
        const offset = -index * cardWidth();
        track.style.transition = 'none';
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
        requestAnimationFrame(() => {
          track.style.transition = 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)';
        });
      }, 500); // Esperar que termine la transición
    } else if (index < originalsCount) {
      setTimeout(() => {
        index = originalsCount * 2 - 1;
        const offset = -index * cardWidth();
        track.style.transition = 'none';
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
        requestAnimationFrame(() => {
          track.style.transition = 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)';
        });
      }, 500);
    }
  }

  function update() {
    const offset = -index * cardWidth();
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    const logical = (index - originalsCount) % originalsCount;
    const current = (logical + originalsCount) % originalsCount;
    indicators.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
    
    // Normalizar después de la actualización visual
    normalizeIndex();
  }

  function next() {
    index = (index + 1) % cards.length;
    update();
  }

  function prev() {
    index = (index - 1 + cards.length) % cards.length;
    update();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, 2000);
  }

  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = null;
  }

  // Eventos
  // no buttons, navegación por indicadores únicamente

  // Soporte táctil
  let startX = 0;
  let deltaX = 0;
  viewport.addEventListener('touchstart', (e) => {
    stopAutoplay();
    startX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    deltaX = e.touches[0].clientX - startX;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) next(); else prev();
    }
    deltaX = 0;
    startAutoplay();
  });

  // Hover pausa autoplay
  viewport.addEventListener('mouseenter', stopAutoplay);
  viewport.addEventListener('mouseleave', startAutoplay);

  // Indicadores click
  indicators.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      index = i;
      update();
      startAutoplay();
    });
  });

  // Resize
  window.addEventListener('resize', () => {
    update();
  });

  // Init
  // posicion inicial en bloque original
  update();
  startAutoplay();
})();


