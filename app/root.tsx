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
import resetStyles from './styles/reset.css?url';
import styles from '~/styles/app.css?url';
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
    {rel: 'stylesheet', href: tailwindCss},
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: styles},
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
