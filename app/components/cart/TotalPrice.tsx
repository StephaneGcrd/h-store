import React from 'react';
import {CartCost} from './types';
import Price from '../common/Price';

interface TotalPriceProps {
  cost: CartCost;
}

const TotalPrice = ({cost}: TotalPriceProps) => {
  const {subtotalAmount, totalAmount} = cost;

  return (
    <div className="text-sm flex justify-between py-2">
      {/*       <div>
        Subtotal: {subtotalAmount.amount} {subtotalAmount.currencyCode}
      </div> */}
      <div>Total</div>
      <div>
        <Price
          amount={totalAmount.amount}
          currencyCode={totalAmount.currencyCode}
        />
      </div>
    </div>
  );
};

export default TotalPrice;
