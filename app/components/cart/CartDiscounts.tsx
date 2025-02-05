import React, {useState} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {CartDiscountCode} from '@shopify/hydrogen/storefront-api-types';
import {IconCheck} from '../Icon';
import {useRouteLoaderData} from '@remix-run/react';

interface CartDiscountsProps {
  discountCodes: CartDiscountCode[];
}

const CartDiscounts = ({discountCodes}: CartDiscountsProps) => {
  const [inputValue, setInputValue] = useState('');

  const {i18nData} = useRouteLoaderData('root');

  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <dl className={codes && codes.length !== 0 ? 'grid' : 'hidden'}>
        <div className="flex items-center justify-between font-medium">
          <dt>{i18nData.cart_discounts}</dt>
          <div className="flex items-center justify-between">
            <UpdateDiscountForm>
              <button>
                <span aria-hidden="true" style={{height: 18, marginRight: 4}}>
                  &times;
                </span>
              </button>
            </UpdateDiscountForm>
            <dd>{codes?.join(', ')}</dd>
          </div>
        </div>
      </dl>

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center gap-4 justify-between text-copy mb-2">
          <input
            className="input-class border-none w-full px-0 focus:ring-0 py-2"
            type="text"
            name="discountCode"
            placeholder={i18nData.cart_discounts_form}
            value={inputValue}
            onChange={handleInputChange}
          />
          {inputValue && (
            <button className="flex justify-end font-medium whitespace-nowrap">
              <IconCheck />
            </button>
          )}
        </div>
      </UpdateDiscountForm>
    </>
  );
};

const UpdateDiscountForm = ({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) => {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
};

export default CartDiscounts;
