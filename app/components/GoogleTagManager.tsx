import {useAnalytics} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {convertToGoogleConsentMode} from '~/utils/consentUtils';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  useEffect(() => {
    subscribe('product_viewed', (data) => {
      // Triggering a custom event in GTM when a product is viewed
      const products = data.products;

      console.log('product view', products);
      window.dataLayer.push({
        event: 'view_item',
        debug_mode: true,
        currency: data?.shop?.currency,
        foo: 'bar',
        items: [
          ...products.map((product) => ({
            item_id: product.variantId,
            item_name: product.title,
            price: product.price,
            item_variant: product.variantTitle,
            affiliation: 'Comptoir Sud Pacifique',
            item_brand: 'Comptoir Sud Pacifique',
            quantity: product.quantity,
          })),
        ],
      });
    });

    subscribe('cart_viewed', (data) => {
      const gtagCartData = {
        currency: data.shop?.currency,
        value: data.cart?.cost?.totalAmount?.amount,
        items: [
          ...data.cart?.lines.edges.map(({node}) => ({
            item_id: node.merchandise.id,
            item_name: node.merchandise.product.title,
            price: node.merchandise.price.amount,
            item_variant: node.merchandise.title,
            affiliation: 'Comptoir Sud Pacifique',
            item_brand: 'Comptoir Sud Pacifique',
            quantity: node.quantity,
          })),
        ],
      };

      window.dataLayer.push({
        event: 'cart_viewed',
        ...gtagCartData,
      });
    });

    subscribe('custom_consent_update', (data) => {
      /*       window.dataLayer.push({
        event: 'consent',
        consent: 'update',
        data: convertToGoogleConsentMode(data),
      });
 */
      /* 

      window.dataLayer.push({
        ''
      }); */
    });

    subscribe('custom_add_to_cart', (data) => {
      //console.log('ThirdPartyAnalyticsIntegration - Add to cart:', data);

      window.dataLayer.push({
        event: 'add_to_cart',
      });
    });

    subscribe('custom_search', (data) => {
      //console.log('ThirdPartyAnalyticsIntegration - Search', data);
      /*       window.dataLayer.push({
        event: 'search',
      }); */
    });

    ready();
  }, []);

  return null;
}
