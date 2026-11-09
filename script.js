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
const searchInput = document.getElementById('discipline-search');
const detailTitle = document.getElementById('discipline-detail-title');
const detailDescription = document.getElementById('discipline-detail-description');
const detailIndex = document.getElementById('discipline-detail-index');
const resultsLabel = document.getElementById('discipline-results');
let activeDiscipline = 'experience';
let activeRole = 0;
let searchTerm = '';
function renderDiscipline(key, resetSearch = true) {
  const item = disciplines[key];
  if (!item || !roleGrid) return;
  activeDiscipline = key;
  if (resetSearch && searchInput) { searchInput.value = ''; searchTerm = ''; }
  tabs.forEach(tab => {
    const active = tab.dataset.discipline === key;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.getElementById('discipline-overline').textContent = item.eyebrow;
  document.getElementById('discipline-count').textContent = String(item.roles.length).padStart(2, '0') + ' / 22';
  document.getElementById('discipline-title').textContent = item.title;
  document.getElementById('discipline-description').textContent = item.description;
  activeRole = 0;
  renderDisciplineRoles();
}
function renderDisciplineRoles() {
  const item = disciplines[activeDiscipline];
  if (!item || !roleGrid) return;
  const matches = item.roles.map((role, index) => ({ role, index })).filter(({ role }) =>
    (role[0] + ' ' + role[1]).toLowerCase().includes(searchTerm)
  );
  if (activeRole < 0 && matches.length) activeRole = matches[0].index;
  roleGrid.innerHTML = matches.length ? matches.map(({ role, index }, visibleIndex) =>
    '<button class="discipline-role' + (index === activeRole ? ' is-selected' : '') + '" type="button" aria-pressed="' + (index === activeRole) + '" data-role-index="' + index + '" style="animation-delay:' + (visibleIndex * 45) + 'ms">' +
    '<span class="discipline-role-number">' + String(index + 1).padStart(2, '0') + '</span>' +
    '<span class="discipline-role-copy"><b>' + role[0] + '</b><small>' + role[1] + '</small></span><span class="discipline-role-arrow">↗</span></button>'
  ).join('') : '<div class="discipline-empty">No matching role in this field. Try another search.</div>';
  roleGrid.querySelectorAll('.discipline-role').forEach(button => {
    button.addEventListener('click', () => {
      activeRole = Number(button.dataset.roleIndex);
      renderDisciplineRoles();
    });
  });
  const selected = item.roles[activeRole] || item.roles[0];
  if (selected && detailTitle) {
    detailTitle.textContent = selected[0];
    detailDescription.textContent = selected[1];
    detailIndex.textContent = String(activeRole + 1).padStart(2, '0') + ' / ' + String(item.roles.length).padStart(2, '0');
  }
  if (resultsLabel) resultsLabel.textContent = 'SHOWING ' + String(matches.length).padStart(2, '0') + ' OF 22';
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
searchInput?.addEventListener('input', () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  activeRole = -1;
  renderDisciplineRoles();
});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
    event.preventDefault();
    searchInput?.focus();
  }
});
renderDiscipline('experience');


