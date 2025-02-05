import {useRef, Suspense} from 'react';

import {
  defer,
  type MetaArgs,
  redirect,
  type LoaderFunctionArgs,
} from '@netlify/remix-runtime';
import {useLoaderData, Await, useNavigate} from '@remix-run/react';
import {
  getSeoMeta,
  getSelectedProductOptions,
  Analytics,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import type {ProductQuery} from 'storefrontapi.generated';

import {seoPayload} from '~/lib/seo.server';

import {routeHeaders} from '~/data/cache';

import ImageSlider from '~/components/images/ImageSlider';
import {PRODUCT_QUERY, VARIANTS_QUERY} from '~/graphql/product/ProductQueries';
import {PERFUME_FAQ_QUERY} from '~/graphql/content/ContentQueries';
import ProductMain from '~/components/product/ProductMain';
import {linksToDefine} from '~/lib/createCanonicalLinks';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {productHandle} = args.params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  params,
  request,
  context,
}: LoaderFunctionArgs) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const [{shop, product}, perfumeFaq] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    context.storefront.query(PERFUME_FAQ_QUERY, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),

    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  if (!product.selectedVariant) {
    throw redirectToFirstVariant({product, request});
  }

  //const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant

  const selectVariant = () => {
    const filter_one = product.variants.nodes.filter(
      (node) => node.title == '100 ml',
    );
    if (filter_one.length == 1) {
      return filter_one[0];
    } else {
      return product.variants.nodes[0];
    }
  };

  const firstVariant = selectVariant();

  const selectedVariant = product.selectedVariant ?? firstVariant;

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  const public_key = 'bc8192fda71c1ea1e735ffd5bd5f6197';
  const scope = product.id.split('Product/')[1]; // or Product ID (string or integer)

  const url = `https://api.guaranteed-reviews.com/public/v3/reviews/${public_key}/${scope}`;

  const reviews_query = await fetch(url).then((response) => response.json());

  return {
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    //recommended,
    seo,
    perfumeFaq: JSON.parse(perfumeFaq.metaobject.fields[0].value),
    clientReviews: reviews_query,
    dynamicLinks: linksToDefine(request, params),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({params, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return {variants};
}

export const meta = ({data}) => {
  return [
    {
      title: `${
        data.translatedProductType ? data.translatedProductType + ' - ' : ''
      } ${data.product.title}${
        data.product.selectedVariant &&
        data.product.selectedVariant.title != 'Default Title'
          ? ` - ${data.product.selectedVariant.title}`
          : ''
      } | Comptoir Sud Pacifique`,
    },
    {
      name: 'description',
      content:
        data.product.description +
        ' ' +
        `${data.product.title}${
          data.product.selectedVariant &&
          data.product.selectedVariant.title != 'Default Title'
            ? ` ${data.product.selectedVariant.title}`
            : ''
        }`,
    },
    {
      'script:ld+json': {
        '@context': 'http://schema.org/',
        '@type': 'Product',
        url: data.currentUrl,
        name:
          (data.translatedProductType ? `${data.translatedProductType} ` : '') +
          data.product.title,
        image: data.product.images && data.product.images.nodes[0].url,
        description: data.product.description,
        sku: data.product.sku,
        brand: {
          '@type': 'Brand',
          name: 'Comptoir Sud Pacifique',
        },
        offers: data.product.variants.nodes.map((variant) => {
          return {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2025-01-20',
            url: data.currentUrl,
            priceCurrency: 'EUR',
            price: parseFloat(variant.price.amount),
            sku: variant.sku,
          };
        }),
      },
    },
    data.dynamicLinks.map((link) => {
      let newLink = {};

      if (link.hreflang) {
        newLink['hrefLang'] = link.hreflang;
      }

      return {
        tagName: 'link',
        rel: link.rel,
        href: link.href,
        ...newLink,
      };
    }),
  ];
};

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductQuery['product'];
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const selectVariant = () => {
    const filter_one = product!.variants.nodes.filter(
      (node) => node.title == '100 ml',
    );
    if (filter_one.length == 1) {
      return filter_one[0];
    } else {
      return product!.variants.nodes[0];
    }
  };

  const firstVariant = selectVariant();
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  url.search = searchParams.toString();

  return redirect(url.href.replace(url.origin, ''), 302);
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  return (
    <>
      <ProductMain />
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: product.selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: product.selectedVariant?.id || '',
              variantTitle: product.selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}

/* 
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    display: metafield(namespace: "custom", key: "display"){
      value
    }
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        optionValues {
          name
        }
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const; */
/* 
async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
 */
