export {default} from 'virtual:netlify-server-entry';
/* import type {AppLoadContext, EntryContext} from '@netlify/remix-runtime';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    scriptSrc: [
      'self',
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://*.googletagmanager.com',
      'https://*.stape.net',
      'https://*.stape.io',
      'https://*.cspsandbox.work',
      'https://csp.ngrok.app',
      'https://comptoir-sud-pacifique.com',
      'https://*.comptoir-sud-pacifique.com',
      'https://*.cookiebot.com',
      "'sha256-nZ9wPMe+fA5/ijAw5mdCvVwY2RrSH8mD2sxkCibnsOA='",
      ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*'] : []),
    ],
    imgSrc: [
      'https://shopify.com',
      'https://*.shopify.com',
      'placehold.co',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://*.cookiebot.com',
      "'self'",
      'data:',
    ],
    styleSrc: [
      '*.typekit.net',
      'https://*.googletagmanager.com',
      'https://*.googleapis.com',
      "'self'",
      "'unsafe-inline'",
    ],
    frameSrc: [
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com',
      'https://*.cookiebot.com',
      'https://*.cspsandbox.work',
      "'self'",
    ],
    fontSrc: [
      '*.typekit.net',
      '*.googleapis.com',
      '*.gstatic.com',
      "'self'",
      'https://*.cookiebot.com',
    ],
    connectSrc: [
      "'self'",
      'https://*.google-analytics.com',
      'https://*.google.com',
      'https://google.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
      'https://*.stape.net',
      'https://*.stape.io',
      'https://*.cspsandbox.work',
      'https://*.comptoir-sud-pacifique.com',
      'https://comptoir-sud-pacifique.com',
      'https://*.cookiebot.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
 */
