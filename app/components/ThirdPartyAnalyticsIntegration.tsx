import {useAnalytics} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';

export function ThirdPartyAnalyticsIntegration() {
  const {subscribe, register, customerPrivacy, canTrack, privacyBanner} =
    useAnalytics();

  const [consentMode, setConsentMode] = useState(null);

  /*   const CreateCookieBotListener = () => {
    if (window && window.CookieConsent) {
      window.CookieConsent = new Proxy(window.CookieConsent, {
        set: (obj, prop, value) => {
          if (prop == 'host') {
            const pushEvent = new CustomEvent('consentUpdate', {
              detail: obj && obj.consent,
            });
            window.dispatchEvent(pushEvent);
          }
          return Reflect.set(obj, prop, value);
        },
      });

      window.addEventListener('consentUpdate', (event) => {
        console.log(consentMode);
        if (event.detail) {
          setConsentMode(event.detail);
        }
      });
    }

    return null;
  };

  CreateCookieBotListener(); */

  // Register this analytics integration - this will prevent any analytics events
  // from being sent until this integration is ready
  const {ready} = register('Third Party Analytics Integration');

  const displayWindowShopifyIfWindowExists = () => {
    if (typeof window !== 'undefined') {
      //console.log(window.Shopify?.customerPrivacy?.currentVisitorConsent());
    }
  };

  displayWindowShopifyIfWindowExists();

  useEffect(() => {
    // Standard events
    subscribe('page_viewed', (data) => {
      //console.log(canTrack());
      console.log('ThirdPartyAnalyticsIntegration - Page viewed:', data);
    });
    /*     subscribe('product_viewed', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Product viewed:', data);
    }); */
    subscribe('collection_viewed', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Collection viewed:', data);
    });

    subscribe('cart_updated', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Cart updated:', data);
    });
    subscribe('custom_consent_update', (data) => {
      console.log('ThirdPartyAnalyticsIntegration - Consent updated:', data);
    });

    // Custom events
    subscribe('custom_checkbox_toggled', (data) => {
      console.log(
        'ThirdPartyAnalyticsIntegration - Custom checkbox toggled:',
        data,
      );
    });

    // Mark this analytics integration as ready as soon as it's done setting up
    ready();
  }, []);

  return <></>;
}
