import {Image} from '@shopify/hydrogen';
import {SectionContentImageText} from '~/types';

import {Link} from '../Link';

const ImageText = ({element}: {element: SectionContentImageText}) => {
  const {
    action_btn_link,
    action_btn_text,
    description,
    desktop_image,
    mobile_image,
    subtitle,
    text_color,
    text_orientation,
    text_color_mobile,
    title,
  } = element;

  const isTextLeft = () => {
    if (text_orientation == 'TEXT_LEFT') {
      return true;
    } else {
      return false;
    }
  };

  const textColor = () => {
    if (text_color_mobile) {
      return `text-${text_color_mobile} md:text-${text_color}`;
    } else {
      return `text-${text_color}`;
    }
  };

  const borderColor = () => {
    if (text_color_mobile) {
      return `border-${text_color_mobile} md:border-${text_color}`;
    } else {
      return `border-${text_color}`;
    }
  };

  return (
    <div>
      <div>
        <div className={`overflow-hidden relative h-[80vh]`}>
          <div
            className={`${textColor()} bg-black w-full h-full ${
              text_color_mobile &&
              (text_color_mobile == 'white' ? 'opacity-15' : 'opacity-0')
            } ${
              text_color_mobile &&
              (text_color == 'md:white' ? 'md:opacity-15' : 'md:opacity-0')
            } ${
              !text_color_mobile &&
              (text_color == 'white' ? 'opacity-15' : 'opacity-0')
            } absolute z-10`}
          ></div>
          <>
            <Image
              data={mobile_image}
              className={`object-cover h-full w-full absolute block md:hidden`}
              fetchPriority="high"
              loading="eager"
            />
            <Image
              data={desktop_image}
              className={`object-cover h-full w-full absolute hidden md:block`}
              fetchPriority="high"
              loading="eager"
            />
          </>
          <div className="bg-black w-full h-full absolute opacity-0"></div>
          <div className="absolute w-full h-full grid grid-cols-1 md:grid-cols-2 z-30">
            <div
              className={`${
                !isTextLeft() && 'col-start-2'
              } flex flex-col items-center justify-between md:justify-center w-screen md:w-full pt-8 pb-12 md:py-8 ${textColor()}`}
            >
              <div className="flex flex-col items-center md:items-start px-2">
                <div className={`text-center md:text-left t-banner  w-full `}>
                  {title}
                </div>
                <div
                  className={`text-center md:text-left mx-2 md:mx-0 md:my-2 pb-4 pt-2 font-regular  w-full max-w-xl`}
                >
                  {description}
                </div>
                {action_btn_text && (
                  <Link to={action_btn_link}>
                    <button
                      className={`btn-image hidden md:block border-${text_color} ${textColor()}`}
                    >
                      {action_btn_text}
                    </button>
                  </Link>
                )}
              </div>
              {action_btn_text && (
                <Link to={action_btn_link} className="block md:hidden">
                  <button
                    className={`btn-image border-${text_color_mobile} ${textColor()}`}
                  >
                    {action_btn_text}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/*         {content.spinning_logo && (
          <div className="hidden md:block w-44 h-44 mt-[-90px] ml-[120px] lg:ml-[220px] z-10 ">
            <img src={logo_rond} className=" animate-spin-slow" />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ImageText;

/* const oldComponentText = () => (
  <div className="absolute w-full h-full  grid grid-cols-1 md:grid-cols-2">
    <div className=" col-start-2 flex flex-col items-center justify-center w-screen md:w-full">
      <div className="text-center t-banner text-white italic">
        {content.header}
      </div>
      <div className="text-center text-white max-w-l p-4">
        {content.content}
      </div>
      <LocaleLink to={content.discover_link_to}>
        <button className="btn-image">{content.discover_btn}</button>
      </LocaleLink>
    </div>
  </div>
); */
