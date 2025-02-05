import React from 'react';

import RemoveButton from './RemoveButton';
import CartLineQuantityAdjust from './CartLineQuantityAdjust';
import {CartLine} from '@shopify/hydrogen/storefront-api-types';
import {Image} from '@shopify/hydrogen';
import Price from '../common/Price';

const CartItem = ({node}: {node: CartLine}) => {
  const {cost} = node;
  const {amountPerQuantity, compareAtAmountPerQuantity, totalAmount} = cost;

  const isGift = node.attributes?.some((attr) => attr.key === 'gift');

  const returnTitleIfNotDefault = (title: string) => {
    const excludedTitles = [
      'Default Title',
      'Another Title',
      'Sample Title',
      '6',
    ];
    return !excludedTitles.includes(title) ? title : '';
  };

  const isDiscoveryOffer =
    node.merchandise.id == 'gid://shopify/ProductVariant/47410518262085';

  const returnAttributeFragrancesIfDiscovery = (attributes: any) => {
    if (isDiscoveryOffer) {
      return attributes.find((attr: any) => attr.key === 'Fragrances')?.value;
    }
    return '';
  };

  return (
    <div key={node.id} className="py-4 border-b flex">
      <div>
        <Image
          alt={node.merchandise.product.title}
          data={node.merchandise.image}
          height={100}
          loading="lazy"
          width={80}
          className="bg-slate-100"
        />
      </div>
      <div className="ml-2 w-full">
        <div className="t3 text-start">{node.merchandise.product.title}</div>
        {isDiscoveryOffer ? (
          <div className="text-xs text-start">
            {returnAttributeFragrancesIfDiscovery(node.attributes)}
          </div>
        ) : (
          <div className="text-xs text-start">
            {returnTitleIfNotDefault(node.merchandise.title)}
          </div>
        )}
        <div className="flex justify-between w-full">
          <div className="flex space-x-2">
            <div className=" flex items-center align-middle pb-2">
              <RemoveButton lineId={node.id} isGift={isGift} />
            </div>
            {!isGift && <CartLineQuantityAdjust line={node} />}
          </div>
          <div className="flex gap-2 text-xs items-center">
            {compareAtAmountPerQuantity && (
              <div className="line-through">
                <Price
                  amount={(
                    parseFloat(compareAtAmountPerQuantity.amount) *
                    node.quantity
                  ).toFixed(2)}
                  currencyCode={compareAtAmountPerQuantity.currencyCode}
                />
              </div>
            )}
            <div>
              <Price
                amount={totalAmount.amount}
                currencyCode={totalAmount.currencyCode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
