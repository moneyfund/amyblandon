import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function pdfFooterBrandFix() {
  return {
    name: 'pdf-footer-brand-fix',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('propertyTechnicalSheetPdf.js')) return null;

      // El favicon cargado como Image podía quedar decodificado pero no pintarse
      // al rasterizar el canvas del PDF. Forzamos el fallback dibujado directamente
      // con Canvas (fondo dorado + monograma AB), que no depende de red, SVG, CORS
      // ni de la vida útil de un object URL.
      const faviconLoad = "  const faviconImage = await loadImage(`${import.meta.env.BASE_URL}favicon-amy.svg`);";
      return code.replace(faviconLoad, '  const faviconImage = null;');
    },
  };
}

export default defineConfig({
  plugins: [react(), pdfFooterBrandFix()],
  base: process.env.GITHUB_ACTIONS
    ? '/amyblandon/'
    : '/',
});
