import CardImage from './CardImage';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '../Link';
import {EnhancedProduct} from '../product/ProductMain';
import {useRouteLoaderData} from '@remix-run/react';

export function ProductItem({
  product,
  loading,
  isCarousel,
  customImage,
  customPrice,
}: {
  product: EnhancedProduct;
  loading?: 'eager' | 'lazy';
  isCarousel: boolean;
  customImage: any;
  customPrice: any;
}) {
  /*   const variant = product.variants.nodes[product.variants.nodes.length - 1];
   */
  /*   const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  const productType = product.type && product.type.value; */

  const {i18nData} = useRouteLoaderData('root');

  const getTrueMinPrice = (variants) => {
    if (!variants) {
      return false;
    }

    if (variants && !variants.nodes) {
      return false;
    }

    let minPrice = 1000;

    variants.nodes.forEach((variant) => {
      if (variant.title != 'Échantillon' && variant.title != 'Sample') {
        if (parseFloat(variant.price.amount) < minPrice) {
          minPrice = parseFloat(variant.price.amount);
        }
      }
    });

    return minPrice;
  };

  const checkIfPromotion = () => {
    let isPromo = false;

    product.variants.nodes.forEach((variant) => {
      if (variant.compareAtPrice) {
        isPromo = true;
      }
    });

    return isPromo;
  };

  return (
    <Link
      key={product.id}
      prefetch="viewport"
      to={`/products/${product.handle}`}
      className={`block justify-self-center h-fit w-[20rem] ${
        isCarousel ? 'pl-4' : 'pl-0'
      } md:pr-0`}
      /*       className="embla__slide border-slate-300 border-solid rounded-md p-4 pb-0 hover:opacity-70 transition-opacity h-96" */
    >
      {product.featuredImage && (
        <div className="overflow-hidden">
          <CardImage
            product={product}
            loading={loading}
            customImage={customImage}
          />
        </div>
      )}

      <div className="my-2 flex flex-col md:flex-row justify-between">
        <div className="t3 leading-6 text-[1rem] font-normal md:font-normal md:text-lg">
          {product.title}
        </div>
        <div className="h-12 text-left md:text-right">
          <div className="text-xs text-black">
            {i18nData[product?.type.value]}
          </div>

          {customPrice ? (
            <div className="text-xs justify-end">{customPrice.amount} €</div>
          ) : (
            <div className="text-xs flex items-center">
              {i18nData.product_item.price_starts_label + ' '}
              {getTrueMinPrice(product && product.variants) ||
                product.priceRange.minVariantPrice.amount}{' '}
              €
              {checkIfPromotion() && (
                <div className="w-[6px] h-[6px] bg-red-500 ml-1 rounded-full"></div>
              )}
            </div>
          )}
        </div>
      </div>
      {/*       <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small> */}
    </Link>
  );
}
