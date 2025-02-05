import {Image} from '@shopify/hydrogen';
import {ProductVariantFragment} from 'storefrontapi.generated';

const ProductImage = ({
  image,
  alt,
}: {
  image: ProductVariantFragment['image'];
  alt: string;
}) => {
  if (!image) {
    return <div className="product-image" />;
  }

  return (
    <div className="h-full m-0 overflow-hidden flex justify-center items-center bg-white">
      <div className="h-full w-full m-0 overflow-hidden">
        <Image
          alt={alt}
          aspectRatio="10/9"
          width={800}
          height={800}
          data={image}
          key={image.id}
          crop="center"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default ProductImage;
