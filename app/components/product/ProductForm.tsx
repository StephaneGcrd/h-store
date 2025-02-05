import VariantSelectorWrapper from './productForm/VariantSelectorWrapper';
import AddToCartWrapper from './productForm/AddToCartWrapper';

const ProductForm = ({
  product,
  selectedVariant,
  variants,
  scrollBack,
}: {
  product: EnhancedProduct;
  selectedVariant: EnhancedProduct['selectedVariant'];
  variants: Array<ProductVariantFragment>;
  scrollBack: any;
}) => {
  const onSale =
    product &&
    product.selectedVariant?.compareAtPrice &&
    product.selectedVariant?.compareAtPrice.amount;

  const isSample =
    product.id == 'gid://shopify/Product/8739272753477' ||
    product.handle == 'sample';

  return (
    <div className="product-form">
      <VariantSelectorWrapper
        isSample={isSample}
        product={product}
        variants={variants}
        selectedVariant={selectedVariant}
        scrollBack={scrollBack}
      />
      <div className="h-4"></div>
      <AddToCartWrapper selectedVariant={selectedVariant} onSale={onSale} />
      <div className="h-4"></div>
    </div>
  );
};

export default ProductForm;
