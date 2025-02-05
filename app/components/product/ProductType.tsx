import {useRouteLoaderData} from '@remix-run/react';
import React from 'react';

const ProductType = ({type}: {type: string}) => {
  const {i18nData} = useRouteLoaderData('root');

  if (i18nData[type]) {
    return <h2 className="font-normal w-fit px-2">{i18nData[type]}</h2>;
  }
  return null;
};

export default ProductType;
