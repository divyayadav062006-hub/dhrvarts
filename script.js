'use strict';

/* ─── Artwork data ───────────────────────────────────────── */
const WHATSAPP = '917999781858';

const artworks = [
  { id: 1, title: "The Elder's Gaze",  medium: 'Graphite on paper',  price: '₹1,999', src: 'granny.jpeg'  },
  { id: 2, title: 'Roar',              medium: 'Charcoal on paper',   price: '₹1,999', src: 'lion.jpeg'    },
  { id: 3, title: 'Bansuri & Feather', medium: 'Graphite on paper',  price: '₹999', src: 'bansuri.jpeg' },
  { id: 4, title: 'Still Life',        medium: 'Graphite on paper',  price: '₹999', src: 'cup.jpeg'     },
  { id: 5, title: 'Harvest',           medium: 'Graphite on paper',  price: '₹499', src: 'grapes.jpeg'  },
  { id: 6, title: 'Elegance',          medium: 'Charcoal on paper',   price: '₹499', src: 'portrait.jpeg'},
];

/* ─── WhatsApp helper ────────────────────────────────────── */
function openWhatsApp(message) {
  window.open(
    'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message),
    '_blank'
  );
}

/* ─── Navbar: scroll state + mobile menu ────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', function () {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  /* Close mobile menu when a link is clicked */
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── Gallery: build cards ───────────────────────────────── */
function buildGallery() {
  const grid = document.getElementById('gallery-grid');

  artworks.forEach(function (art) {
    /* Card wrapper */
    const card = document.createElement('div');
    card.className = 'art-card reveal';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'View ' + art.title);

    /* Image wrapper */
    const wrap = document.createElement('div');
    wrap.className = 'art-card-image-wrap';

    const img = document.createElement('img');
    img.src = art.src;
    img.alt = art.title;
    img.loading = 'lazy';

    /* Hover overlay with zoom icon */
    const overlay = document.createElement('div');
    overlay.className = 'art-card-overlay';
    overlay.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
      '<line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';

    wrap.appendChild(img);
    wrap.appendChild(overlay);

    /* Info row */
    const info = document.createElement('div');
    info.className = 'art-card-info';
    info.innerHTML =
      '<div>' +
        '<h3>' + art.title + '</h3>' +
        '<p class="medium">' + art.medium + '</p>' +
      '</div>' +
      '<span class="art-card-price">' + art.price + '</span>';

    /* Mobile buy button */
    const mobileBtn = document.createElement('button');
    mobileBtn.className = 'btn-outline art-card-mobile-buy';
    mobileBtn.textContent = 'Buy on WhatsApp';
    mobileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openWhatsApp(
          `Hello Sweta, I would like to purchase:

          Artwork: "${art.title}"
          Medium: ${art.medium}
          Price: ${art.price}

          Please find my details below:
          Name:
          Address:
          Phone:
          City:
          Pincode:`);
    });

    card.appendChild(wrap);
    card.appendChild(info);
    card.appendChild(mobileBtn);

    /* Open lightbox on click / Enter key */
    card.addEventListener('click', function () { openLightbox(art); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(art);
      }
    });

    grid.appendChild(card);
  });
}

/* ─── Lightbox ───────────────────────────────────────────── */
function initLightbox() {
  const backdrop  = document.getElementById('lightbox-backdrop');
  const closeBtn  = document.getElementById('lightbox-close');
  const img       = document.getElementById('lightbox-img');
  const title     = document.getElementById('lightbox-title');
  const medium    = document.getElementById('lightbox-medium');
  const price     = document.getElementById('lightbox-price');
  const buyBtn    = document.getElementById('lightbox-buy');

  function closeLightbox() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  window._openLightbox = function (art) {
    img.src       = art.src;
    img.alt       = art.title;
    title.textContent  = art.title;
    medium.textContent = art.medium;
    price.textContent  = art.price;

    buyBtn.onclick = function () {
      openWhatsApp(
         `Hello Sweta, I would like to purchase:

          Artwork: "${art.title}"
          Medium: ${art.medium}
          Price: ${art.price}

          Please find my details below:
          Name:
          Address:
          Phone:
          City:
          Pincode:`);
    };

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  closeBtn.addEventListener('click', closeLightbox);

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
}

function openLightbox(art) {
  window._openLightbox(art);
}

/* ─── Scroll-reveal via IntersectionObserver ─────────────── */
function initReveal() {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          /* Stagger siblings inside a grid/flex parent */
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.children).filter(function (el) {
                return el.classList.contains('reveal') || el.classList.contains('reveal-left');
              })
            : [];
          const idx = siblings.indexOf(entry.target);
          const delay = idx >= 0 ? idx * 70 : 0;

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '-40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left').forEach(function (el) {
    observer.observe(el);
  });
}

/* ─── WhatsApp commission button ─────────────────────────── */
function initContact() {
  const buttons = document.querySelectorAll('.commission-btn');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      openWhatsApp(
`Hello Sweta, I would like to request a custom sketch.

Please find my details below:
Name:
Reference Image (send here):
Sketch Type (portrait/full body):
Size:
Address:
Phone:
City:
Pincode:
Budget:`
      );
    });
  });
}

/* ─── Bootstrap ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  buildGallery();
  initLightbox();
  initContact();
  /* Run reveal after gallery cards are in the DOM */
  requestAnimationFrame(initReveal);
});
