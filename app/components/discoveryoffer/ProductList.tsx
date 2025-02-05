import React from 'react';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import {useRouteLoaderData} from '@remix-run/react';

interface ProductListProps {
  products: Array<Product>;
  selectedProducts: Array<Product>;
  handleSelect: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedProducts,
  handleSelect,
}) => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map(({id, product}) => (
        <div
          key={id}
          className={`border p-4 ${
            selectedProducts.includes(product) ? 'border-comptoir-blue' : ''
          }`}
        >
          <label>
            <input
              type="checkbox"
              className="hidden"
              checked={selectedProducts.includes(product)}
              onChange={() => handleSelect(product)}
            />
            <div className="t3">{product.title}</div>
            <div className="text-xs">{i18nData[product.type.value]}</div>
            <div className="text-xs mt-4 font-garamond tracking-wide">
              <div>
                {product.headNotes?.references?.nodes
                  .map((node) => node.label.value)
                  .join(', ')}
              </div>
              <div>
                {product.heartNotes?.references?.nodes
                  .map((node) => node.label.value)
                  .join(', ')}
              </div>
              <div>
                {product.baseNotes?.references?.nodes
                  .map((node) => node.label.value)
                  .join(', ')}
              </div>
            </div>

            {/*             <ul>
              {product.tags.map((tag) => (
                <li key={tag}>{tag}
              ))}
            </ul> */}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
