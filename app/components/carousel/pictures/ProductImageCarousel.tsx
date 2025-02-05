import React, {useState, useEffect, useCallback} from 'react';
import {EmblaOptionsType} from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import ProductImage from './ProductImage';
import {ProductImageCarouselThumb} from './ProductImageCarouselThumb';
import {ProductImageCarouselDot} from './ProductImageCarouselDot';
import {useLoaderData} from '@remix-run/react';

type PropType = {
  images: number[];
  mainImage: any;
  options?: EmblaOptionsType;
};

const ProductImageCarousel: React.FC<PropType> = (props) => {
  const {mainImage, images, options} = props;

  const {product} = useLoaderData();

  const getProductImagesFromMetafields = () => {
    const images = {
      '100':
        (product.photo_100 &&
          product.photo_100.reference &&
          product.photo_100.reference.image) ||
        product.images.nodes[0],
      '100_box':
        (product.photo_100_box &&
          product.photo_100_box.reference &&
          product.photo_100_box.reference.image) ||
        product.images.nodes[1],
      '30':
        product.photo_30 &&
        product.photo_30.reference &&
        product.photo_30.reference.image,
      '10':
        product.photo_10 &&
        product.photo_10.reference &&
        product.photo_10.reference.image,
      '100-30':
        product.photo_10030 &&
        product.photo_10030.reference &&
        product.photo_10030.reference.image,
    };

    const moodPics =
      product.photos_mood &&
      product.photos_mood.references &&
      product.photos_mood.references.nodes;

    const photo_array = [
      images['100'],
      images['100_box'],
      images['30'],
      images['10'],
      images['100-30'],
    ];

    if (moodPics) {
      const moodPicsCleaned = moodPics.map((mp) => {
        return {...mp.image};
      });

      return [...photo_array.filter((im) => im && im.url), ...moodPicsCleaned];
    }

    return photo_array.filter((im) => im && im.url);
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;

      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  const imageSlides = [mainImage, ...images];

  const imageSlidesCleaned = () => {
    const cleanedImages = [];
    imageSlides.map((image) => {
      const filteredImages = cleanedImages.filter(
        (_image) => image.id == _image.id,
      );
      const alreadyExists = filteredImages.length > 0;

      if (!alreadyExists) {
        cleanedImages.push(image);
      }
    });
    return cleanedImages;
  };

  return (
    <div className="embla w-full">
      <div className="embla__viewport relative" ref={emblaMainRef}>
        <div className="embla__container">
          {getProductImagesFromMetafields().map((image, key) => {
            return (
              <div className="embla__slide" key={key}>
                <ProductImage image={image} alt={image.alt} />
              </div>
            );
          })}
        </div>
        <div className="hidden md:block md:absolute top-0" ref={emblaThumbsRef}>
          <div className="flex flex-col gap-2 p-2">
            {getProductImagesFromMetafields().map((image, key) => (
              <ProductImageCarouselThumb
                key={key}
                onClick={() => onThumbClick(key)}
                selected={key === selectedIndex}
                index={key}
                slide={image}
              />
            ))}
          </div>
        </div>
        <div
          className="absolute md:hidden bottom-0 w-full"
          ref={emblaThumbsRef}
        >
          <div className="flex flex-row gap-2 p-2 w-full justify-center">
            {getProductImagesFromMetafields().map((image, key) => (
              <ProductImageCarouselDot
                key={key}
                onClick={() => onThumbClick(key)}
                selected={key === selectedIndex}
                index={key}
                slide={image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageCarousel;
