import React, {useState, useEffect, useRef} from 'react';
import IconInfo, {IconInfoProps} from './IconInfo';

export interface IconInfoItem extends IconInfoProps {}

const IconInfosCarousel: React.FC<{items: IconInfoItem[]}> = ({items}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Automatically move to the next slide every 3 seconds.
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, items.length]);

  return (
    <div className="relative overflow-hidden mb-4">
      {/* Slides container */}
      <div
        className="flex transition-transform duration-500 mb-2"
        style={{transform: `translateX(-${currentIndex * 100}%)`}}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <IconInfo
              icon={item.icon}
              title={item.title}
              content={item.content}
            />
          </div>
        ))}
      </div>
      {/* Pagination dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-2 rounded-full ${
              currentIndex === idx ? 'bg-slate-400' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default IconInfosCarousel;
