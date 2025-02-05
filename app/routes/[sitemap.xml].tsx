import type {LoaderArgs} from '@netlify/remix-runtime';

export async function loader({request, context: {storefront}}: LoaderArgs) {
  const sitemap = `
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>https://www.comptoir-sud-pacifique.com/sitemap_.xml</loc>
    </sitemap>
    <sitemap>
      <loc>https://www.comptoir-sud-pacifique.com/en-gb/sitemap_.xml</loc>
    </sitemap>
    <sitemap>
      <loc>https://www.comptoir-sud-pacifique.com/fr-fr/sitemap_.xml</loc>
    </sitemap>
  </sitemapindex>
  `;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60}`,
    },
  });
}

function xmlEncode(string: string) {
  return string.replace(/[&<>'"]/g, (char) => `&#${char.charCodeAt(0)};`);
}
