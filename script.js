/**
 * AutoCash Pro — script.js
 * Vanilla JavaScript: navigation, FAQ accordion, counter animation,
 * form validation, scroll reveal, back-to-top, footer year.
 */

'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Select a single element, throw if not found (optional).
 * @param {string} selector
 * @param {Document|Element} [context=document]
 * @returns {Element|null}
 */
const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Select all matching elements as a real Array.
 * @param {string} selector
 * @param {Document|Element} [context=document]
 * @returns {Element[]}
 */
const $$ = (selector, context = document) =>
  Array.from(context.querySelectorAll(selector));


/* ============================================================
   STICKY HEADER — scrolled class
   ============================================================ */

function initStickyHeader() {
  const header = $('#site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 60;

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // run on page load
}


/* ============================================================
   MOBILE NAVIGATION — hamburger toggle & auto-close
   ============================================================ */

function initMobileNavigation() {
  const toggle = $('#mobile-menu-toggle');
  const mobileNav = $('#mobile-navigation');
  if (!toggle || !mobileNav) return;

  const openMenu = () => {
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden'; // prevent scroll behind
  };

  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Auto-close when any link is clicked
  $$('.mobile-nav-link, .mobile-nav-cta', mobileNav).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('is-open') &&
      !mobileNav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}


/* ============================================================
   FAQ ACCORDION
   ============================================================ */

function initFaqAccordion() {
  const faqItems = $$('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const answer = item.querySelector('.faq-item__answer');
    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all items
      faqItems.forEach((other) => {
        const otherTrigger = other.querySelector('.faq-item__trigger');
        const otherAnswer = other.querySelector('.faq-item__answer');
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          otherAnswer.hidden = true;
          otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      if (isOpen) {
        item.classList.remove('is-open');
        answer.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        answer.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}


/* ============================================================
   ANIMATED COUNTER — statistics strip
   ============================================================ */

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800; // ms
  const frameDuration = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameDuration);

  let frame = 0;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const tick = () => {
    frame++;
    const progress = easeOutCubic(frame / totalFrames);
    const current = Math.round(progress * target);

    // Format with commas for large numbers
    el.textContent = current >= 1000
      ? current.toLocaleString()
      : current.toString();

    if (frame < totalFrames) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target >= 1000
        ? target.toLocaleString()
        : target.toString();
    }
  };

  requestAnimationFrame(tick);
}

function initStatisticsCounters() {
  const counters = $$('.statistic-number[data-target]');
  if (!counters.length) return;

  let animated = false;

  const statisticsStrip = $('.statistics-strip');
  if (!statisticsStrip) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        counters.forEach((counter) => animateCounter(counter));
        observer.disconnect();
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(statisticsStrip);
}


/* ============================================================
   SCROLL REVEAL ANIMATION
   ============================================================ */

// function initScrollReveal() {
//   const revealEls = $$('.reveal');
//   if (!revealEls.length) return;

//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('is-visible');
//           observer.unobserve(entry.target);
//         }
//       });
//     },
//     { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
//   );

//   revealEls.forEach((el) => observer.observe(el));
// }


/**
 * Add reveal classes to elements that should animate in on scroll.
 * We do this in JS so the HTML stays clean.
 */


// function assignRevealClasses() {
//   const targets = [
//     { selector: '.process-step', baseDelay: 0 },
//     { selector: '.advantage-card', baseDelay: 0 },
//     // { selector: '.service-card', baseDelay: 0 },
//     { selector: '.service-area-card', baseDelay: 0 },
//     { selector: '.customer-testimonial', baseDelay: 0 },
//     { selector: '.faq-item', baseDelay: 0 },
//     { selector: '.statistic-card', baseDelay: 0 },
//   ];

//   targets.forEach(({ selector }) => {
//     $$(selector).forEach((el, index) => {
//       el.classList.add('reveal');
//       const delayClass = `reveal--delay-${Math.min(index + 1, 5)}`;
//       el.classList.add(delayClass);
//     });
//   });
// }


/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */

function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  const SHOW_THRESHOLD = 400;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > SHOW_THRESHOLD) {
        btn.removeAttribute('hidden');
      } else {
        btn.setAttribute('hidden', '');
      }
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ============================================================
   QUOTE FORM — client-side validation
   ============================================================ */

function initQuoteForm() {
  const form = $('#quote-request-form');
  if (!form) return;

  const showFieldError = (field, message) => {
    field.classList.add('form-input--error');
    let errorEl = field.parentElement.querySelector('.form-field-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-field-error';
      errorEl.setAttribute('role', 'alert');
      errorEl.style.cssText = [
        'color: #c83030',
        'font-size: 0.8rem',
        'margin-top: 4px',
        'font-weight: 500',
      ].join(';');
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  };

  const clearFieldError = (field) => {
    field.classList.remove('form-input--error');
    const errorEl = field.parentElement.querySelector('.form-field-error');
    if (errorEl) errorEl.remove();
  };

  const validateField = (field) => {
    clearFieldError(field);
    const value = field.value.trim();

    if (field.hasAttribute('required') && !value) {
      showFieldError(field, 'This field is required.');
      return false;
    }

    if (field.type === 'tel' && value) {
      const phonePattern = /^[0-9+\s\-().]{7,15}$/;
      if (!phonePattern.test(value)) {
        showFieldError(field, 'Please enter a valid phone number.');
        return false;
      }
    }

    if (field.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    return true;
  };

  // Validate on blur for real-time feedback
  $$('.form-input', form).forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('form-input--error')) {
        validateField(field);
      }
    });
  });

  // Handle submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredFields = $$('[required]', form);
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    // Also validate email if it has a value
    const emailField = $('#field-email');
    if (emailField && emailField.value.trim()) {
      if (!validateField(emailField)) isValid = false;
    }

    if (!isValid) {
      const firstError = form.querySelector('.form-input--error');
      if (firstError) firstError.focus();
      return;
    }

    // Success state
    showFormSuccess(form);
  });
}

