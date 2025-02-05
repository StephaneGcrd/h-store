import React from 'react';
import ProductType from './ProductType';

const TitleAndProductType = ({title, product_type}) => (
  <div className="mb-2 text-center p-4 md:py-8 pb-0 md:pb-4 flex flex-col justify-center items-center">
    <h1 className="t1">{title}</h1>
    <ProductType type={product_type} />
  </div>
);

export default TitleAndProductType;
