import {Collection} from '@shopify/hydrogen/storefront-api-types';
import CarouselProduct from '../carousel/CarouselProduct';
import CarouselVariant from '../carousel/CarouselVariant';

const CollectionHomepage = ({element}: {element: Collection}) => {
  return (
    <div className="recommended-products py-8">
      <h1 className="text-center t-banner  px-10 mt-4 mb-2 ">
        {element.collection_title}
      </h1>
      {/* <p className="px-4 text-center">{collection.description}</p> */}
      <div className="flex w-full justify-center pb-8">
        {/*         <div className="bg-black w-24 h-0.5"></div> */}
      </div>

      {element.product_list ? (
        <div className="">
          <CarouselProduct products={element.product_list.nodes} />
        </div>
      ) : (
        <div className="">
          <CarouselVariant
            variants={
              element.variant_list && element.variant_list.collection.nodes
            }
          />
        </div>
      )}
    </div>
  );
};

export default CollectionHomepage;
