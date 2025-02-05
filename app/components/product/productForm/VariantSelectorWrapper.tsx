import React, {Suspense} from 'react';

import {Await} from '@remix-run/react';
import {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import {EnhancedProduct} from '../ProductMain';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import VariantList from './VariantList';

const VariantSelectorWrapper = ({
  isSample,
  product,
  variants,
  selectedVariant,
  scrollBack,
}: {
  isSample: boolean;
  product: EnhancedProduct;
  variants: Promise<Array<ProductVariantFragmentFragment>>;
  selectedVariant: EnhancedProduct['selectedOrFirstAvailableVariant'];
  scrollBack: any;
}) => (
  <div
    onClick={() => scrollBack}
    className={isSample ? 'sample-product-options' : ''}
  >
    <Suspense fallback={<></>}>
      <Await
        errorElement="There was a problem loading the cart"
        resolve={variants}
      >
        {(variants) => (
          <VariantList productHandle={product.handle} variants={variants} />
        )}
      </Await>
    </Suspense>
  </div>
);

export default VariantSelectorWrapper;
