import React from 'react';
import {Money} from '@shopify/hydrogen';

const PriceDisplay = ({selectedVariant, onSale}) => (
  <div className="flex">
    {onSale ? (
      <>
        <Money
          data={selectedVariant?.compareAtPrice}
          withoutCurrency
          className="line-through"
        />{' '}
        € <div className="w-2"></div>
        <Money data={selectedVariant?.price} withoutCurrency /> €{' '}
      </>
    ) : (
      <>
        <Money data={selectedVariant?.price} withoutCurrency /> €{' '}
      </>
    )}
  </div>
);

export default PriceDisplay;
