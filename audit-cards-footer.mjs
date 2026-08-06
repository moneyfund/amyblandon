const targets = [
  'https://amyblandon.com/',
  'https://amyblandon.com/wp-content/uploads/blocksy/css/global.css?ver=36841',
  'https://amyblandon.com/wp-content/themes/blocksy/static/bundle/main.min.css?ver=2.1.44',
  'https://amyblandon.com/wp-json/wp/v2/pages?per_page=100',
];

const urls = targets.flatMap((target) => [target, `https://r.jina.ai/${target}`]);
const headers = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
  'accept': '*/*',
  'accept-language': 'es-ES,es;q=0.9,en;q=0.7',
};

const probes = [
  'Para tu crecimiento financiero',
  'Bienes Raíces',
  'gspb_text-id-gsbp-a5d0960',
  'gspb_text-id-gsbp-bfbcf2b',
  'gspb_heading-id-gsbp-1f15bd8',
  'ct-footer',
  'footer',
  '--theme-palette-color-4',
  '--theme-palette-color-1',
  'background-color',
  '#050505',
  '#001929',
];

for (const url of urls) {
  try {
    const response = await fetch(url, { headers, redirect: 'follow' });
    const text = await response.text();
    console.log(`=== FETCH ${url} ===`);
    console.log(JSON.stringify({ status: response.status, finalUrl: response.url, contentType: response.headers.get('content-type'), length: text.length }));
    console.log(text.slice(0, 800));
    for (const probe of probes) {
      let index = text.indexOf(probe);
      let count = 0;
      while (index >= 0 && count < 3) {
        console.log(`--- MATCH ${probe} @ ${index} ---`);
        console.log(text.slice(Math.max(0, index - 900), Math.min(text.length, index + 2600)));
        index = text.indexOf(probe, index + probe.length);
        count += 1;
      }
    }
  } catch (error) {
    console.log(`=== FETCH ERROR ${url} ===`);
    console.log(String(error));
  }
}
