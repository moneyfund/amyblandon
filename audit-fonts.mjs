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
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
await page.goto('https://amyblandon.com/', { waitUntil: 'networkidle2', timeout: 120000 });
await page.evaluate(() => document.fonts?.ready);

const report = await page.evaluate(() => {
  const visible = (el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  };
  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  const describe = (el) => {
    if (!el) return null;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      className: String(el.className || ''),
      text: normalize(el.innerText || el.textContent).slice(0, 180),
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      textTransform: style.textTransform,
      x: Math.round(rect.x),
      y: Math.round(rect.y),
    };
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

  const targets = {
    navigation: describe(findBest('Inicio', true)),
    phoneButton: describe(findBest('+505 8832 4439', true)),
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
    strategicKicker: describe(findBest('SOLUCIONES INTEGRALES', true, 1)),
    strategicHeading: describe(findBest('Decisiones que hoy te dan paz, mañana te dan futuro.', true)),
    propertiesHeading: describe(findBest('Featured Properties', true, 2) || findBest('Featured Properties', true)),
    propertyPrice: describe(findBest('$800,000', true)),
    propertyTitle: describe(findBest('Luxury Villa With Pool', true)),
    propertyMeta: describe(findBest('Bedrooms', true)),
    footerLocation: describe(findBest('Matagalpa, Nicaragua', true)),
    footerQuestion: describe(findBest('Cual será tu próxima inversion?', true)),
    footerSubscribe: describe(findBest('Suscribete', true)),
    footerParagraph: describe(findBest('Sé parte de nuestra comunidad y recibe información valiosa')),
    copyright: describe(findBest('Copyright © 2026')),
  };

  const families = new Map();
  for (const el of all) {
    const text = normalize(el.innerText || el.textContent);
    if (!text || text.length > 220) continue;
    const style = getComputedStyle(el);
    const key = [style.fontFamily, style.fontWeight, style.fontStyle].join('|');
    if (!families.has(key)) families.set(key, { fontFamily: style.fontFamily, fontWeight: style.fontWeight, fontStyle: style.fontStyle, count: 0, samples: [] });
    const item = families.get(key);
    item.count += 1;
    if (item.samples.length < 5 && !item.samples.includes(text)) item.samples.push(text.slice(0, 100));
  }

  const fontFaces = [];
  for (const sheet of [...document.styleSheets]) {
    try {
      for (const rule of [...(sheet.cssRules || [])]) {
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          fontFaces.push({
            family: rule.style.getPropertyValue('font-family'),
            weight: rule.style.getPropertyValue('font-weight'),
            style: rule.style.getPropertyValue('font-style'),
            src: rule.style.getPropertyValue('src').slice(0, 240),
          });
        }
      }
    } catch {}
  }

  const styleLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.href);
  return { title: document.title, targets, families: [...families.values()].sort((a,b)=>b.count-a.count), fontFaces, styleLinks };
});

console.log('=== AMYBLANDON.COM COMPUTED TYPOGRAPHY ===');
console.log(JSON.stringify(report, null, 2));
await browser.close();
