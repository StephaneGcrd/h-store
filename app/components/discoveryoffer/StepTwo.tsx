import React, {useState, useEffect} from 'react';
import {Product} from '@shopify/hydrogen/storefront-api-types';
import ProductList from './ProductList';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import TypeFilter from './TypeFilter';
import {FetcherWithComponents, useRouteLoaderData} from '@remix-run/react';
import {Button} from '../Button';
import {CartForm} from '@shopify/hydrogen';
import CartActionBar from './CartActionBar';

interface StepTwoProps {
  products: Array<{id: string; product: Product}>;
}

const StepTwo: React.FC<StepTwoProps> = ({products}) => {
  const {i18nData} = useRouteLoaderData('root');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedProductsString, setSelectedProductsString] =
    useState<string>('');

  const handleSelect = (product: Product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else if (selectedProducts.length < 6) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleTagChange = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (tagFilter.includes(lowerTag)) {
      setTagFilter(tagFilter.filter((t) => t !== lowerTag));
    } else {
      setTagFilter([...tagFilter, lowerTag]);
    }
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
  };

  const filteredProducts = products.filter(
    ({id, product}) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (tagFilter.length === 0 ||
        tagFilter.some((tag) =>
          product.tags
            .map((tag) => tag.toLowerCase())
            .includes(tag.toLowerCase()),
        )) &&
      (typeFilter === '' ||
        typeFilter === 'everything' ||
        product.type.value === typeFilter),
  );

  useEffect(() => {
    const titles = selectedProducts.map((product) => product.title).join(', ');
    setSelectedProductsString(titles);
  }, [selectedProducts]);

  return (
    <div className="p-4">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <TagFilter tagFilter={tagFilter} handleTagChange={handleTagChange} />
      {/*       <TypeFilter typeFilter={typeFilter} handleTypeChange={handleTypeChange} /> */}
      <ProductList
        products={filteredProducts}
        selectedProducts={selectedProducts}
        handleSelect={handleSelect}
      />
      <CartActionBar
        selectedProducts={selectedProducts}
        selectedProductsString={selectedProductsString}
        i18nData={i18nData}
      />
      {/* Add more content for actions here */}
    </div>
  );
};

export default StepTwo;

// Fidèle à nos engagements, voici un code d'une valeur de 24 € à utiliser lors de votre prochaine commande. Ce code est valable trois mois pour un montant minimum de 90€.
