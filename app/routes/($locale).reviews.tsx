import {useLoaderData, useRouteLoaderData} from '@remix-run/react';

import {json} from '@netlify/remix-runtime';

import {StarLine} from '~/components/reviews/StarLine';
import Review from '~/components/reviews/Review';

export async function loader() {
  const public_key = 'bc8192fda71c1ea1e735ffd5bd5f6197';
  const scope = 'site'; // or Product ID (string or integer)

  const url = `https://api.guaranteed-reviews.com/public/v3/reviews/${public_key}/${scope}`;

  const url_product = 'https://csp-server.vercel.app/reviews/getproductreviews';
  const reviews_query = await fetch(url);
  const reviews_product = await fetch(url_product);
  const reviewsAndRatings = await reviews_query.json();
  const reviewsProduct = await reviews_product.json();

  const reviewRows = reviewsProduct?.result?.rows;
  let averageSum = 0;
  let averageTotal = 0;
  reviewRows.forEach((row) => {
    averageSum += parseFloat(row.r);
    averageTotal += 1;
  });

  const totalAverage = averageSum / averageTotal;

  const newAverage = () => {
    const oldWAverage =
      parseFloat(reviewsAndRatings.ratings.average) *
      reviewsAndRatings.ratings.total;
    const newWAverage = averageSum;

    const wAverage =
      (oldWAverage + newWAverage) /
      (averageTotal + reviewsAndRatings.ratings.total);
    return wAverage;
  };

  const newRatings = {
    total: averageTotal + reviewsAndRatings.ratings.total,
    average: newAverage().toFixed(2),
  };

  const newReviews = [
    ...reviewsAndRatings.reviews,
    ...reviewsProduct.result.rows,
  ];

  function compare(a, b) {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    return 0;
  }

  newReviews.sort(compare);

  return json({reviewsAndRatings: {ratings: newRatings, reviews: newReviews}});
}

export default function SampleSelection() {
  const {reviewsAndRatings, productReviews} = useLoaderData();

  const {i18nData} = useRouteLoaderData('root');

  const {reviews, ratings} = reviewsAndRatings;

  const {total, average} = ratings;

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="t1 text-center mt-16">{i18nData.reviews.title}</div>
      <div className="mb-4 max-w-[500px] text-center">
        {i18nData.reviews.description}
      </div>
      <div className="w-full flex justify-center">
        <a href="https://www.societe-des-avis-garantis.fr/">
          <img
            src={
              'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/avis_garantis.png?v=1717495266'
            }
            width={130}
          />
        </a>
      </div>
      <div className="text-center mb-16 flex justify-center items-center">
        <div>
          {average}/5 {i18nData.reviews.out_of} {total}{' '}
          {i18nData.reviews.review}
          <div className="flex justify-center">
            <StarLine note={average} className={'h-5 w-5'} />
          </div>
        </div>
      </div>

      <div className="max-w-[650px] mb-16 h-128 overflow-scroll">
        {reviews.map((review, key) => (
          <Review review={review} key={key} />
        ))}
      </div>
    </div>
  );
}

/* export default function ThisIsGift({
  metafield,
}: {
  metafield: Cart['metafield'];
}) {
  const fetcher = useFetcher();

  return (
    <div>
      <button
        onClickCapture={(event) => {
          fetcher.submit(
            {
              [CartForm.INPUT_NAME]: JSON.stringify({
                action: CartForm.ACTIONS.MetafieldsSet,
                inputs: {
                  metafields: [
                    {
                      key: 'custom.gift',
                      type: 'boolean',
                      value: 'true',
                    },
                  ],
                },
              }),
            },
            {method: 'POST', action: '/cart'},
          );
        }}
      >
        click gift{' '}
      </button>
    </div>
  );
} */
