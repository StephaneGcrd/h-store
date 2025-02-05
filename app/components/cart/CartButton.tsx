import React, {useState, useEffect, Suspense} from 'react';
import CartDrawer from './CartDrawer';
import {
  Await,
  useFetcher,
  useFetchers,
  useRouteLoaderData,
} from '@remix-run/react';
import {CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import {Cart} from './types';
import {ShoppingCartIcon} from '../icons';

const CartButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {cart} = useRouteLoaderData('root') as {cart: Cart};

  const fetcher = useFetcher({key: 'cart-fetcher'});

  const {publish, shop, cart: analyticsCart, prevCart} = useAnalytics();

  const handleButtonClick = () => {
    setIsDrawerOpen(true);

    publish('cart_viewed', {
      cart: analyticsCart,
      prevCart,
      shop,
      url: window.location.href || '',
    } as CartViewPayload);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
      if (fetcher.state == 'loading') {
        const {data} = fetcher;

        const {errors} = data;

        if (!errors) {
          //setToastContent(<SuccessCartNotification />);
          setIsDrawerOpen(true);
        }
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, fetcher.state]);

  return (
    <>
      {' '}
      <Suspense fallback={<></>}>
        <Await
          errorElement="There was a problem loading the cart"
          resolve={cart}
        >
          {(cart) => (
            <button onClick={handleButtonClick} className="flex">
              <ShoppingCartIcon />
              {cart && cart.totalQuantity && cart.totalQuantity > 0 ? (
                <span className="ml-1 text-white inline-block w-4 h-4 text-xs bg-comptoir-blue rounded-full">
                  {cart?.totalQuantity}
                </span>
              ) : (
                <></>
              )}
            </button>
          )}
        </Await>
      </Suspense>
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default CartButton;
