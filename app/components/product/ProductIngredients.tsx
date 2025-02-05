import React from 'react';
import {useRouteLoaderData} from '@remix-run/react';

interface ProductIngredientsProps {
  ingredients: string;
}

const ProductIngredients: React.FC<ProductIngredientsProps> = ({
  ingredients,
}) => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="my-2">
      <div className="">{i18nData.product_ingredients_title}</div>
      <div className="text-xs font-avenir">{ingredients}</div>
    </div>
  );
};

export default ProductIngredients;
