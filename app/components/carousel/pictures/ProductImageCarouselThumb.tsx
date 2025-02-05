import {Image} from '@shopify/hydrogen';

type PropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
  slide: any;
};

export const ProductImageCarouselThumb: React.FC<PropType> = (props) => {
  const {selected, onClick, slide} = props;

  return (
    <div>
      <button onClick={onClick} type="button" className="z-50">
        <div
          className={`h-16 w-16 border transition-all ${
            selected ? 'border-comptoir-blue' : 'border-transparent opacity-50'
          } `}
        >
          <Image
            aspectRatio="1/1"
            width={100}
            height={100}
            alt={slide.alt}
            data={slide}
            key={slide.id}
            className="object-fit"
          />
        </div>
      </button>
    </div>
  );
};
