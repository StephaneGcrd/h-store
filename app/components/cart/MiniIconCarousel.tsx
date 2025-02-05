import React, {useState, useEffect, useRef} from 'react';

export interface MiniIconItem {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const MiniIconCarousel: React.FC<{items: MiniIconItem[]}> = ({items}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
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
    <div className="relative overflow-hidden  py-2 pb-2 mb-0 h-20 border-b border-b-slate-200 ">
      <div
        className="flex transition-transform duration-500"
        style={{transform: `translateX(-${currentIndex * 100}%)`}}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="w-full flex-shrink-0 flex items-center justify-center font-avenir font-normal"
          >
            <div className="flex flex-row items-start py-2 w-full  h-full">
              <div className="flex justify-center px-2 items-start  h-full">
                <span className="text-xs font-semibold">{item.icon}</span>
              </div>
              <div className="flex flex-col items-start align-middle  h-full">
                <span className="text-xs font-semibold">{item.title}</span>
                <span className="text-xs text-start">{item.content}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1 mb-2">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 w-1 rounded-full ${
              currentIndex === idx ? 'bg-slate-400' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MiniIconCarousel;
