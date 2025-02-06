import {
  defer,
  type LinksFunction,
  type LoaderFunctionArgs,
  type AppLoadContext,
  type MetaArgs,
} from '@netlify/remix-runtime';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useRouteError,
  type ShouldRevalidateFunction,
  useLoaderData,
} from '@remix-run/react';
import {
  useNonce,
  Analytics,
  getShopAnalytics,
  getSeoMeta,
  type SeoConfig,
  Script,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {PageLayout} from '~/components/PageLayout';
import {GenericError} from '~/components/GenericError';
import {NotFound} from '~/components/NotFound';
import favicon from '~/assets/favicon.png';
import {seoPayload} from '~/lib/seo.server';

import {DEFAULT_LOCALE, parseMenu} from './lib/utils';
import {getLayoutData} from './data/layout';
import {I18N_CONTENT_QUERY} from './graphql/layout/i18nQuery';

import tailwindCss from './styles/tailwind.css?url';

import {DISCOVERY_OFFER_QUERY} from './graphql/discover-offer/DiscoveryOfferQueries';
import {ThirdPartyAnalyticsIntegration} from './components/ThirdPartyAnalyticsIntegration';
import {GoogleTagManager} from './components/GoogleTagManager';
import {useEffect} from 'react';

export type RootLoader = typeof loader;

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preconnect',
      href: 'https://use.typekit.net',
      crossOrigin: 'anonymous',
    },

    // Charger le CSS d’Adobe Typekit de façon non bloquante
    {
      rel: 'stylesheet',
      href: 'https://use.typekit.net/iku7gkb.css', // Remplacez XXXXX par votre identifiant Typekit
      media: 'print',
      onLoad: "this.media='all'",
    },
    {
      rel: 'stylesheet',
      href: tailwindCss,
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({
    ...deferredData,
    ...criticalData,
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({request, context}: LoaderFunctionArgs) {
  const isProduction = !request.url.includes('localhost');

  const [layout] = await Promise.all([
    getLayoutData(context),
    // Add other queries here, so that they are loaded in parallel
  ]);

  const seo = seoPayload.root({shop: layout.shop, url: request.url});

  const {storefront, env} = context;

  const i18nData = await storefront.query(I18N_CONTENT_QUERY, {
    variables: {
      language: storefront.i18n.language,
    },
  });

  return {
    layout,
    //seo,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
    },
    i18nData: JSON.parse(i18nData?.metaobject?.content?.value),
    selectedLocale: storefront.i18n,
    GTM_ID: 'GTM-P6PQHT5R',
    isProduction,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {cart, customerAccount, storefront} = context;

  const discoveryProducts = storefront.query(DISCOVERY_OFFER_QUERY, {
    variables: {
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  return {
    isLoggedIn: customerAccount.isLoggedIn(),
    cart: cart.get(),
    discoveryProducts,
  };
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  return null;
  /* if (data && !data.seo) {
    return null;
  }
  return getSeoMeta(data!.seo as SeoConfig); */
};

function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<typeof loader>('root');
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;

  useEffect(() => {
    // Function that creates and injects a style element with the fonts CSS
    const addDeferredFonts = () => {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.textContent = `
/* latin-ext */
@font-face {
  font-family: 'Albert Sans';
  font-style: italic;
  font-weight: 100 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/albertsans/v1/i7dMIFdwYjGaAMFtZd_QA1ZeUFuaHi6WZ3S_Yg.woff2)
    format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF,
    U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020,
    U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Albert Sans';
  font-style: italic;
  font-weight: 100 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/albertsans/v1/i7dMIFdwYjGaAMFtZd_QA1ZeUFWaHi6WZ3Q.woff2)
    format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'Albert Sans';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/albertsans/v1/i7dOIFdwYjGaAMFtZd_QA1ZVYFeQGQyUV3U.woff2)
    format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF,
    U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020,
    U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Albert Sans';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/albertsans/v1/i7dOIFdwYjGaAMFtZd_QA1ZbYFeQGQyU.woff2)
    format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'adobe-garamond-pro';
  src: url('https://use.typekit.net/af/5cace6/00000000000000003b9b00c2/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3')
      format('woff2'),
    url('https://use.typekit.net/af/5cace6/00000000000000003b9b00c2/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3')
      format('woff'),
    url('https://use.typekit.net/af/5cace6/00000000000000003b9b00c2/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3')
      format('opentype');
  font-display: swap;
  font-style: italic;
  font-weight: 400;
  font-stretch: normal;
}

@font-face {
  font-family: 'adobe-garamond-pro';
  src: url('https://use.typekit.net/af/2011b6/00000000000000003b9b00c1/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
      format('woff2'),
    url('https://use.typekit.net/af/2011b6/00000000000000003b9b00c1/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
      format('woff'),
    url('https://use.typekit.net/af/2011b6/00000000000000003b9b00c1/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
      format('opentype');
  font-display: swap;
  font-style: normal;
  font-weight: 400;
  font-stretch: normal;
}

@font-face {
  font-family: 'adobe-garamond-pro';
  src: url('https://use.typekit.net/af/fb3638/00000000000000003b9b00c3/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
      format('woff2'),
    url('https://use.typekit.net/af/fb3638/00000000000000003b9b00c3/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
      format('woff'),
    url('https://use.typekit.net/af/fb3638/00000000000000003b9b00c3/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
      format('opentype');
  font-display: swap;
  font-style: normal;
  font-weight: 600;
  font-stretch: normal;
}

@font-face {
  font-family: 'adobe-garamond-pro';
  src: url('https://use.typekit.net/af/d68363/00000000000000003b9b00c4/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i6&v=3')
      format('woff2'),
    url('https://use.typekit.net/af/d68363/00000000000000003b9b00c4/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i6&v=3')
      format('woff'),
    url('https://use.typekit.net/af/d68363/00000000000000003b9b00c4/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i6&v=3')
      format('opentype');
  font-display: swap;
  font-style: italic;
  font-weight: 600;
  font-stretch: normal;
}
      `;
      document.head.appendChild(style);
    };

    // If the document has already loaded, call the function immediately;
    // otherwise, wait for the load event.
    if (document.readyState === 'complete') {
      addDeferredFonts();
    } else {
      window.addEventListener('load', addDeferredFonts);
      // Clean up the event listener if the component unmounts before load.
      return () => window.removeEventListener('load', addDeferredFonts);
    }
  }, []);

  useEffect(() => {
    addGtmScript(data?.GTM_ID);
  }, [data?.GTM_ID]);

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="msvalidate.01" content="A352E6A0AF9A652267361BBB572B8468" />
        <Meta />
        <Links />
        <Script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}`,
          }}
        ></Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://load.sst.comptoir-sud-pacifique.com/ns.html?id=GTM-P6PQHT5R"
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          ></iframe>
        </noscript>

        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
            canTrack={() => data.isProduction}
          >
            <PageLayout
              key={`${locale.language}-${locale.country}`}
              layout={data.layout}
            >
              {children}
            </PageLayout>
            <ThirdPartyAnalyticsIntegration />
            <GoogleTagManager />
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  let title = 'Error';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <Layout>
      {isRouteError ? (
        <>
          {routeError.status === 404 ? (
            <NotFound type={pageType} />
          ) : (
            <GenericError
              error={{message: `${routeError.status} ${routeError.data}`}}
            />
          )}
        </>
      ) : (
        <GenericError error={error instanceof Error ? error : undefined} />
      )}
    </Layout>
  );
}

let gtmScriptAdded = false;

declare global {
  interface Window {
    [key: string]: object[];
  }
}

function addGtmScript(GTM_ID: string) {
  if (!GTM_ID || gtmScriptAdded) {
    return;
  }

  (function (w: Window, d: Document, s: 'script', l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s);
    j.async = true;
    j.src = 'https://load.sst.comptoir-sud-pacifique.com/2u7uzhicouo.js?' + i;
    f.parentNode?.insertBefore(j, f);
  })(
    window,
    document,
    'script',
    'dataLayer',
    'eo7ybtbs=aWQ9R1RNLVA2UFFIVDVS&apiKey=fcf9dee7',
  );

  gtmScriptAdded = true;
}
