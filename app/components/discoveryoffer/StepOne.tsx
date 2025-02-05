import {useRouteLoaderData} from '@remix-run/react';
import React from 'react';
import {RightArrowIcon} from '../icons';
import {Image} from '@shopify/hydrogen';

interface StepOneProps {
  onBegin: () => void;
}

const StepOne: React.FC<StepOneProps> = ({onBegin}) => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="h-64 md:h-128 w-full">
        <Image
          src="https://cdn.shopify.com/s/files/1/0757/4333/0629/files/Web_54.jpg?v=1737970190"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="w-full h-96 md:h-128 bg-comptoir-blue flex justify-center items-center p-4 md:p-8">
        <div className="text-white max-w-[800px] flex justify-center items-center flex-col text-center sm:text-start sm:block">
          <h1 className="t1 ">{i18nData.discovery_box.title}</h1>
          <p className="mt-2">{i18nData.discovery_box.offer_1}</p>
          <p className="mt-2">{i18nData.discovery_box.offer_2}</p>

          <button
            onClick={onBegin}
            className="border border-white p-2 mt-4 flex"
          >
            {i18nData.discovery_box.btn_to_step_2}
            <RightArrowIcon className="w-6 h-6 fill-white" />
          </button>
          <p className="mt-4 text-xs">{i18nData.discovery_box.offer_3}</p>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
