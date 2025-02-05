import {Await, useRouteLoaderData} from '@remix-run/react';
import React, {Suspense, useEffect, useState, useRef} from 'react';
import {Cart, CartLineNode} from './types';
import CartItem from './CartItem';
import CheckoutButton from './CheckoutButton';
import CartDiscounts from './CartDiscounts';
import TotalPrice from './TotalPrice';
import {CartLine} from '@shopify/hydrogen/storefront-api-types';
import FreeDeliveryCounter from './FreeDeliveryCounter';
import CartEmpty from './CartEmpty';
import {
  CloseIcon,
  RightArrowTailIcon,
  GiftIcon,
  TruckIcon,
  PhoneIcon,
  ClosedMailIcon,
} from '../icons';
import ChooseSamples from './ChooseSamples';
import MiniIconCarousel, {MiniIconItem} from './MiniIconCarousel';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({isOpen, onClose}: CartDrawerProps) => {
  const {cart, i18nData} = useRouteLoaderData('root') as {cart: Cart};
  const [isChoosingSamples, setIsChoosingSamples] = useState(false);
  const [letHouseChoose, setLetHouseChoose] = useState(true);

  // Refs for tracking touch coordinates
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChooseSamples = () => {
    setIsChoosingSamples(true);
  };

  const handleBackToCart = () => {
    setIsChoosingSamples(false);
  };

  // Touch event handlers for swipe-to-close functionality
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchCurrentXRef.current = touch.clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null) {
      const deltaX = touchCurrentXRef.current - touchStartXRef.current;
      // If the user swiped more than 50px from left to right, trigger onClose.
      if (deltaX > 50) {
        onClose();
      }
    }
    // Reset touch values.
    touchStartXRef.current = null;
    touchCurrentXRef.current = 0;
  };

  // Define mini icon items.
  const miniIconItems: MiniIconItem[] = [
    {
      icon: <GiftIcon fill="#475769" />,
      title: i18nData.footer.icon_text.item_1.title || 'Gift',
      content: i18nData.footer.icon_text.item_1.content,
    },
    {
      icon: <TruckIcon fill="#475769" />,
      title: i18nData.footer.icon_text.item_2.title || 'Shipping',
      content: i18nData.footer.icon_text.item_2.content,
    },
    {
      icon: <ClosedMailIcon fill="#475769" />,
      title: i18nData.footer.icon_text.item_4.title || 'Email',
      content: i18nData.footer.icon_text.item_4.content,
    },
  ];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 p-4 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-full md:w-[375px] flex flex-col`}
    >
      <div className="t2 pb-2">{i18nData.cart_title}</div>
      <button onClick={onClose} className="absolute top-4 right-4">
        <CloseIcon className="w-6 h-6" />
      </button>
      <div className="w-full border-b border-slate-200"></div>

      <Suspense fallback={<></>}>
        <Await
          errorElement="There was a problem loading the cart"
          resolve={cart}
        >
          {(cart) => (
            <>
              {isChoosingSamples ? (
                <ChooseSamples
                  onBack={handleBackToCart}
                  checkoutUrl={cart.checkoutUrl}
                  letHouseChoose={letHouseChoose}
                />
              ) : (
                <>
                  {cart && cart.totalQuantity > 0 ? (
                    <>
                      {/* Mini icon carousel above the product list */}
                      <MiniIconCarousel items={miniIconItems} />

                      <div
                        id="scrollableDiv"
                        className="overflow-y-auto flex-grow"
                      >
                        {cart.lines.edges.map(({node}: {node: CartLine}) => (
                          <CartItem key={node.id} node={node} />
                        ))}
                      </div>
                      <div className="p-0 w-full">
                        <TotalPrice cost={cart.cost} />

                        <CartDiscounts discountCodes={cart.discountCodes} />
                        {parseFloat(cart.cost.totalAmount.amount) >= 30.0 && (
                          <div className="bg-slate-100 rounded-sm p-4 my-2">
                            <div className="t3">{i18nData.cart.gift.title}</div>
                            <button
                              onClick={handleChooseSamples}
                              className="flex w-full  text-black border border-black py-2 px-4 block text-center mt-2 justify-center items-center"
                            >
                              {i18nData.cart.gift.choice}
                              <RightArrowTailIcon className="w-4 h-4 ml-2" />
                            </button>
                            <div className="flex align-middle justify-center items-center">
                              <div className="border-b border-black w-4 m-2"></div>
                              {i18nData.cart.gift.or}{' '}
                              <div className="border-b border-black w-4 m-2"></div>
                            </div>
                            <div className="mt-2">
                              <input
                                type="checkbox"
                                id="letHouseChoose"
                                checked={
                                  parseFloat(cart.cost.totalAmount.amount) >=
                                    30.0 && letHouseChoose
                                }
                                onChange={(e) =>
                                  setLetHouseChoose(e.target.checked)
                                }
                              />
                              <label htmlFor="letHouseChoose" className="ml-2">
                                {i18nData.cart.gift.house_choice}
                              </label>
                            </div>
                          </div>
                        )}
                        <CheckoutButton
                          checkoutUrl={cart?.checkoutUrl}
                          letHouseChoose={
                            parseFloat(cart.cost.totalAmount.amount) >= 30.0 &&
                            letHouseChoose
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <CartEmpty onClose={onClose} />
                  )}
                </>
              )}
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
};

export default CartDrawer;
