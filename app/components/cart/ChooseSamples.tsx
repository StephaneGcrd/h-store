import {
  Await,
  FetcherWithComponents,
  useRouteLoaderData,
} from '@remix-run/react';
import React, {Suspense, useState} from 'react';
import {AddToCartButton} from '../AddToCartButton';
import {CartForm} from '@shopify/hydrogen';
import {Button} from '../Button';
import InlineSpinner from '../common/InlineSpinner';
import {
  CloseIcon,
  LeftArrowIcon,
  RightArrowDropIcon,
  SearchIcon,
} from '../icons';

const ChooseSamples = ({
  onBack,
  checkoutUrl,
}: {
  onBack: () => void;
  checkoutUrl: string;
}) => {
  const {discoveryProducts, i18nData} = useRouteLoaderData('root');
  const [selectedSamples, setSelectedSamples] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectSample = (id: string) => {
    setSelectedSamples((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sampleId) => sampleId !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const getSelectionStatus = () => {
    if (selectedSamples.length === 0) {
      return (
        <div className=' className="w-full text-black py-2 px-4 block text-center"'>
          {i18nData.cart.freesample.select_1}
        </div>
      );
    } else if (selectedSamples.length === 1) {
      return (
        <div className=' className="w-full text-black py-2 px-4 block text-center"'>
          {i18nData.cart.freesample.select_2}
        </div>
      );
    } else {
      return (
        <AddSamplesToCartForm
          selectedSamples={selectedSamples}
          checkoutUrl={checkoutUrl}
          i18nData={i18nData}
        />
      );
    }
  };

  const filteredProducts = (variants) => {
    return variants.filter((variant) =>
      variant.product.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <button onClick={onBack} className="mb-4 flex justify-start items-center">
        <LeftArrowIcon />
        Go back
      </button>
      <div className="mb-2 h-96">{getSelectionStatus()}</div>
      <div className="relative w-full mb-2">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-slate-100 border-none pl-10 pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <CloseIcon
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-4 h-4"
            onClick={() => setSearchTerm('')}
          />
        )}
      </div>
      <div className="overflow-y-auto flex-grow">
        <Suspense>
          <Await resolve={discoveryProducts}>
            {(res) =>
              filteredProducts(res.metaobject.variants.references.nodes).map(
                (node) => (
                  <SampleNode
                    key={node.id}
                    node={node}
                    isSelected={selectedSamples.includes(node.id)}
                    onSelect={() => handleSelectSample(node.id)}
                    isDisabled={
                      selectedSamples.length >= 2 &&
                      !selectedSamples.includes(node.id)
                    }
                  />
                ),
              )
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

const SampleNode = ({
  node,
  isSelected,
  onSelect,
  isDisabled,
}: {
  node: any;
  isSelected: boolean;
  onSelect: () => void;
  isDisabled: boolean;
}) => {
  const {i18nData} = useRouteLoaderData('root');
  return (
    <div
      onClick={!isDisabled ? onSelect : undefined}
      className={`p-2 py-4 border ${
        isSelected ? 'border-comptoir-blue' : 'border-gray-300'
      } cursor-pointer mb-2 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="t3">{node.product.title}</div>
      <div className="text-xs">{i18nData[node.product.type.value]}</div>
      <div className="text-xs mt-4 font-garamond tracking-wide">
        <div>
          {node.product.headNotes?.references?.nodes
            .map((note) => note.label.value)
            .join(', ')}
        </div>
        <div>
          {node.product.heartNotes?.references?.nodes
            .map((note) => note.label.value)
            .join(', ')}
        </div>
        <div>
          {node.product.baseNotes?.references?.nodes
            .map((note) => note.label.value)
            .join(', ')}
        </div>
      </div>
    </div>
  );
};

const AddSamplesToCartForm = ({
  selectedSamples,
  checkoutUrl,
  i18nData,
}: {
  selectedSamples: string[];
  checkoutUrl: string;
  i18nData: any;
}) => {
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines: selectedSamples.map((selectedSample) => {
          return {
            merchandiseId: selectedSample,
            quantity: 1,
            attributes: [{key: 'FreeSamples', value: 'true'}],
          };
        }),
        redirectTo: checkoutUrl,
        freeSamples: 'true',
      }}
      action={CartForm.ACTIONS.LinesAdd}
      fetcherKey="cart-fetcher"
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <Button
            as="button"
            type="submit"
            className="w-full bg-comptoir-blue text-white py-2 px-4 block text-center"
          >
            {fetcher.state == 'idle' ? (
              <div className="flex justify-evenly">
                {i18nData.product_add_cart}
              </div>
            ) : (
              <div className="flex justify-center align-middle">
                <InlineSpinner />
              </div>
            )}
          </Button>
        </>
      )}
    </CartForm>
  );
};

export default ChooseSamples;