function showFormSuccess(form) {
  const formWrap = form.closest('.quote-form-wrap');
  if (!formWrap) return;

  formWrap.innerHTML = `
    <div style="
      text-align: center;
    
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    ">
      <div style="
        width: 72px; height: 72px;
        background: rgba(232,69,69,0.12);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 2rem; color: #e84545;
        margin-bottom: 0.5rem;
      ">
        <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
      </div>
      <h3 style="font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:#111118;">
        Quote Request Sent!
      </h3>
      <p style="color:#4a4a5e;line-height:1.7;max-width:380px;">
        Thanks for reaching out. One of our team members will review your vehicle details and
        get back to you with a competitive offer within <strong>30 minutes</strong> during business hours.
      </p>
      <a href="tel:1800227224" class="btn btn--primary" style="margin-top:0.5rem;">
        <i class="fa-solid fa-phone" aria-hidden="true"></i>
        Need it faster? <br> Call 1800 CAR CASH
      </a>
    </div>
  `;
}


/* ============================================================
   ACTIVE NAV LINK — highlight on scroll
   ============================================================ */

function initActiveNavOnScroll() {
  const sections = $$('section[id], footer[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const OFFSET = 100;

  const updateActiveLink = () => {
    let currentId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - OFFSET;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('nav-link--active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('nav-link--active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}


/* ============================================================
   FOOTER YEAR
   ============================================================ */

function setFooterYear() {
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* ============================================================
   SMOOTH SCROLL — for all anchor links (polyfill for Firefox)
   ============================================================ */

function initSmoothScroll() {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = $(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}


/* ============================================================
   INIT — run everything when DOM is ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Assign reveal classes before setting up the observer

  // assignRevealClasses();
  initStickyHeader();
  initMobileNavigation();
  initFaqAccordion();
  initStatisticsCounters();
  // initScrollReveal();
  initBackToTop();
  initQuoteForm();
  initActiveNavOnScroll();
  setFooterYear();
  initSmoothScroll();
});
