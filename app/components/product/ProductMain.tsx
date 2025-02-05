import {useLoaderData, useLocation} from '@remix-run/react';
import React, {useEffect, useRef, useState} from 'react';
import ImageSlider from '../images/ImageSlider';
import TitleAndProductType from './TitleAndProductType';
import Description from './Description';
import FixedCartBtn from './FixedCartBtn';
import ProductNotes from './ProductNotes';
import ProductIngredients from './ProductIngredients';
import {Image} from '@shopify/hydrogen';
import FrequentQuestions from './FrequentQuestions';
import ProductReviews from './ProductReviews';
import ProductRating from './ProductRating';
import {
  Image as ImageType,
  Product,
  ProductVariant,
  Shop,
} from '@shopify/hydrogen/storefront-api-types';

type TextMetafield = {
  key: string;
  value: string;
};

export type EnhancedProduct = Product & {
  noteOne: TextMetafield;
  noteTwo: TextMetafield;
  noteThree: TextMetafield;
  heading_description: TextMetafield;
  photo_10: {
    reference: {image: ImageType};
  };
  photo_30: {
    reference: {image: ImageType};
  };
  photo_100: {
    reference: {image: ImageType};
  };
  photo_100_box: {
    reference: {image: ImageType};
  };
  photo_10030: {
    reference: {image: ImageType};
  };
  headNotes: {
    references: {
      nodes: Array<{id: string; label: {value: string}}>;
    };
  };
  heartNotes: {
    references: {
      nodes: Array<{id: string; label: {value: string}}>;
    };
  };
  baseNotes: {
    references: {
      nodes: Array<{id: string; label: {value: string}}>;
    };
  };
  productType: TextMetafield;
};

type PerfumeFaq = Array<{title: string; content: string}>;

const ProductMain = () => {
  const {product, shop, variants, perfumeFaq} = useLoaderData<{
    product: EnhancedProduct;
    shop: Shop;
    variants: ProductVariant;
    perfumeFaq: PerfumeFaq;
  }>();

  const reviewsRef = useRef(null);
  const executeScroll = () =>
    reviewsRef &&
    reviewsRef.current &&
    reviewsRef.current.scrollIntoView({behavior: 'smooth'});

  const location = useLocation();
  const [currentVariant, setCurrentVariant] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const variantParam = params.get(
      product?.variants.nodes[0].selectedOptions[0].name,
    );
    setCurrentVariant(variantParam);
  }, [location.search, variants]);

  const images = (currentVariant) => {
    try {
      const images = {
        '100 ml': product.photo_100?.reference.image,
        Box: product.photo_100_box?.reference.image,
        '30 ml': product.photo_30?.reference.image,
        '10 ml': product.photo_10?.reference.image,
        'Perfume Set': product.photo_10030?.reference.image,
      };

      let imageArray = [];
      if (['Perfume Set', 'Coffret Parfum'].includes(currentVariant)) {
        imageArray.push(images['Perfume Set']);
      } else {
        //check if image is defined
        if (images[currentVariant] !== undefined) {
          imageArray.push(images[currentVariant]);
        }
      }

      const otherImages = Object.keys(images).filter((key, index) => {
        if (key !== currentVariant && images[key] !== undefined) {
          imageArray.push(images[key]);
        }
      });

      //if imageArray is empty
      if (imageArray.length === 0) {
        imageArray.push(product.images.nodes[0]);
      }

      return imageArray;
    } catch (error) {
      console.error('Error fetching images:', error);
      return null;
    }
  };

  const productImages = images(currentVariant);

  return (
    <div className="product md:grid md:grid-cols-2">
      <div className="grid border-red-400 h-128 md:h-[800px]">
        {productImages && <ImageSlider images={productImages} />}
      </div>
      <div className="md:flex md:flex-col">
        <TitleAndProductType
          title={product.title}
          product_type={product.productType.value}
        />
        <ProductRating onClickScroll={executeScroll} />
        <Description
          headingDescription={product.heading_description?.value}
          descriptionHtml={product.descriptionHtml}
        />
        <div className="hidden md:block">
          <FixedCartBtn
            product={product}
            selectedVariant={product.selectedVariant}
            variants={variants}
            isSample={true}
          />
        </div>
        {/* Only displayed on desktop */}
        {product?.ingredients?.value && (
          <div className="hidden md:block p-4">
            <ProductIngredients ingredients={product.ingredients.value} />
          </div>
        )}
        {/* Only displayed on mobile */}
        {product.headNotes?.references &&
          product.heartNotes?.references &&
          product.baseNotes?.references && (
            <div className="block md:hidden p-4">
              <ProductNotes
                noteOne={product.headNotes}
                noteTwo={product.heartNotes}
                noteThree={product.baseNotes}
              />
            </div>
          )}
      </div>
      <div className="block md:hidden">
        <FixedCartBtn
          product={product}
          selectedVariant={product.selectedVariant}
          variants={variants}
          isSample={false}
        />
      </div>
      {product?.ingredients?.value && (
        <div className="block md:hidden p-4">
          <ProductIngredients ingredients={product.ingredients.value} />
        </div>
      )}
      {product.headNotes?.references &&
        product.heartNotes?.references &&
        product.baseNotes?.references && (
          <div className="hidden md:block p-4">
            <ProductNotes
              noteOne={product.headNotes}
              noteTwo={product.heartNotes}
              noteThree={product.baseNotes}
            />
          </div>
        )}
      <div className="h-52 md:h-128 m-0 overflow-hidden relative">
        <Image
          data={product.photo_notes?.reference.image}
          className="object-cover h-full w-full absolute z-0"
        />
      </div>
      <ProductReviews parentRef={reviewsRef} />
      <FrequentQuestions questions={perfumeFaq} productPage={true} />
    </div>
  );
};

export default ProductMain;
