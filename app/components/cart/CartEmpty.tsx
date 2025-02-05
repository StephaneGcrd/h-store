import {useRouteLoaderData} from '@remix-run/react';
import React from 'react';

const CartEmpty = ({onClose}) => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="p-4 text-center">
      <p className="mb-4">{i18nData.cart_empty}</p>
      <button
        className="bg-comptoir-blue text-white py-2 px-4"
        onClick={onClose}
      >
        {i18nData.cart_continue_shopping}
      </button>
    </div>
  );
};

export default CartEmpty;
