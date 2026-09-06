import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function pdfFaviconCacheBust() {
  return {
    name: 'pdf-favicon-cache-bust',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('propertyTechnicalSheetPdf.js')) return null;
      return code.replace('favicon-amy.svg', 'favicon-amy.svg?v=20260905-2');
    },
  };
}

export default defineConfig({
  plugins: [react(), pdfFaviconCacheBust()],
  base: process.env.GITHUB_ACTIONS
    ? '/amyblandon/'
    : '/',
});
