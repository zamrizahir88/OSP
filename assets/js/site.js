// One Stop Physiotherapy: page behaviour. Everything here enhances; the pages read fully without it.

const WA = '60124077401';
const wa = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

// ---------- menu ----------
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu');
  if (!toggle || !menu) return;
  menu.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--i', i));
  const set = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => set(menu.hidden));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); toggle.focus(); } });
})();

// ---------- header takes the colours of the chapter beneath it ----------
(() => {
  const chapters = document.querySelectorAll('[data-ink]');
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const root = document.documentElement.style;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      root.setProperty('--header-ink', entry.target.dataset.ink);
      root.setProperty('--header-bg', entry.target.dataset.bg || 'transparent');
    }
  }, { rootMargin: '0px 0px -94% 0px', threshold: 0 });
  chapters.forEach((el) => io.observe(el));
})();

// ---------- reveal once on entry ----------
(() => {
  // lists and tables that are not marked in the markup still arrive row by row
  document.querySelectorAll('.faq-list, .prose, .hours tbody, .contact-lines, .team').forEach((group) => {
    group.setAttribute('data-stagger', '');
    [...group.children].forEach((el) => el.setAttribute('data-reveal', ''));
  });
  const groups = document.querySelectorAll('[data-stagger]');
  groups.forEach((g) => g.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--i', i)));
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  targets.forEach((el) => io.observe(el));
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

// ---------- open now (Malaysia time; open Saturday to Thursday, 9am to 6pm, closed Friday) ----------
(() => {
  const els = document.querySelectorAll('[data-open-status]');
  const rows = document.querySelectorAll('.hours tr[data-day]');
  if (!els.length && !rows.length) return;
  const now = new Date(Date.now() + 8 * 3600e3); // shift to UTC+8, then read UTC fields
  const day = now.getUTCDay(); // 0 Sunday … 5 Friday
  const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  const isOpenDay = (d) => d !== 5;
  const open = isOpenDay(day) && mins >= 540 && mins < 1080;
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let text;
  if (open) text = 'Open now, until 6pm';
  else if (isOpenDay(day) && mins < 540) text = 'Closed now, opens 9am today';
  else {
    let next = (day + 1) % 7;
    while (!isOpenDay(next)) next = (next + 1) % 7;
    text = `Closed now, opens ${next === (day + 1) % 7 ? 'tomorrow' : names[next]} at 9am`;
  }
  els.forEach((el) => { el.textContent = text; el.classList.add('status'); el.classList.toggle('is-open', open); });
  rows.forEach((tr) => tr.classList.toggle('today', Number(tr.dataset.day) === day));
})();

// ---------- body map ("Where does it hurt?") ----------
(() => {
  const root = document.querySelector('[data-mapper]');
  if (!root) return;
  const data = {
    knee: { tone: 'teal', title: 'Knee pain', text: 'Pain at the front of the knee, stiffness after sitting, or a knee that gives way on the stairs.', list: ['Osteoarthritis', 'ACL and meniscus injury', 'Patellar tendon pain', 'After knee surgery'], sessions: 'Usually 4 to 8 sessions, with exercises for home.' },
    back: { tone: 'deep', title: 'Back pain and sciatica', text: 'Low back pain, pain that runs down the leg, or a back that locks after lifting.', list: ['Slip disc', 'Sciatica', 'Muscle spasm', 'Posture strain from desk work'], sessions: 'Usually 4 to 10 sessions: IFT, manual therapy, then strength.' },
    neck: { tone: 'ink', title: 'Neck and shoulder', text: 'A stiff neck, a shoulder that will not lift past your head, or pain at night.', list: ['Frozen shoulder', 'Neck strain', 'Rotator cuff injury', 'Tension headaches'], sessions: 'Frozen shoulder takes longer: often 8 to 12 sessions.' },
    head: { tone: 'deep', title: 'Stroke and nerve conditions', text: 'Weakness on one side, trouble walking, or a face that has dropped on one side.', list: ['Stroke rehabilitation', "Bell's palsy", "Parkinson's disease", 'Balance and walking problems'], sessions: 'A longer programme, at the centre or at home.' },
    foot: { tone: 'teal', title: 'Ankle and foot', text: 'Heel pain on the first steps of the morning, or an ankle that keeps rolling.', list: ['Plantar fasciitis', 'Ankle sprain', 'Achilles tendon pain', 'Shockwave therapy'], sessions: 'Shockwave often helps within 3 to 5 sessions.' },
    sport: { tone: 'ink', title: 'Sports injury', text: 'Hamstring pulls, groin strains and the knocks of a season on the field or court.', list: ['Muscle strain and tear', 'Ligament sprain', 'Return-to-play testing', 'Sports massage'], sessions: 'A plan built around your next match.' },
  };
  const buttons = root.querySelectorAll('[data-area]');
  const zones = root.querySelectorAll('[data-zone]');
  const disc = root.querySelector('.disc');
  const fact = root.querySelector('.mapper-swap');
  const select = (key) => {
    const d = data[key];
    if (!d) return;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.area === key)));
    zones.forEach((z) => {
      const on = z.dataset.zone.split(' ').includes(key);
      z.classList.toggle('on', on);
      const pulse = z.nextElementSibling;
      if (pulse && pulse.classList.contains('pulse')) pulse.classList.toggle('on', on);
    });
    disc.dataset.tone = d.tone;
    fact.classList.add('is-swapping');
    setTimeout(() => {
      fact.querySelector('h3').textContent = d.title;
      fact.querySelector('.f-text').textContent = d.text;
      fact.querySelector('ul').innerHTML = d.list.map((x) => `<li>${x}</li>`).join('');
      fact.querySelector('.sessions').textContent = d.sessions;
      const a = fact.querySelector('a.button');
      a.href = wa(`Hi OSP, I have ${d.title.toLowerCase()}. Can I book an assessment?`);
      a.textContent = `Ask about ${d.title.toLowerCase()}`;
      fact.classList.remove('is-swapping');
    }, 180);
  };
  buttons.forEach((b) => b.addEventListener('click', () => select(b.dataset.area)));
  zones.forEach((z) => z.addEventListener('click', () => select(z.dataset.zone.split(' ')[0])));
})();

// ---------- TikTok: load the player only when asked ----------
document.querySelectorAll('.tt[data-id] button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const box = btn.closest('.tt');
    const frame = document.createElement('iframe');
    frame.src = `https://www.tiktok.com/player/v1/${box.dataset.id}?autoplay=1&rel=0`;
    frame.title = btn.querySelector('.cap')?.textContent || 'TikTok video';
    frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    frame.loading = 'lazy';
    box.replaceChildren(frame);
  });
});

// ---------- forms that open WhatsApp with the details filled in ----------
document.querySelectorAll('form[data-wa]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const lines = [form.dataset.wa];
    for (const [k, v] of fd.entries()) if (String(v).trim()) lines.push(`${k}: ${v}`);
    window.open(wa(lines.join('\n')), '_blank', 'noopener');
  });
});
