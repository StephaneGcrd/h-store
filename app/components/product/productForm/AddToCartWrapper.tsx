import React from 'react';

import PriceDisplay from './PriceDisplay';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useRouteLoaderData} from '@remix-run/react';

const AddToCartWrapper = ({selectedVariant, onSale}) => {
  const {i18nData} = useRouteLoaderData('root');
  return (
    <AddToCartButton
      disabled={!selectedVariant || !selectedVariant.availableForSale}
      lines={
        selectedVariant
          ? [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ]
          : []
      }
      className="bg-comptoir-blue p-2 text-white h-10"
    >
      {selectedVariant?.availableForSale ? (
        <div className="flex justify-evenly">
          {i18nData.product_add_cart}
          <PriceDisplay selectedVariant={selectedVariant} onSale={onSale} />
        </div>
      ) : (
        i18nData.product_sold_out
      )}
    </AddToCartButton>
  );
};

export default AddToCartWrapper;
