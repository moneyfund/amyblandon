from pathlib import Path


global_css = Path('src/styles/global.css')
text = global_css.read_text(encoding='utf-8')
old_import = "@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Marcellus&family=Montserrat:wght@300;400;500;600;700;800&display=swap');"
new_import = "@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');"
if old_import not in text and new_import not in text:
    raise SystemExit('No se encontró la importación tipográfica esperada.')
text = text.replace(old_import, new_import)
global_css.write_text(text, encoding='utf-8')

public_css = Path('src/styles/public-layout.css')
text = public_css.read_text(encoding='utf-8')
marker = '/* amy-reference-typography */'
if marker not in text:
    text += '''

/* amy-reference-typography */
.public-site{font-family:var(--font-reference)}
.public-navbar__menu{font-family:var(--font-reference);font-size:15px;font-weight:500;line-height:1.3;letter-spacing:normal}
.public-navbar__phone{font-family:var(--font-reference);font-size:16px;font-weight:400;line-height:1.65;letter-spacing:normal}
.public-navbar__toggle{font-family:var(--font-reference);font-weight:500}
.public-footer{font-family:var(--font-reference)}
.public-footer__line{font-family:var(--font-reference);font-size:16px;font-weight:400;line-height:1.65;letter-spacing:normal}
.public-footer h2{font-family:var(--font-reference);font-size:16px;font-weight:400;line-height:1.65;letter-spacing:normal}
.public-footer__whatsapp{font-family:var(--font-reference);font-size:15px;font-weight:500;line-height:1.65;letter-spacing:normal}
.public-footer h3{font-family:var(--font-reference);font-size:20px;font-weight:800;line-height:1.5;letter-spacing:normal}
.public-footer p{font-family:var(--font-reference);font-size:16px;font-weight:400;line-height:1.65;letter-spacing:normal}
.public-footer__form input,.public-footer__form button{font-family:var(--font-reference);font-size:15px;line-height:1.65;letter-spacing:normal}
.public-footer__form button{font-weight:500}
.public-footer small{font-family:var(--font-reference);font-size:15px;font-weight:400;line-height:1.3;letter-spacing:normal}
'''
public_css.write_text(text, encoding='utf-8')

responsive_css = Path('src/styles/responsive.css')
text = responsive_css.read_text(encoding='utf-8')
marker = '/* amy-reference-mobile-typography */'
if marker not in text:
    text += '''

/* amy-reference-mobile-typography */
@media (max-width:820px){
  .home-kicker{font-size:16px;font-weight:400;line-height:18px;letter-spacing:normal}
  .home-hero h1{font-size:48px;font-weight:300;line-height:64px;letter-spacing:normal}
  .home-hero__copy>p:not(.home-kicker){font-size:18px;font-weight:400;line-height:29.7px;letter-spacing:normal}
  .home-hero .amy-button{font-size:15px;font-weight:500;line-height:24.75px}
  .home-section-heading h2{font-size:35px;font-weight:800;line-height:52.5px}
  .home-solution h3{font-size:14px;font-weight:700;line-height:23.1px}
  .home-solution p{font-size:16px;font-weight:400;line-height:22px}
  .home-about__label{font-size:14px;font-weight:700;line-height:23.1px}
  .home-about h2{font-size:16px;font-weight:400;line-height:18px;letter-spacing:normal}
  .home-about__copy p:not(.home-about__label){font-size:16px;font-weight:400;line-height:22px}
  .home-strategic p{font-size:16px;font-weight:400;line-height:18px;letter-spacing:normal}
  .home-strategic h2{font-size:30px;font-weight:800;line-height:45px}
  .home-properties h2{font-size:25px;font-weight:800;line-height:37.5px}
  .home-property__price{font-size:20px;font-weight:800;line-height:33px}
  .home-property h3{font-size:16.764px;font-weight:800;line-height:25.146px}
  .home-property__features dd{font-size:12px;font-weight:600;line-height:19.8px}
  .public-footer h2{font-size:16px;font-weight:400;line-height:26.4px}
  .public-footer h3{font-size:20px;font-weight:800;line-height:30px}
  .public-footer p{font-size:16px;font-weight:400;line-height:26.4px}
  .public-footer small{font-size:15px;font-weight:400;line-height:19.5px}
}
@media (max-width:430px){
  .home-kicker{font-size:16px;line-height:18px;letter-spacing:normal}
  .home-hero h1{font-size:48px;line-height:64px}
  .home-about h2{font-size:16px;line-height:18px}
  .public-footer h2{font-size:16px;line-height:26.4px}
}
@media (max-width:370px){
  .home-hero h1{font-size:42px;line-height:56px}
}
'''
responsive_css.write_text(text, encoding='utf-8')