const caseStudies = {
  animo: {
    category:'AI PRODUCT · FULL-STACK BUILD', number:'CASE 01 / 03',
    title:'Ânimo AI — building a useful assistant, not just a chat box.',
    summary:'The project grew from a simple conversational interface into a broader AI application. The challenge was to connect model access, useful tools, documents, image understanding, and memory into one coherent product experience.',
    problem:'A chat interface alone is not a complete assistant. It needs context, useful capabilities, and a dependable way to preserve information between sessions.',
    build:'An application with configurable AI providers, web search, document and image input, and persistent memory backed by PostgreSQL.',
    focus:'Connecting the user experience to provider configuration, server-side features, and persistent data rather than treating each capability as an isolated demo.',
    next:'How should memory be evaluated? How can retrieval be made transparent? What test suite would protect tool use, provider failures, and long conversations?',
    stack:'AI PROVIDERS · NODE.JS · POSTGRESQL · WEB TOOLS',
    link:'https://github.com/hehemeko1-coder/Animo', label:'EXPLORE SOURCE ↗'
  },
  afterhours: {
    category:'SOCIAL PRODUCT · DATA & MESSAGING', number:'CASE 02 / 03',
    title:'Afterhours — turning social interactions into persistent product flows.',
    summary:'Afterhours explores the foundations of a private social space: user accounts, friend relationships, direct conversations, and group communication.',
    problem:'Social features are connected. A friend relationship affects who can communicate; conversations need clear membership and persistence; the interface must keep these states understandable.',
    build:'A social application with account flows, friend requests and accepted friendships, private messaging, group chat, and a migration from JSON-based storage to Neon/PostgreSQL.',
    focus:'Thinking in connected entities and durable records, and keeping relationships, membership, and messages consistent as the product grows.',
    next:'How should permissions be enforced at every request boundary? What delivery guarantees are needed for messages? How should unread state, moderation, and abuse reporting work?',
    stack:'SOCIAL GRAPH · PRIVATE MESSAGING · GROUPS · POSTGRESQL',
    link:'https://afterhours-vcsd.onrender.com', label:'OPEN LIVE PROJECT ↗'
  },
  seri: {
    category:'WEB EXPERIENCE · BRAND & CONTENT', number:'CASE 03 / 03',
    title:'SERI Skill Center — modernizing a website without losing its identity.',
    summary:'The redesign focused on making the site feel more contemporary while retaining the organization’s existing brand identity, logo, and supplied content.',
    problem:'A redesign can easily become a visual exercise that erases the client’s identity or invents content. The challenge was to improve the experience without changing what makes the organization recognizable.',
    build:'A refreshed website direction with an orange-led visual system, more deliberate page hierarchy, responsive layouts, and attention to the logo and favicon across the site.',
    focus:'Balancing visual modernization with content fidelity: preserve source wording, maintain recognizable brand elements, and improve consistency between page UI and browser identity.',
    next:'How can course discovery be tested with real visitors? Which pages drive enquiries? How should accessibility, performance, and content maintenance be measured after launch?',
    stack:'ART DIRECTION · RESPONSIVE UI · CONTENT FIDELITY · BRAND SYSTEM',
    link:'https://seri.et/', label:'OPEN WEBSITE ↗'
  }
};
const caseTabs = [...document.querySelectorAll('.case-study-tab')];
function renderCaseStudy(key) {
  const item = caseStudies[key];
  if (!item) return;
  caseTabs.forEach(tab => {
    const active = tab.dataset.case === key;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  const panel = document.getElementById('case-panel');
  panel.setAttribute('aria-labelledby', 'case-tab-' + key);
  ['category','number','title','summary','problem','build','focus','next','stack'].forEach(field => {
    const node = document.getElementById('case-' + field);
    if (node) node.textContent = item[field];
  });
  const link = document.getElementById('case-link');
  link.href = item.link;
  link.textContent = item.label;
  panel.classList.remove('case-study-content');
  void panel.offsetWidth;
  panel.classList.add('case-study-content');
}
caseTabs.forEach((tab,index) => {
  tab.addEventListener('click', () => renderCaseStudy(tab.dataset.case));
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? caseTabs.length - 1 :
      (index + (event.key === 'ArrowRight' ? 1 : -1) + caseTabs.length) % caseTabs.length;
    caseTabs[next].focus();
    renderCaseStudy(caseTabs[next].dataset.case);
  });
});
renderCaseStudy('animo');

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
// Coalesce scroll work to at most one visual update per animation frame.
let scrollUpdateQueued = false;
function scheduleScrollUIUpdate() {
  if (scrollUpdateQueued) return;
  scrollUpdateQueued = true;
  window.requestAnimationFrame(() => {
    scrollUpdateQueued = false;
    updateScrollUI();
  });
}
window.addEventListener('scroll', scheduleScrollUIUpdate, { passive: true });
window.addEventListener('resize', scheduleScrollUIUpdate, { passive: true });
updateScrollUI();
topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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


