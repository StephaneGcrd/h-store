import React from 'react';
import {CartForm} from '@shopify/hydrogen';
import {FetcherWithComponents} from '@remix-run/react';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import {Button} from '../Button';
import ProgressIndicator from './ProgressIndicator';

interface CartActionBarProps {
  selectedProducts: Array<Product>;
  selectedProductsString: string;
  i18nData: any;
}

const CartActionBar: React.FC<CartActionBarProps> = ({
  selectedProducts,
  selectedProductsString,
  i18nData,
}) => {
  const merchandiseId = 'gid://shopify/ProductVariant/47410518262085';
  const productCount = selectedProducts.length;

  const renderButtonText = (fetcherState: string) => {
    if (productCount < 6) {
      const remaining = 6 - productCount;
      return `${i18nData.discovery_box?.products_remaining_1} ${remaining} ${
        productCount === 5
          ? i18nData.discovery_box?.products_remaining_2_singular
          : i18nData.discovery_box?.products_remaining_2_plural
      }`;
    }
    return fetcherState === 'idle'
      ? i18nData.product_add_cart
      : i18nData.feedback_update_loading;
  };

  const buttonClasses = `w-full h-12 ${
    productCount === 6 ? 'bg-comptoir-blue text-white' : 'bg-white text-black'
  }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg w-full">
      <CartForm
        route="/cart"
        inputs={{
          lines: [
            {
              merchandiseId,
              quantity: 1,
              attributes: [{key: 'Fragrances', value: selectedProductsString}],
            },
          ],
        }}
        action={CartForm.ACTIONS.LinesAdd}
        fetcherKey="cart-fetcher"
      >
        {(fetcher: FetcherWithComponents<any>) => (
          <Button as="button" type="submit" className={buttonClasses}>
            {renderButtonText(fetcher.state)}
          </Button>
        )}
      </CartForm>
      <ProgressIndicator count={productCount} total={6} />
    </div>
  );
};

export default CartActionBar;
