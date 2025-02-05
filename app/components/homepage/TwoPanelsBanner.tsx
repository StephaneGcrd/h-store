import {Image} from '@shopify/hydrogen';
import React from 'react';

import {Link} from '../Link';

const TwoPanelsBanner = ({element}) => {
  const {
    title,
    action_btn_link,
    action_btn_text,
    description,
    desktop_orientation,
    image_panel_picture,
    mobile_orientation,
    text_panel_color,
    text_panel_picture,
    color_for_the_text,
  } = element;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div
        className={`bg-comptoir-cream h-96 md:h-[600px] w-full relative ${
          mobile_orientation == 'TEXT_TOP' ? 'order-2' : 'order-first'
        } ${
          desktop_orientation == 'TEXT_RIGHT' ? 'md:order-1' : 'md:order-2'
        } `}
      >
        <Image
          data={image_panel_picture}
          className={`object-cover absolute h-full`}
          loading="eager"
        />
      </div>
      <div
        className={`bg-${text_panel_color} h-72 md:h-[600px] relative order-first  ${
          mobile_orientation == 'TEXT_TOP' ? 'order-first' : 'order-2'
        } ${desktop_orientation == 'TEXT_RIGHT' ? 'md:order-2' : 'md:order-1'}`}
      >
        <div className="h-full w-full absolute z-20 flex justify-center items-center  ">
          <div className={`text-start px-4 text-${color_for_the_text}`}>
            <div className="t-banner">{title}</div>
            <div className="py-4 w-full md:max-w-[500px] ">{description}</div>
            <Link to={action_btn_link}>
              <button
                className={`w-full md:w-fit btn-image bg-transparent text-center text-${color_for_the_text} border-${color_for_the_text} `}
              >
                {action_btn_text}
              </button>
            </Link>
          </div>
        </div>
        {text_panel_picture && text_panel_picture.url && (
          <Image
            data={text_panel_picture}
            className={`object-cover absolute h-full`}
            loading="eager"
          />
        )}
      </div>
    </div>
  );
};

export default TwoPanelsBanner;
