import {useRouteLoaderData} from '@remix-run/react';

const CardTagList = ({tags}) => {
  const {i18nData} = useRouteLoaderData('root');
  return (
    <>
      <div className="flex h-6">
        {tags.map((tag, key) => {
          return (
            <div
              key={key}
              className=" text-comptoir-blue border border-comptoir-blue px-2 pt-1 md:pt-0.5 text-xs md:text-sm ml-1 rounded-sm"
            >
              {i18nData.product_tags[tag.toLowerCase()]}
            </div>
          );
        })}
      </div>{' '}
    </>
  );
};

export default CardTagList;
