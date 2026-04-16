// ════════════════════════════════════════════════════════════════
//  PORTFOLIO WEBSITE — Optimized JavaScript
// ════════════════════════════════════════════════════════════════

/* ─── 1. NAVBAR & SCROLL THROTTLING ─── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

let isScrolling = false;
window.addEventListener('scroll', () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
      isScrolling = false;
    });
    isScrolling = true;
  }
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* Active Link Highlight */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observerNav.observe(s));


/* ─── 2. TYPING ANIMATION ─── */
const typingEl = document.getElementById('typing');
const words = ['CSE Student 💻', 'Web Developer 🌐', 'Problem Solver 🧩', 'Tech Enthusiast ⚡'];
let wIdx = 0, cIdx = 0, deleting = false;

function type() {
  const word = words[wIdx];
  if (!deleting) {
    typingEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typingEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
if(typingEl) setTimeout(type, 600);


/* ─── 3. COUNTER ANIMATION ─── */
function animateCounters() {
  document.querySelectorAll('.stat-n').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { animateCounters(); heroObserver.disconnect(); }
}, { threshold: 0.3 });
const homeEl = document.getElementById('home');
if(homeEl) heroObserver.observe(homeEl);


/* ─── 4. SCROLL REVEAL & SKILLS ─── */
const revealEls = document.querySelectorAll('.skill-category, .project-card, .contact-card, .team-member, .section-title');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => bar.style.width = bar.dataset.width + '%');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(cat => barObserver.observe(cat));


/* ─── 5. SMOOTH SCROLL & BACK TO TOP ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
const bttBtn = document.getElementById('backToTop');
if(bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ─── 6. CONTACT FORM VALIDATION ─── */
const form = document.getElementById('contactForm');
if (form) {
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  const formSuccess = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), err: document.getElementById('nameErr'), val: v => v.trim().length >= 2 ? '' : 'Enter valid name' },
    email: { el: document.getElementById('email'), err: document.getElementById('emailErr'), val: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter valid email' },
    subject: { el: document.getElementById('subject'), err: document.getElementById('subjectErr'), val: v => v.trim().length >= 3 ? '' : 'Subject required' },
    message: { el: document.getElementById('message'), err: document.getElementById('msgErr'), val: v => v.trim().length >= 10 ? '' : 'Message too short' },
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ el, err, val }) => {
      const msg = val(el.value);
      err.textContent = msg;
      if (msg) { valid = false; el.style.borderColor = '#f87171'; }
      else { el.style.borderColor = '#4ade80'; }
    });

    if (!valid) return;

    // WHATSAPP INTEGRATION
    const WHATSAPP_NUMBER = '919087467473'; 
    const waText = encodeURIComponent(
      `👋 Hello Naveen Karthick!\n\n📌 *Name:* ${fields.name.el.value}\n📧 *Email:* ${fields.email.el.value}\n📝 *Subject:* ${fields.subject.el.value}\n\n💬 *Message:*\n${fields.message.el.value}`
    );

    submitBtn.disabled = true; btnText.style.display = 'none'; btnLoader.style.display = 'inline-block';
    await new Promise(r => setTimeout(r, 800));

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, '_blank');

    submitBtn.style.display = 'none'; formSuccess.style.display = 'block'; form.reset();
    Object.values(fields).forEach(({ el }) => el.style.borderColor = '');

    setTimeout(() => {
      formSuccess.style.display = 'none'; submitBtn.style.display = 'flex';
      submitBtn.disabled = false; btnText.style.display = 'inline'; btnLoader.style.display = 'none';
    }, 5000);
  });
}


/* ─── 7. CURSOR & RIPPLE EFFECTS ─── */
// Cursor Glow with requestAnimationFrame for performance
const glow = document.createElement('div');
glow.style.cssText = `position: fixed; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%); pointer-events: none; z-index: 0; transform: translate(-50%, -50%); transition: opacity 0.3s ease; opacity: 0;`;
document.body.appendChild(glow);

let isGlowVisible = false;
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (!isGlowVisible) { glow.style.opacity = '1'; isGlowVisible = true; }
  window.requestAnimationFrame(() => { glow.style.left = mouseX + 'px'; glow.style.top = mouseY + 'px'; });
});
document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; isGlowVisible = false; });


/* ─── 8. MODAL & MINI-APPS SYSTEM ─── */
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
let _snakeInterval = null, _snakeKeyHandler = null;

// Keep your existing openProject, closeModal, buildCalculator, buildSnakeGame, buildTodoApp, etc. here!
// (Assuming you have these defined perfectly in your original code, they can remain exactly as they were, just attach to the window object if triggered inline).

window.openProject = function(name) {
  // Existing modal setup logic
  const projectModal = document.getElementById('projectModal');
  projectModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Note: Place your specific build functions (buildCalculator, etc.) below this.
}

if(modalClose) {
  modalClose.addEventListener('click', () => {
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
    if (_snakeInterval) clearInterval(_snakeInterval);
    if (_snakeKeyHandler) document.removeEventListener('keydown', _snakeKeyHandler);
  });
}

