# Reference audit: amyblandon.com home

Audit date: 2026-08-04. Reference inspected at `https://amyblandon.com/` and compared against the GitHub Pages implementation sizes requested: 1440×900, 1366×768, 1280×800, 1024×768, 768×1024, 430×932, 390×844, and 360×800.

## Exact section order
1. Navbar with Amy Blandon brand, Inicio, Propiedades, Sobre Mi, Seguros, Contacto, WhatsApp phone access, and mobile menu trigger.
2. Hero principal.
3. SOLUCIONES INTEGRALES / Para tu crecimiento financiero.
4. Sobre Mi.
5. Strategic strip: SOLUCIONES INTEGRALES / Decisiones que hoy te dan paz, mañana te dan futuro.
6. Featured Properties.
7. Footer.

## Visible text extracted from the DOM
- Estrategia – Experiencia – Resultados
- Tu próxima inversión, comienza con / una buena decisión
- Te acompaño a tomar decisiones inteligentes que te permitan proteger, construir y multiplicar tu patrimonio con seguridad y visión de futuro
- Ir a WhatsApp
- SOLUCIONES INTEGRALES
- Para tu crecimiento financiero
- Bienes Raíces
- Encuentra oportunidades inmobiliarias estratégicas que generen valor, estabilidad y crecimiento en el tiempo. Te asesoro en cada paso para que tomes decisiones seguras y rentables.
- Inversiones
- Diseñamos estrategias personalizadas para hacer crecer tu dinero con visión, control y propósito. Invertir bien no es suerte, es estructura.
- Seguros
- Protege lo que has construido con soluciones diseñadas para resguardar tu patrimonio, tu familia y tu tranquilidad.
- Sobre Mi
- ASESORA INMOBILIARIA, SEGUROS / E INVERSIONES
- Mi propósito es acompañarte a tomar decisiones que te den tranquilidad hoy y construyan tu futuro mañana.
- Trabajo con una visión clara: ayudarte a proteger, estructurar y hacer crecer tu patrimonio de forma estratégica, sin improvisaciones y con total confianza.
- Decisiones que hoy te dan paz, mañana te dan futuro.
- Featured Properties
- View All
- $800,000 / Luxury Villa With Pool / 853 Dino Shores, Bartellborough / 5 Bedrooms / 3 Bathrooms / 1 Pool / 500 Total Area
- $500,000 / Cozy High-Tech Villa / Sed vel maximus ante quis mattis neque / 5 Bedrooms / 3 Bathrooms / 1 Pool / 400 Total Area
- $300,000 / Gorgeous Minimalist Villa / Nulla tellus nunc malesuada at scelerisque / 3 Bedrooms / 2 Bathrooms / 1 Pool / 150 Total Area
- Matagalpa, Nicaragua
- Email: info@amyblandon.com
- Phone: +505 8832 4439
- Cual será tu próxima inversion?
- Suscribete
- Sé parte de nuestra comunidad y recibe información valiosa sobre bienes raíces, seguros e inversiones. Aprende, mantente informado y toma mejores decisiones financieras.
- Copyright © 2026 - Amy Blandón.com | Powered by Innovart Studio

## Visual measurements and styles
- Container: approximately 1180–1190 px max width with 24 px desktop gutters and 20 px mobile gutters.
- Navbar: black/deep navy sticky bar, approximately 92–94 px tall on desktop and 76 px on mobile. Menu uses Montserrat-like sans serif at 15 px/600. Active and hover state changes to gold. Phone link has a thin gold border.
- Logo: centered textual lockup in the original image. Name is gold, all caps, widely tracked; descriptor is small white text below.
- Hero: two-column desktop composition, minimum height near 760 px. Text column is white; portrait column sits over a warm gold/tan panel. Large serif headline near 76 px at 1440 px, body near 18 px with generous line height, CTA is a square dark navy button.
- Solutions: white background, centered heading, three equal columns. Icons are dark navy and large, with simple text blocks below. No rounded cards.
- About: pale neutral background, left portrait with rounded top arch, right text. Section title is large uppercase sans serif; label uses display serif.
- Strategic strip: dark navy overlay over architectural imagery, centered text, roughly 300–320 px tall.
- Properties: white background, section heading with a right aligned View All link. Three property cards on desktop, two at tablet, one on phone. Photos use 4:3-ish landscape crop, subtle border/shadow, and scale slightly on hover.
- Footer: deep black/navy background, three columns on desktop. Left contains brand and contact lines, middle contains the question headline, right contains subscription content and form. Single-column on mobile.

## Colors identified / approximated from computed styles and visual sampling
- Deep background: `#05090b` / near black.
- Navy: `#042b3a`.
- Gold: `#c99a44` with lighter highlight `#e2be73`.
- White: `#ffffff`.
- Pale surface: `#f4f6f4`.
- Text: `#092a37`.
- Muted text: `#5e6c70`.
- Border: `#dfe5e2`.

## Fonts
- Reference uses a Google-font-like elegant serif for large headlines and a geometric sans serif for navigation/body. Implementation uses Marcellus for display, Montserrat for body/navigation/buttons, and Cinzel for the temporary textual logo.

## Animations and interactions
- Entrance animation is subtle: fade plus ~24–28 px translation, approximately 600–700 ms with ease-out timing, staggered in repeated content.
- Hover interactions are restrained: color change on nav, button background inversion/elevation, property image scale and slight card lift.
- Mobile menu opens vertically below navbar with a short height/opacity transition and closes via the same button or by selecting a link.

## Responsive behavior
- Around 1024 px the hero stacks, property cards reduce to two columns, and gutters remain ~20–24 px.
- At 820 px and below the navbar collapses to a menu button, services become single-column left-aligned, about text appears before image, properties become one column, and the footer stacks.
- Mobile checks target no horizontal overflow: `document.documentElement.scrollWidth <= window.innerWidth`.
