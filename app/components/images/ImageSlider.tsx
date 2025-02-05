import {Image} from '@shopify/hydrogen';
import React, {useRef} from 'react';
import {LeftArrowIcon, RightArrowIcon} from '../icons';

const ImageSlider = ({images}) => {
  // Function that returns the number of images on screen following the length of the screen width
  const getNumberOfImagesOnScreen = () => {
    return 1;
  };

  const totalImages = images.length;

  const trueNumberOfSlides = Math.ceil(
    totalImages / getNumberOfImagesOnScreen(),
  );

  const ImageSliderTest = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const sliderRef = useRef(null);

    const nextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length,
      );
    };

    const handleTouchStart = (e) => {
      const touchStartX = e.touches[0].clientX;
      sliderRef.current.touchStartX = touchStartX;
    };

    const handleTouchMove = (e) => {
      if (!sliderRef.current.touchStartX) return;
      const touchEndX = e.touches[0].clientX;
      const touchDiff = sliderRef.current.touchStartX - touchEndX;

      if (touchDiff > 50) {
        nextImage();
        sliderRef.current.touchStartX = null;
      } else if (touchDiff < -50) {
        prevImage();
        sliderRef.current.touchStartX = null;
      }
    };

    return (
      <div
        className="relative overflow-hidden"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div
          className="w-full h-full flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: '100%',
          }}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              data={image}
              alt="placeholder"
              className="object-cover w-full h-full flex-shrink-0 md:w-1/2"
            />
          ))}
        </div>
        <button
          onClick={prevImage}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full border border-slate-500 ml-2 text-white p-2 disabled:opacity-50"
        >
          <LeftArrowIcon className="w-8 h-8 fill-slate-500" />
        </button>
        <button
          onClick={nextImage}
          disabled={currentIndex === trueNumberOfSlides - 1}
          className="absolute right-0 top-1/2 transform -translate-y-1/2  rounded-full border border-slate-500 mr-2 text-white p-2 disabled:opacity-50"
        >
          <RightArrowIcon className="w-8 h-8 fill-slate-500" />
        </button>
        <ImageIndicator
          currentIndex={currentIndex}
          totalImages={images.length}
          numberOfImagesOnScreen={trueNumberOfSlides}
        />
      </div>
    );
  };
  return <ImageSliderTest />;
};

const ImageIndicator = ({
  currentIndex,
  totalImages,
  numberOfImagesOnScreen,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {Array.from({length: numberOfImagesOnScreen}).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index === currentIndex ? 'bg-white' : 'bg-gray-400'
          }`}
        />
      ))}
    </div>
  );
};

export default ImageSlider;
