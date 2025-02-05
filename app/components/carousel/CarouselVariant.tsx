import React, {useCallback, useEffect, useState} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {LeftArrowIcon, RightArrowIcon} from '../icons';
import {ProductItem} from '../PerfumeCard/PerfumeCard';
import {ProductImageCarouselDot} from './pictures/ProductImageCarouselDot';

const CarouselVariant = ({variants}: {children: React.ReactNode}) => {
  const [emblaRef, emblaMainApi] = useEmblaCarousel({
    align: 'start',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const scrollPrev = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  return (
    <div className="">
      <div className="overflow-hidden" ref={emblaRef}>
        <div
          className={`flex h-fit w-screen ${
            variants.length < 4 && 'md:justify-center'
          }`}
        >
          {variants.map((variant, key) => (
            <div
              key={key}
              className="min-w-0 flex-[0_0_16rem] md:flex-[0_0_20rem] flex justify-center [&:first-child]:ml-6 [&:last-child]:mr-4"
            >
              <ProductItem
                product={variant.product}
                isCarousel={true}
                customImage={variant.title != '100 ml' && variant.image}
                customPrice={variant.title != '100 ml' && variant.price}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="block md:hidden w-full flex justify-center">
        <div className=" w-32 h-8">
          <div ref={emblaThumbsRef}>
            <div className="flex flex-row gap-2 p-2 w-full justify-center">
              {variants.map((variant, key) => (
                <ProductImageCarouselDot
                  key={key}
                  onClick={() => onThumbClick(key)}
                  selected={key === selectedIndex}
                  index={key}
                  slide={variant.product.image}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-full justify-center gap-12">
        <button className="h-12" onClick={scrollPrev}>
          <LeftArrowIcon className="w-8" />
        </button>
        <button className="h-12" onClick={scrollNext}>
          <RightArrowIcon className="w-8" />
        </button>
      </div>
    </div>
  );
};

export default CarouselVariant;
