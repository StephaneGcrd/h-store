import {flattenConnection} from '@shopify/hydrogen';
import type {LoaderArgs} from '@netlify/remix-runtime';
import type {SitemapQuery} from 'storefrontapi.generated';

/**
 * the google limit is 50K, however, the storefront API
 * allows querying only 250 resources per pagination page
 */
const MAX_URLS = 250;

type Entry = {
  url: string;
  lastMod?: string;
  changeFreq?: string;
  image?: {
    url: string;
    title?: string;
    caption?: string;
  };
};

export async function loader({
  params,
  request,
  context: {storefront},
}: LoaderArgs) {
  const {locale} = params;
  const data = await storefront.query(SITEMAP_QUERY, {
    variables: {
      urlLimits: MAX_URLS,
      language: storefront.i18n.language,
    },
  });

  if (!data) {
    throw new Response('No data found', {status: 404});
  }

  const sitemap = generateSitemap({
    data,
    baseUrl: new URL(request.url).origin,
    locale,
  });

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

function generateSitemap({
  data,
  baseUrl,
  locale,
}: {
  data: SitemapQuery;
  baseUrl: string;
  locale: string;
}) {
  const products = flattenConnection(data.products)
    .filter(
      (product) =>
        product.onlineStoreUrl &&
        product.id != 'gid://shopify/Product/8805118476613',
    )
    .map((product) => {
      const url = locale
        ? `${baseUrl}/${locale}/products/${xmlEncode(product.handle)}`
        : `${baseUrl}/products/${xmlEncode(product.handle)}`;

      const productEntry: Entry = {
        url,
        lastMod: product.updatedAt,
        changeFreq: 'daily',
      };

      if (product.featuredImage?.url) {
        productEntry.image = {
          url: xmlEncode(product.featuredImage.url),
        };

        if (product.title) {
          productEntry.image.title = xmlEncode(product.title);
        }

        if (product.featuredImage.altText) {
          productEntry.image.caption = xmlEncode(product.featuredImage.altText);
        }
      }

      return productEntry;
    });

  const collections = flattenConnection(data.collections)
    .filter((collection) => collection.onlineStoreUrl)
    .map((collection) => {
      const url = locale
        ? `${baseUrl}/${locale}/collections/${collection.handle}`
        : `${baseUrl}/collections/${collection.handle}`;

      return {
        url,
        lastMod: collection.updatedAt,
        changeFreq: 'daily',
      };
    });

  const pages = flattenConnection(data.pages)
    .filter((page) => page.onlineStoreUrl)
    .map((page) => {
      const url = locale
        ? `${baseUrl}/${locale}/pages/${page.handle}`
        : `${baseUrl}/pages/${page.handle}`;

      return {
        url,
        lastMod: page.updatedAt,
        changeFreq: 'weekly',
      };
    });

  const urls = [...products, ...collections, ...pages];

  return `
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    >
      ${urls.map(renderUrlTag).join('')}
    </urlset>`;
}

function renderUrlTag({url, lastMod, changeFreq, image}: Entry) {
  const imageTag = image
    ? `<image:image>
        <image:loc>${image.url}</image:loc>
        <image:title>${image.title ?? ''}</image:title>
        <image:caption>${image.caption ?? ''}</image:caption>
      </image:image>`.trim()
    : '';

  /*   const convertUrlToLocaleUrl = (url, locale) => {
    if (locale == 'x-default') {
      return url;
    }
    const protocol = url.split('//')[0];
    const urlSplit = url.split('//')[1].split('/');

    console.log([urlSplit[0], locale, ...urlSplit.slice(1)].join('/'));

    return (
      protocol + '//' + [urlSplit[0], locale, ...urlSplit.slice(1)].join('/')
    );
  }; */

  return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>${changeFreq}</changefreq>
      ${imageTag}
    </url>
  `.trim();
}

const SITEMAP_QUERY = `#graphql
  query Sitemap($urlLimits: Int, $language: LanguageCode)
  @inContext(language: $language) {
    products(
      first: $urlLimits
      query: "published_status:'online_store:visible'"
    ) {
      nodes {
        updatedAt
        handle
        id
        onlineStoreUrl
        title
        featuredImage {
          url
          altText
        }
      }
    }
    collections(
      first: $urlLimits
      query: "published_status:'online_store:visible'"
    ) {
      nodes {
        updatedAt
        handle
        onlineStoreUrl
      }
    }
    pages(first: $urlLimits, query: "published_status:'published'") {
      nodes {
        updatedAt
        handle
        onlineStoreUrl
      }
    }
  }
` as const;