// NSI MUSIC PLAYER
(() => {
  const audio = document.getElementById('nsi-audio');
  const select = document.getElementById('nsi-track-select');
  const playButton = document.getElementById('nsi-play');
  const prevButton = document.getElementById('nsi-prev');
  const nextButton = document.getElementById('nsi-next');
  const repeatButton = document.getElementById('nsi-repeat');
  const title = document.getElementById('nsi-track-title');
  const progress = document.getElementById('nsi-progress');
  const currentTime = document.getElementById('nsi-current-time');
  const duration = document.getElementById('nsi-duration');
  const volume = document.getElementById('nsi-volume');
  const hint = document.getElementById('nsi-player-hint');
  if (!audio || !select || !playButton) return;
  let repeatCurrent = localStorage.getItem('nsi-player-repeat') === 'true';

  const tracks = [
    { title: 'Different Heaven - My Heart', src: 'assets/Different Heaven & EH!DE  – My Heart NCS Release].mp3' },
    { title: 'FEAR - NSI', src: 'assets/FEAR.mp3' },
    { title: 'SILENT - NSI', src: 'assets/SILENT(1).mp3' },
    { title: 'lame - NSI', src: 'assets/lame .mp3' },
    { title: 'loop - NSI', src: 'assets/loop.mp3' },
    { title: 'stop - NSI', src: 'assets/stop.mp3' },
    { title: 'yallD - NSI', src: 'assets/yallD.mp3' }
  ];
  const savedTrack = Number.parseInt(localStorage.getItem('nsi-player-track') || '0', 10);
  let activeTrack = Number.isInteger(savedTrack) && savedTrack >= 0 && savedTrack < tracks.length ? savedTrack : 0;
  const savedVolume = Number.parseFloat(localStorage.getItem('nsi-player-volume') || '0.7');
  audio.volume = Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.7;
  volume.value = String(audio.volume);
  audio.loop = repeatCurrent;
  function updateRepeatControl() {
    if (!repeatButton) return;
    repeatButton.classList.toggle('is-active', repeatCurrent);
    repeatButton.setAttribute('aria-pressed', String(repeatCurrent));
    repeatButton.setAttribute('aria-label', repeatCurrent ? 'Repeat current track on' : 'Repeat current track off');
    repeatButton.title = repeatCurrent ? 'Repeat current track: on' : 'Repeat current track: off';
  }
  updateRepeatControl();

  const formatTime = seconds => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return mins + ':' + secs;
  };
  function setTrack(index, shouldPlay = false) {
    activeTrack = (index + tracks.length) % tracks.length;
    const track = tracks[activeTrack];
    audio.pause();
    audio.src = track.src;
    audio.load();
    select.value = String(activeTrack);
    title.textContent = track.title;
    currentTime.textContent = '0:00';
    duration.textContent = '0:00';
    progress.value = '0';
    playButton.textContent = '▶';
    playButton.setAttribute('aria-label', 'Play');
    hint.textContent = 'SELECTED: ' + track.title.toUpperCase() + ' · PRESS PLAY';
    localStorage.setItem('nsi-player-track', String(activeTrack));
    if (shouldPlay) startPlayback();
  }
  async function startPlayback() {
    try {
      await audio.play();
      playButton.textContent = 'Ⅱ';
      playButton.setAttribute('aria-label', 'Pause');
      hint.textContent = 'NOW PLAYING · ' + tracks[activeTrack].title.toUpperCase();
    } catch (error) {
      playButton.textContent = '▶';
      playButton.setAttribute('aria-label', 'Play');
      hint.textContent = 'PLAYBACK UNAVAILABLE · PRESS PLAY TO RETRY';
    }
  }
  function updatePlayState() {
    const playing = !audio.paused;
    playButton.textContent = playing ? 'Ⅱ' : '▶';
    playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  select.addEventListener('change', () => setTrack(Number(select.value), !audio.paused));
  playButton.addEventListener('click', () => audio.paused ? startPlayback() : audio.pause());
  prevButton.addEventListener('click', () => setTrack(activeTrack - 1, true));
  nextButton.addEventListener('click', () => setTrack(activeTrack + 1, true));
  repeatButton?.addEventListener('click', () => {
    repeatCurrent = !repeatCurrent;
    audio.loop = repeatCurrent;
    localStorage.setItem('nsi-player-repeat', String(repeatCurrent));
    updateRepeatControl();
    hint.textContent = repeatCurrent ? 'REPEAT CURRENT TRACK · ON' : 'REPEAT CURRENT TRACK · OFF';
  });
  audio.addEventListener('play', updatePlayState);
  audio.addEventListener('pause', updatePlayState);
  audio.addEventListener('loadedmetadata', () => { duration.textContent = formatTime(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) progress.value = String(Math.round(audio.currentTime / audio.duration * 1000));
  });
  progress.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = Number(progress.value) / 1000 * audio.duration;
  });
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
    localStorage.setItem('nsi-player-volume', String(audio.volume));
  });
  audio.addEventListener('ended', () => { if (!repeatCurrent) setTrack(activeTrack + 1, true); });
  audio.addEventListener('error', () => {
    hint.textContent = 'TRACK COULD NOT LOAD · CHECK THE AUDIO FILE';
  });
  setTrack(activeTrack, false);
})();
