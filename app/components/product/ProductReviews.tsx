import {useLoaderData, useRouteLoaderData} from '@remix-run/react';

import {StarLine} from '../reviews/StarLine';

import ProductReview from '../reviews/ProductReview';

const ProductReviews = ({parentRef}) => {
  const {clientReviews} = useLoaderData();
  const {i18nData} = useRouteLoaderData('root');

  const {total, average} = clientReviews.ratings;

  if (total == 0) {
    return null;
  }

  return (
    <>
      <div
        ref={parentRef}
        className="w-full bg-slate-100 col-span-1 h-96 md:h-128 flex justify-center"
      >
        <div className="flex flex-col justify-center align-middle items-center">
          <div className="t1">{i18nData.reviews.title}</div>
          <div className="mb-4 px-8 text-center max-w-[600px]">
            {i18nData.reviews.description}
          </div>
          <div className="flex">
            <a href="https://www.societe-des-avis-garantis.fr/">
              <img
                src={
                  'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/avis_garantis.png?v=1717495266'
                }
                width={130}
              />
            </a>
          </div>
          <div className="text-center flex">
            <div>
              {average}/5 {i18nData.reviews.out_of} {total}{' '}
              {i18nData.reviews.review}
              <div className="flex justify-center">
                <StarLine note={average} className={'h-5 w-5'} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4 h-128 overflow-scroll bg-slate-100">
        {clientReviews.reviews.map((review, key) => (
          <ProductReview review={review} key={key} />
        ))}
      </div>
    </>
  );
};

export default ProductReviews;
