import {StarLine} from '../reviews/StarLine';
import {useLoaderData, useRouteLoaderData} from '@remix-run/react';

const ProductRating = ({onClickScroll, fill}) => {
  const {clientReviews} = useLoaderData();
  const {i18nData} = useRouteLoaderData('root');

  const {total, average} = clientReviews.ratings;

  if (total == 0) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      <StarLine note={average} className={`w-3 h-3 ${fill}`} />
      <a
        className="text-xs ml-2 underline cursor-pointer"
        onClick={onClickScroll}
      >
        {total}{' '}
        {total > 1
          ? i18nData.reviews.review_product_plural
          : i18nData.reviews.review_product_singular}
      </a>
    </div>
  );
};

export default ProductRating;
