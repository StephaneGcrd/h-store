import React from 'react';

interface PriceProps {
  amount: string;
  currencyCode: string;
}

const Price: React.FC<PriceProps> = ({amount, currencyCode}) => {
  const formattedCurrency = currencyCode === 'EUR' ? '€' : currencyCode;

  return (
    <span>
      {amount} {formattedCurrency}
    </span>
  );
};

export default Price;
