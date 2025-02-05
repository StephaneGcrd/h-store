type PropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
  slide: any;
};

export const ProductImageCarouselDot: React.FC<PropType> = (props) => {
  const {selected, onClick} = props;

  return (
    <div>
      <button onClick={onClick} type="button" className="z-50">
        <div
          className={`h-2 w-2 bg-slate-400 rounded-full transition-all ${selected ? '' : 'opacity-50'} `}
        ></div>
      </button>
    </div>
  );
};
