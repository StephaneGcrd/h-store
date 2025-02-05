import {useRouteLoaderData} from '@remix-run/react';
import {CheckBoxFilledIcon} from '../icons';
import {StarLine} from './StarLine';

export function formatDate(dateString) {
  // Séparer la date et l'heure
  let [datePart, _] = dateString.split(' ');

  // Séparer l'année, le mois et le jour
  let [year, month, day] = datePart.split('-');

  // Construire la nouvelle date formatée
  let formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}

const ProductReview = ({review}) => {
  const {
    id,
    r: rating,
    txt,
    date,
    o,
    odate,
    reply,
    rdate,
    c: name,
    object_title,
  } = review;

  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="w-full mb-4 border-b border-slate-400">
      <div className="flex justify-between w-full">
        <div className="font-bold flex items-center">
          {name}
          <CheckBoxFilledIcon className="w-4 h-4 fill-comptoir-blue ml-1" />
        </div>
        <div className="text-xs">{formatDate(date)}</div>
      </div>

      <div className="flex items-center align-middle mb-2">
        <div className="text-xs">{rating}/5</div>
        <StarLine note={rating} className="w-3 h-3" />
      </div>
      <div className="mb-2">{txt}</div>
      {reply && (
        <>
          {' '}
          <div className="text-sm font-bold">
            {i18nData.reviews.reply_header}
          </div>
          <div className="mb-2 text-sm">{reply}</div>
        </>
      )}

      {object_title ? (
        <div className="text-xs">
          {i18nData.reviews.product_reviewed}:{' '}
          <span className="font-bold font-garamond">{object_title}</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default ProductReview;
