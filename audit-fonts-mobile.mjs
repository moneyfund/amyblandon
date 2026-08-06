import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const executablePath = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].find((path) => fs.existsSync(path));
if (!executablePath) throw new Error('No Chrome/Chromium executable found');

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto('https://amyblandon.com/', { waitUntil: 'networkidle2', timeout: 120000 });
await page.evaluate(() => document.fonts?.ready);

const report = await page.evaluate(() => {
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  const visible = (el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  };
  const all = [...document.querySelectorAll('body *')].filter(visible);
  const findBest = (text, exact = false, occurrence = 0) => {
    const wanted = normalize(text).toLowerCase();
    return all
      .filter((el) => {
        const value = normalize(el.innerText || el.textContent).toLowerCase();
        return exact ? value === wanted : value.includes(wanted);
      })
      .sort((a, b) => {
        const aText = normalize(a.innerText || a.textContent);
        const bText = normalize(b.innerText || b.textContent);
        return aText.length - bText.length || a.childElementCount - b.childElementCount || a.getBoundingClientRect().y - b.getBoundingClientRect().y;
      })[occurrence];
  };
  const describe = (el) => {
    if (!el) return null;
    const style = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: normalize(el.innerText || el.textContent).slice(0, 160),
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      textTransform: style.textTransform,
    };
  };

  return {
    viewport: { width: innerWidth, height: innerHeight },
    heroEyebrow: describe(findBest('ESTRATEGIA – EXPERIENCIA – RESULTADOS', true)),
    heroTitle: describe(findBest('Tu próxima inversión, comienza con una buena decisión')),
    heroParagraph: describe(findBest('Te acompaño a tomar decisiones inteligentes que te permitan proteger')),
    heroButton: describe(findBest('Ir a WhatsApp', true)),
    servicesKicker: describe(findBest('SOLUCIONES INTEGRALES', true)),
    servicesHeading: describe(findBest('Para tu crecimiento financiero', true)),
    serviceTitle: describe(findBest('Bienes Raíces', true)),
    serviceParagraph: describe(findBest('Encuentra oportunidades inmobiliarias estratégicas')),
    aboutLabel: describe(findBest('Sobre Mi', true, 1) || findBest('Sobre Mi', true)),
    aboutTitle: describe(findBest('ASESORA INMOBILIARIA, SEGUROS E INVERSIONES')),
    aboutParagraph: describe(findBest('Mi propósito es acompañarte a tomar decisiones')),
    strategicHeading: describe(findBest('Decisiones que hoy te dan paz, mañana te dan futuro.', true)),
    propertiesHeading: describe(findBest('Featured Properties', true, 2) || findBest('Featured Properties', true)),
    propertyPrice: describe(findBest('$800,000', true)),
    propertyTitle: describe(findBest('Luxury Villa With Pool', true)),
    footerQuestion: describe(findBest('Cual será tu próxima inversion?', true)),
    footerSubscribe: describe(findBest('Suscribete', true)),
    footerParagraph: describe(findBest('Sé parte de nuestra comunidad y recibe información valiosa')),
    copyright: describe(findBest('Copyright © 2026')),
  };
});

console.log('=== AMYBLANDON.COM MOBILE TYPOGRAPHY 390PX ===');
console.log(JSON.stringify(report, null, 2));
await browser.close();
