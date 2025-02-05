import {Suspense, useEffect, useState} from 'react';
import {GiftIcon} from '../icons';
import {useIntersection} from '@shopify/react-intersection-observer';

import {Await, useRouteLoaderData} from '@remix-run/react';
import ProductForm from './ProductForm';
import {EnhancedProduct} from './ProductMain';
import {ProductVariant} from '@shopify/hydrogen/storefront-api-types';

const FixedCartBtn = ({
  product,
  selectedVariant,
  variants,
  isSample,
}: {
  product: EnhancedProduct;
  selectedVariant: ProductVariant;
  isSample: boolean;
}) => {
  const [intersection, intersectionRef] = useIntersection();
  const [fixedCartBtn, setFixedCartBtn] = useState(false);

  const {i18nData} = useRouteLoaderData('root');

  useEffect(() => {
    if (intersection.isIntersecting == true && !isSample) {
      setFixedCartBtn(true);
    }

    if (isSample) {
      setFixedCartBtn(false);
    }
  }, [intersection]);

  return (
    <>
      <div
        className={`${
          !fixedCartBtn ? 'block' : 'fixed bottom-0'
        } bg-white w-full left-0 p-4 z-20`}
      >
        <div className="text-center text-xs text-slate-800 py-1 flex md:hidden justify-center align-middle items-center gap-2">
          <GiftIcon /> <div>{i18nData.promo_product.text_sample_gift}</div>
        </div>
        <Suspense
          fallback={
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={[]}
            />
          }
        >
          <Await
            errorElement="There was a problem loading product variants"
            resolve={variants}
          >
            {(data) => (
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={data.product?.variants.nodes || []}
              />
            )}
          </Await>
        </Suspense>
        {selectedVariant &&
          selectedVariant.price &&
          selectedVariant.price.amount &&
          selectedVariant.price.amount >= 30 && (
            <div className="text-center text-xs text-slate-800 hidden md:flex justify-center align-middle items-center gap-2">
              <GiftIcon /> <div>{i18nData.promo_product.text_sample_gift}</div>
            </div>
          )}
      </div>
      <div ref={intersectionRef}></div>
    </>
  );
};

export default FixedCartBtn;
