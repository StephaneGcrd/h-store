import {FetcherWithComponents, useRouteLoaderData} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import React from 'react';
import {Button} from '../Button';
import InlineSpinner from '../common/InlineSpinner';

const CheckoutButton = ({
  checkoutUrl,
  letHouseChoose,
}: {
  checkoutUrl: string;
  letHouseChoose: boolean;
}) => {
  const {i18nData} = useRouteLoaderData('root');

  const getConsentParams = () => {
    if (typeof window !== 'undefined' && window.CookieConsent) {
      const {marketing, necessary, preferences, statistics} =
        window.CookieConsent.consent;

      const consentParams = new URLSearchParams({
        x: '1',
        m: marketing,
        n: necessary,
        p: preferences,
        s: statistics,
      });
      return consentParams;
    }

    return '';
  };

  return (
    <CartForm
      route="/cart"
      inputs={{
        lines: letHouseChoose
          ? [
              {
                merchandiseId: 'gid://shopify/ProductVariant/48277397832005',
                quantity: 1,
                attributes: [{key: 'FreeSamples', value: 'true'}],
              },
            ]
          : [],
        redirectTo: checkoutUrl + '?' + getConsentParams().toString(),
        freeSamples: 'true',
      }}
      action={CartForm.ACTIONS.LinesAdd}
      fetcherKey="cart-fetcher"
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <Button
            as="button"
            type="submit"
            className="w-full bg-comptoir-blue text-white py-2 px-4 block text-center"
          >
            {fetcher.state == 'idle' ? (
              <div className="flex justify-evenly">
                {i18nData.checkout_action}
              </div>
            ) : (
              <div className="flex justify-center align-middle">
                <InlineSpinner />
              </div>
            )}
          </Button>
        </>
      )}
    </CartForm>
  );
};

export default CheckoutButton;
