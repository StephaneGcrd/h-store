import {Image} from '@shopify/hydrogen';

import CardTagList from './CardTagList';
import {EnhancedProduct} from '../product/ProductMain';

const CardImage = ({
  product,
  loading,
  customImage,
}: {
  product: EnhancedProduct;
  loading?: 'eager' | 'lazy';
  customImage: any;
}) => {
  const imageToDisplayOnMain = () => {
    const photoCard =
      product.photo_card &&
      product.photo_card.reference &&
      product.photo_card.reference.image;

    if (photoCard) {
      return photoCard;
    } else {
      return product.featuredImage;
    }
  };

  const imageToDisplayOnHover = () => {
    const photoCardHover =
      product.photo_card_hover &&
      product.photo_card_hover.reference &&
      product.photo_card_hover.reference.image;

    if (photoCardHover) {
      return photoCardHover;
    } else {
      return product.featuredImage;
    }
  };

  return (
    <div className="relative w-full">
      <Image
        alt={product.featuredImage.altText || product.title}
        aspectRatio="4/5"
        width={350}
        height={350}
        data={customImage || imageToDisplayOnMain()}
        crop="center"
        loading={loading}
        className="w-full h-auto bg-gradient-to-t from-[#f7f7f7] via-[#fafafc] to-[#f7f7f7] bg-[#f7f7f7]"
      />
      <div className="hidden md:block md:absolute top-0 bottom-0 left-0 right-0 h-full opacity-0 hover:opacity-100">
        <div className="relative">
          <div className="p-2 absolute bottom-0 right-0">
            <CardTagList tags={product.tags} />
          </div>
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="4/5"
            width={350}
            height={350}
            data={customImage || imageToDisplayOnHover()}
            crop="center"
            loading={loading}
            className="w-full bg-gradient-to-t from-[#f7f7f7] via-[#fafafc] to-[#f7f7f7] bg-[#f7f7f7] "
          />
        </div>
      </div>
    </div>
  );
};

export default CardImage;
