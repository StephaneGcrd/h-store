import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@netlify/remix-runtime';

import {getSeoMeta} from '@shopify/hydrogen';

import {routeHeaders} from '~/data/cache';
import {Suspense, useState} from 'react';

import StepOne from '~/components/discoveryoffer/StepOne';
import StepTwo from '~/components/discoveryoffer/StepTwo';

import {DISCOVERY_OFFER_QUERY} from '~/graphql/discover-offer/DiscoveryOfferQueries';
import {Await, useLoaderData, useRouteLoaderData} from '@remix-run/react';
import {Product} from '@shopify/hydrogen/storefront-api-types';

const PAGE_BY = 8;

export const headers = routeHeaders;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const products = await storefront.query(DISCOVERY_OFFER_QUERY, {
    variables: {
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  return {products};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function DiscoveryOffer() {
  const {products} = useLoaderData();

  const [step, setStep] = useState(1);

  const handleBegin = () => {
    setStep(2);
  };

  return (
    <>
      {step === 1 && <StepOne onBegin={handleBegin} />}
      {step === 2 && (
        <Suspense fallback={<></>}>
          <Await
            errorElement="There was a problem loading the cart"
            resolve={products}
          >
            {(products) => {
              const cleanedProducts = products.metaobject.variants.references
                .nodes as Array<Product>;

              return <StepTwo products={cleanedProducts} />;
            }}
          </Await>
        </Suspense>
      )}
    </>
  );
}
