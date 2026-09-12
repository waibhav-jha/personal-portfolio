/**
 * WAIBHAV JHA — EDITORIAL ENGINEERING PORTFOLIO CLIENT ENGINE
 * 
 * Palette Alignment:
 * - Palladian: #EEE9DF
 * - Oatmeal: #C9C1B1
 * - Blue Fantastic: #2C3B4D
 * - Burning Flame: #FFB162
 * - Truffle Trouble: #A35139
 * - Abyssal Anchorfish Blue: #1B2632
 * 
 * Modules:
 * 1. Sculptural Architecture & Fluid Field Canvas (Hero Right Visual)
 * 2. Lenis Smooth Scroll & GSAP Integration
 * 3. Interactive Systems Dossier Tabs
 * 4. BibTeX Citation Drawer & Clipboard Utility
 * 5. Magnetic Pointer Micro-Interactions
 * 6. Atmospheric Cursor Dot
 * 7. GSAP Scroll Reveal Triggers
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ==========================================================================
  // 1. SCULPTURAL ARCHITECTURAL SLIT & FLUID VECTOR SIMULATION (HERO CANVAS)
  // ==========================================================================
  function initSculpturalCanvas() {
    const canvas = document.getElementById('sculptural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frame = canvas.parentElement;
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    // Interactive pointer for vortex disturbance over the sculptural frame
    const pointer = {
      x: width * 0.5,
      y: height * 0.5,
      vx: 0,
      vy: 0,
      lastX: width * 0.5,
      lastY: height * 0.5,
      active: false,
    };

    frame.addEventListener('pointermove', (e) => {
      const rect = frame.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      pointer.vx = (currentX - pointer.lastX) * 0.4;
      pointer.vy = (currentY - pointer.lastY) * 0.4;
      pointer.lastX = currentX;
      pointer.lastY = currentY;
      pointer.x = currentX;
      pointer.y = currentY;
      pointer.active = true;
    }, { passive: true });

    frame.addEventListener('pointerleave', () => {
      pointer.active = false;
    });

    // Particle pool for velocity streamline vectors
    const PARTICLE_COUNT = 65;
    const particles = [];

    // Colors strictly from reference palette
    const colors = [
      { r: 163, g: 81, b: 57 },   // Truffle Trouble
      { r: 255, g: 177, b: 98 },  // Burning Flame
      { r: 44, g: 59, b: 77 },    // Blue Fantastic
      { r: 27, g: 38, b: 50 },    // Abyssal Navy
    ];

    class FlowParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.baseSpeed = 0.6 + Math.random() * 0.9;
        this.angle = Math.PI * 0.28 + (Math.random() - 0.5) * 0.35; // Laminar descent angle
        this.vx = Math.cos(this.angle) * this.baseSpeed;
        this.vy = Math.sin(this.angle) * this.baseSpeed;
        this.history = [];
        this.maxHistory = 8 + Math.floor(Math.random() * 8);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = initial ? Math.random() * 0.35 + 0.1 : 0;
        this.targetAlpha = 0.2 + Math.random() * 0.45;
        this.width = Math.random() < 0.2 ? 1.4 : 0.8;
      }

      update() {
        if (this.alpha < this.targetAlpha) {
          this.alpha += 0.015;
        }

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxHistory) {
          this.history.shift();
        }

        // Pointer fluid perturbation (vorticity curl)
        if (pointer.active) {
          const dx = pointer.x - this.x;
          const dy = pointer.y - this.y;
          const distSq = dx * dx + dy * dy;
          const radius = 140;

          if (distSq < radius * radius && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / radius) * 0.22;
            this.vx += (-dy / dist) * force * 2.2 + pointer.vx * 0.08;
            this.vy += (dx / dist) * force * 2.2 + pointer.vy * 0.08;
          }
        }

        // Laminar restoration
        const targetVx = Math.cos(this.angle) * this.baseSpeed;
        const targetVy = Math.sin(this.angle) * this.baseSpeed;
        this.vx += (targetVx - this.vx) * 0.03;
        this.vy += (targetVy - this.vy) * 0.03;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20 || this.x > width + 20 || this.y > height + 20) {
          this.reset(false);
        }
      }

      draw(c) {
        if (this.history.length < 2) return;

        c.beginPath();
        c.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 1; i < this.history.length; i++) {
          c.lineTo(this.history[i].x, this.history[i].y);
        }
        c.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        c.lineWidth = this.width;
        c.lineCap = 'round';
        c.stroke();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new FlowParticle());
    }

    // Draw the architectural dimensional background inspired by Image 1
    function drawArchitecturalBackground() {
      // 1. Base split background
      const midX = width * 0.48;

      // Left panel (Palladian ivory into subtle warm burning flame)
      const gradLeft = ctx.createLinearGradient(0, 0, 0, height);
      gradLeft.addColorStop(0, '#F4F0E8');
      gradLeft.addColorStop(0.55, '#EEE9DF');
      gradLeft.addColorStop(1, '#FFC993');
      ctx.fillStyle = gradLeft;
      ctx.fillRect(0, 0, midX, height);

      // Right panel (Oatmeal sand into truffle terracotta)
      const gradRight = ctx.createLinearGradient(midX, 0, width, height);
      gradRight.addColorStop(0, '#D8D1C3');
      gradRight.addColorStop(0.5, '#C9C1B1');
      gradRight.addColorStop(1, '#B9654C');
      ctx.fillStyle = gradRight;
      ctx.fillRect(midX, 0, width - midX, height);

      // 2. Soft atmospheric radiant bloom at lower split
      const radialGlow = ctx.createRadialGradient(midX, height * 0.85, 20, midX, height * 0.85, width * 0.6);
      radialGlow.addColorStop(0, 'rgba(255, 177, 98, 0.45)');
      radialGlow.addColorStop(0.5, 'rgba(163, 81, 57, 0.2)');
      radialGlow.addColorStop(1, 'rgba(238, 233, 223, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Precision architectural vertical slit & shadow crease (matching Image 1 bottom cards)
      const slitTop = height * 0.22;
      const slitBottom = height * 0.88;

      // Deep crevice shadow
      const shadowGrad = ctx.createLinearGradient(midX - 22, 0, midX, 0);
      shadowGrad.addColorStop(0, 'rgba(27, 38, 50, 0)');
      shadowGrad.addColorStop(1, 'rgba(27, 38, 50, 0.22)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(midX - 22, slitTop, 22, slitBottom - slitTop);

      // Razor-fine cut highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(midX + 1, slitTop);
      ctx.lineTo(midX + 1, slitBottom);
      ctx.stroke();

      // Razor-fine shadow line
      ctx.strokeStyle = 'rgba(27, 38, 50, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(midX, slitTop + 10);
      ctx.lineTo(midX, slitBottom - 10);
      ctx.stroke();

      // Top pinch shadow
      const pinchGrad = ctx.createRadialGradient(midX, slitTop, 1, midX, slitTop, 18);
      pinchGrad.addColorStop(0, 'rgba(27, 38, 50, 0.35)');
      pinchGrad.addColorStop(1, 'rgba(27, 38, 50, 0)');
      ctx.fillStyle = pinchGrad;
      ctx.fillRect(midX - 18, slitTop - 18, 36, 36);

      // Bottom pinch shadow
      const pinchBottomGrad = ctx.createRadialGradient(midX, slitBottom, 1, midX, slitBottom, 20);
      pinchBottomGrad.addColorStop(0, 'rgba(27, 38, 50, 0.3)');
      pinchBottomGrad.addColorStop(1, 'rgba(27, 38, 50, 0)');
      ctx.fillStyle = pinchBottomGrad;
      ctx.fillRect(midX - 20, slitBottom - 20, 40, 40);
    }

    function renderLoop() {
      if (isVisible && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        // Draw architectural background fold
        drawArchitecturalBackground();

        // Decay mouse velocity
        pointer.vx *= 0.92;
        pointer.vy *= 0.92;

        // Draw fluid streamline particles
        if (!prefersReducedMotion) {
          for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw(ctx);
          }
        }
      }
      requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  // ==========================================================================
  // 2. LENIS SMOOTH SCROLL & GSAP TICKER INTEGRATION
  // ==========================================================================
  let lenisInstance = null;

  function initSmoothScroll() {
    if (prefersReducedMotion || typeof window.Lenis === 'undefined') return;

    try {
      lenisInstance = new window.Lenis({
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      });

      if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
        window.gsap.registerPlugin(window.ScrollTrigger);
        lenisInstance.on('scroll', window.ScrollTrigger.update);

        window.gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });

        window.gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      // Smooth internal anchor scrolling
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              lenisInstance.scrollTo(targetEl, { offset: -80, duration: 1.2 });
            }
          }
        });
      });
    } catch (e) {
      console.warn('Smooth scroll setup bypassed:', e);
    }
  }

  // ==========================================================================
  // 3. INTERACTIVE SYSTEMS DOSSIER TABS
  // ==========================================================================
  function initDossierTabs() {
    const dossiers = document.querySelectorAll('.item-dossier-pane');

    dossiers.forEach((dossier) => {
      const tabs = dossier.querySelectorAll('.tab-trigger');
      const panels = dossier.querySelectorAll('.dossier-view');

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          const targetPanelId = tab.getAttribute('data-tab');

          tabs.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });

          panels.forEach((p) => {
            p.classList.remove('active');
          });

          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          const targetPanel = dossier.querySelector(`.dossier-view[data-panel="${targetPanelId}"]`);
          if (targetPanel) {
            targetPanel.classList.add('active');
          }
        });

        // Accessible keyboard arrow navigation
        tab.addEventListener('keydown', (e) => {
          let nextTab = null;
          if (e.key === 'ArrowRight') {
            nextTab = tabs[(index + 1) % tabs.length];
          } else if (e.key === 'ArrowLeft') {
            nextTab = tabs[(index - 1 + tabs.length) % tabs.length];
          }

          if (nextTab) {
            e.preventDefault();
            nextTab.focus();
            nextTab.click();
          }
        });
      });
    });
  }

  // ==========================================================================
  // 4. BIBTEX CITATION DRAWER & CLIPBOARD UTILITY
  // ==========================================================================
  function initBibtexDrawer() {
    const toggleBtn = document.getElementById('btn-toggle-bibtex');
    const drawer = document.getElementById('drawer-bibtex');
    const copyBtn = document.getElementById('btn-copy-bibtex');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = drawer.hidden || drawer.hasAttribute('hidden') || window.getComputedStyle(drawer).display === 'none';

      if (isHidden) {
        drawer.hidden = false;
        drawer.removeAttribute('hidden');
        drawer.style.display = 'block';
        toggleBtn.setAttribute('aria-expanded', 'true');
        const spanText = toggleBtn.querySelector('span');
        if (spanText) spanText.textContent = 'HIDE BIBTEX CITATION';
      } else {
        drawer.hidden = true;
        drawer.setAttribute('hidden', '');
        drawer.style.display = 'none';
        toggleBtn.setAttribute('aria-expanded', 'false');
        const spanText = toggleBtn.querySelector('span');
        if (spanText) spanText.textContent = 'VIEW BIBTEX CITATION';
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const code = drawer.querySelector('code')?.textContent || '';
        if (!code) return;

        navigator.clipboard.writeText(code.trim()).then(() => {
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.classList.remove('copied');
          }, 2000);
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = code.trim();
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.classList.remove('copied');
          }, 2000);
        });
      });
    }
  }

  // ==========================================================================
  // 5. MAGNETIC POINTER INTERACTION
  // ==========================================================================
  function initMagneticButtons() {
    if (prefersReducedMotion || isTouchDevice || typeof window.gsap === 'undefined') return;

    const magnetics = document.querySelectorAll('[data-magnetic]');

    magnetics.forEach((el) => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 0.2;
      const xTo = window.gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
      const yTo = window.gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        xTo(x);
        yTo(y);
      });

      el.addEventListener('pointerleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  // ==========================================================================
  // 6. ATMOSPHERIC CUSTOM CURSOR DOT
  // ==========================================================================
  function initCursor() {
    if (prefersReducedMotion || isTouchDevice) return;

    const cursor = document.querySelector('[data-cursor]');
    if (!cursor) return;

    let xTo, yTo;
    if (typeof window.gsap !== 'undefined') {
      xTo = window.gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3.out' });
      yTo = window.gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3.out' });
    }

    document.addEventListener('pointermove', (e) => {
      if (xTo && yTo) {
        xTo(e.clientX);
        yTo(e.clientY);
      } else {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    });

    document.querySelectorAll('a, button, .tab-trigger, .split-cell, .system-item-block').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('active'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('active'));
    });
  }

  // ==========================================================================
  // 7. GSAP SCROLL REVEAL TIMELINES
  // ==========================================================================
  function initScrollReveals() {
    if (prefersReducedMotion) return;

    if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
      window.gsap.utils.toArray('[data-reveal]').forEach((element) => {
        window.gsap.fromTo(
          element,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });
    }
  }

  // ==========================================================================
  // BOOTSTRAP
  // ==========================================================================
  function bootstrap() {
    initSculpturalCanvas();
    initSmoothScroll();
    initDossierTabs();
    initBibtexDrawer();
    initMagneticButtons();
    initCursor();
    initScrollReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
