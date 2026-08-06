import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const executableCandidates = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];
const executablePath = executableCandidates.find((path) => fs.existsSync(path));
if (!executablePath) throw new Error('No Chrome/Chromium executable found');

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1712, height: 960, deviceScaleFactor: 1 });
await page.goto('https://amyblandon.com/', { waitUntil: 'networkidle2', timeout: 120000 });
await page.evaluate(() => document.fonts?.ready);

const result = await page.evaluate(() => {
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  const visible = (el) => {
    if (!el) return false;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) !== 0 && r.width > 0 && r.height > 0;
  };
  const describe = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || '',
      className: typeof el.className === 'string' ? el.className : '',
      text: normalize(el.innerText || el.textContent).slice(0, 220),
      rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      display: s.display,
      position: s.position,
      backgroundColor: s.backgroundColor,
      backgroundImage: s.backgroundImage,
      color: s.color,
      borderTop: s.borderTop,
      borderRight: s.borderRight,
      borderBottom: s.borderBottom,
      borderLeft: s.borderLeft,
      borderRadius: s.borderRadius,
      boxShadow: s.boxShadow,
      padding: s.padding,
      margin: s.margin,
      gap: s.gap,
      justifyContent: s.justifyContent,
      alignItems: s.alignItems,
      textAlign: s.textAlign,
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight,
    };
  };
  const all = [...document.querySelectorAll('body *')].filter(visible);
  const exact = (text) => all.find((el) => normalize(el.innerText || el.textContent) === text);
  const ancestors = (el, count = 8) => {
    const out = [];
    let current = el;
    for (let i = 0; current && i < count; i += 1, current = current.parentElement) out.push(describe(current));
    return out;
  };

  const serviceTitles = ['Bienes Raíces', 'Inversiones', 'Seguros'];
  const services = serviceTitles.map((title) => {
    const titleEl = exact(title);
    return { title, titleChain: ancestors(titleEl, 10) };
  });

  const heading = exact('Para tu crecimiento financiero');
  const footerCandidates = [...document.querySelectorAll('footer, #footer, [data-footer], [class*="footer"]')].filter(visible);
  const footer = footerCandidates.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];

  return {
    url: location.href,
    heading: describe(heading),
    headingChain: ancestors(heading, 8),
    services,
    footerCandidates: footerCandidates.map(describe),
    footerChain: ancestors(footer, 8),
    body: describe(document.body),
    html: describe(document.documentElement),
  };
});

console.log('=== AMY REFERENCE CARDS AND FOOTER ===');
console.log(JSON.stringify(result, null, 2));
await browser.close();
