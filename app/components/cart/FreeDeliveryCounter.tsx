import React from 'react';

interface FreeDeliveryCounterProps {
  totalAmount: string;
}

const FreeDeliveryCounter = ({totalAmount}: FreeDeliveryCounterProps) => {
  const freeDeliveryThreshold = 79.0;
  const amountLeft = freeDeliveryThreshold - parseFloat(totalAmount);
  const progress = Math.min(
    (parseFloat(totalAmount) / freeDeliveryThreshold) * 100,
    100,
  );

  return (
    <div className="p-4 font-bold">
      {amountLeft > 0 ? (
        <div>
          <div>Spend {amountLeft.toFixed(2)} more to get free delivery!</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{width: `${progress}%`}}
            ></div>
          </div>
        </div>
      ) : (
        <div>You have qualified for free delivery!</div>
      )}
    </div>
  );
};

export default FreeDeliveryCounter;
