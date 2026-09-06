import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function pdfFooterBrandFix() {
  return {
    name: 'pdf-footer-brand-fix',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('propertyTechnicalSheetPdf.js')) return null;

      // La ficha no debe depender de SVG, red, CORS, caché ni object URLs para
      // la marca del footer. Forzamos el fallback pintado directamente en Canvas.
      const faviconLoad = "  const faviconImage = await loadImage(`${import.meta.env.BASE_URL}favicon-amy.svg`);";
      const transformed = code.replace(faviconLoad, '  const faviconImage = null;');

      // Si una futura edición cambia esa línea, el build debe fallar en vez de
      // publicar silenciosamente una versión donde el logo vuelva a quedar vacío.
      if (transformed === code) {
        throw new Error('No se pudo aplicar el arreglo determinístico del logo del PDF.');
      }

      return transformed;
    },
  };
}

export default defineConfig({
  plugins: [react(), pdfFooterBrandFix()],
  base: process.env.GITHUB_ACTIONS
    ? '/amyblandon/'
    : '/',
});
