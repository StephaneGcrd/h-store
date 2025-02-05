import {Image} from '@shopify/hydrogen';
import React from 'react';

import {useRouteLoaderData} from '@remix-run/react';
import NewsletterForm from './NewsletterForm';

const NewsletterClubSection = () => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="grid lg:grid-cols-1 border-blue-700 mt-8 p-4">
      <div className="flex w-full justify-center border-red-100">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex justify-center">
            <Image
              src="https://cdn.shopify.com/s/files/1/0757/4333/0629/files/pourvous_cspbig.jpg?v=1729588322"
              width={200}
            />
          </div>
          <div className="h-full text-center md:text-start border-amber-400 p-4 md:p-8 lg:p-16 flex flex-col justify-center">
            <h1 className="t2 font-normal mb-4">{i18nData.newsletter.title}</h1>
            {/*           <div className="w-full flex justify-center">
            <div className="h-[1px] bg-black w-24"></div>
          </div> */}
            <div className="max-w-[650px] text-left lg:text-left mb-2">
                {i18nData.newsletter.details.part_1 + ' '}
              <span className="font-semibold">
                {i18nData.newsletter.details.part_1_bold}
              </span>
            </div>
            <div className="max-w-[650px]  text-left lg:text-left">
              {i18nData.newsletter.details.part_2}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full h-full justify-center align-middle items-center border-green-400 p-4 md:px-0">
        <div className=" border-red-500 w-full">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
};

export default NewsletterClubSection;
