const menu = document.querySelector('[data-menu]');
const opener = document.querySelector('[data-menu-button]');

const originals = document.querySelector('[data-originals]');
const liveHome = document.querySelector('[data-live-home]');
const PUBLISHING_CO_ENDPOINT = 'https://www.strata-af.com/api/publishing-co';

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

async function loadPublishingContent() {
  try {
    const response = await fetch(PUBLISHING_CO_ENDPOINT);
    if (!response.ok) throw new Error(`Publishing content request failed: ${response.status}`);
    const { hero, originals: rawOriginals } = await response.json();
    const items = rawOriginals.filter((item) => item.slug && item.title && item.coverImage);
    if (!hero?.title || !hero?.coverImage || !items.length) throw new Error('Incomplete publishing content');
    liveHome.innerHTML = `<img src="${escapeHtml(hero.coverImage)}?w=1400&h=1100&fit=crop&auto=format" alt=""><span class="live-home__title">${escapeHtml(hero.title)}</span><p class="media-label">LIVE / STRATA-AF™</p>`;
    originals.innerHTML = items.map((item) => `<a class="original-card" href="https://www.strata-af.com/article/${encodeURIComponent(item.slug)}" target="_blank" rel="noreferrer"><img src="${escapeHtml(item.coverImage)}?w=900&h=650&fit=crop&auto=format" alt=""><span>${escapeHtml(item.title)}</span></a>`).join('');
  } catch {
    originals.innerHTML = '<p class="desk-status">Originals are temporarily unavailable. <a href="https://www.strata-af.com/originals" target="_blank" rel="noreferrer">View STRATA-AF Originals ↗</a></p>';
  }
}
loadPublishingContent();

function closeMenu() { menu.close(); opener.setAttribute('aria-expanded', 'false'); }
opener.addEventListener('click', () => { menu.open ? closeMenu() : (menu.showModal(), opener.setAttribute('aria-expanded', 'true')); });
menu.addEventListener('close', () => opener.setAttribute('aria-expanded', 'false'));
document.querySelector('[data-menu-close]').addEventListener('click', closeMenu);
document.querySelectorAll('[data-menu-link]').forEach((link) => link.addEventListener('click', closeMenu));
document.querySelector('[data-year]').textContent = new Date().getFullYear();

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
