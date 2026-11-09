const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}

const disciplines = {
  experience: {
    eyebrow: '01 — EXPERIENCE & DESIGN',
    title: 'Understand people. Shape the experience.',
    description: 'Research, structure, visual systems, and interaction design come together to make products useful, understandable, and engaging.',
    roles: [
      ['UX Researcher','Studies user needs, behavior, and problems.'],
      ['UX Designer','Shapes useful, accessible end-to-end experiences.'],
      ['UI Designer','Designs visual interface systems and components.'],
      ['Interaction Designer','Defines how interfaces respond to people.'],
      ['Web Designer','Creates the structure and visual language of websites.'],
      ['Graphic Designer / Illustrator','Communicates ideas through visual composition and imagery.']
    ]
  },
  development: {
    eyebrow: '02 — DEVELOPMENT & CMS',
    title: 'Turn designed ideas into working products.',
    description: 'The engineering work behind websites and applications: interfaces, server logic, data, integrations, and content platforms.',
    roles: [
      ['Front-End Developer','Builds the browser-facing interface and behavior.'],
      ['Back-End Developer','Builds server-side logic, APIs, and data systems.'],
      ['Full-Stack Developer','Works across front-end and back-end layers.'],
      ['UI Developer','Implements interface components and design systems in code.'],
      ['CMS Developer','Builds and customizes WordPress, Shopify, Webflow, and other content platforms.']
    ]
  },
  content: {
    eyebrow: '03 — CONTENT & GROWTH',
    title: 'Make useful work discoverable and clear.',
    description: 'Content planning, writing, search visibility, and measurement help the right people understand and find a digital product.',
    roles: [
      ['Content Strategist','Plans content around audience needs and business goals.'],
      ['Copywriter / Content Writer','Writes persuasive, useful, audience-focused content.'],
      ['SEO Specialist','Improves technical and editorial search visibility.'],
      ['Web Analyst','Studies website behavior and performance data.']
    ]
  },
  operations: {
    eyebrow: '04 — ENGINEERING & OPERATIONS',
    title: 'Keep digital products reliable and moving.',
    description: 'Infrastructure, architecture, quality, delivery, and ongoing site management support products after the first launch.',
    roles: [
      ['DevOps Engineer','Connects software delivery with infrastructure and automation.'],
      ['System Administrator','Maintains servers, systems, access, and reliability.'],
      ['Web Architect','Plans the structure and technical foundations of web systems.'],
      ['Quality Assurance (QA) Tester','Finds defects and verifies product behavior.'],
      ['Product Manager','Sets product direction and prioritizes user and business value.'],
      ['Project Manager','Coordinates scope, people, timelines, and delivery.'],
      ['Webmaster','Oversees website health, updates, and ongoing operation.']
    ]
  }
};

const tabs = [...document.querySelectorAll('.discipline-tab')];
const roleGrid = document.getElementById('discipline-role-grid');
function renderDiscipline(key) {
  const item = disciplines[key];
  if (!item || !roleGrid) return;
  tabs.forEach(tab => {
    const active = tab.dataset.discipline === key;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.getElementById('discipline-overline').textContent = item.eyebrow;
  document.getElementById('discipline-count').textContent = String(item.roles.length).padStart(2, '0') + ' ROLES';
  document.getElementById('discipline-title').textContent = item.title;
  document.getElementById('discipline-description').textContent = item.description;
  roleGrid.innerHTML = item.roles.map((role, index) =>
    '<div class="discipline-role"><span>' + String(index + 1).padStart(2, '0') + '</span><b>' +
    role[0] + '</b><small>' + role[1] + '</small></div>'
  ).join('');
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderDiscipline(tab.dataset.discipline));
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
      (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    renderDiscipline(tabs[next].dataset.discipline);
  });
});

const progressBar = document.getElementById('reading-progress-bar');
const header = document.querySelector('.site-header');
const topButton = document.querySelector('.back-to-top');
function updateScrollUI() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  if (topButton) topButton.classList.toggle('is-visible', window.scrollY > 500);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();
topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const revealTargets = document.querySelectorAll('.section-kicker, .section-heading, .about-grid, .project-card, .design-card, .skill-card, .contact-card, .discipline-explorer');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-on-scroll');
    element.style.transitionDelay = (index % 4) * 65 + 'ms';
    observer.observe(element);
  });
}

const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
