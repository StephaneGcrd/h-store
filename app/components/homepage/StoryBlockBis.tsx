import React from 'react';
import PictureCarousel from '../PictureCarousel';
import {LocaleLink} from '../LocaleLink';
import {RightArrowIcon} from '~/icons';
import {useAnalytics} from '../analytics/AnalyticsContext';
import {useTranslation} from '~/hooks/useTranslation';
import {useRootLoaderData} from '~/root';
import {Image} from '@shopify/hydrogen';

const StoryBlockBis = () => {
  const {fireStoryBtnClick} = useAnalytics();

  const {translations, i18n} = useRootLoaderData();
  const {t} = useTranslation(translations, i18n);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-comptoir-bluedarker h-96 md:h-128 relative text-white">
        {/*         <Image
          src={
            'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/aqua_motu_2.jpg?v=1714477133'
          }
          className={`object-cover absolute h-full`}
          loading="eager"
        /> */}
        <div className="h-full w-full absolute z-20 flex justify-center items-center  ">
          <div className="text-center ">
            <div className="t-banner">{t('depan2.title')}</div>
            <div className="py-4 max-w-[500px] px-4">{t('depan2.text')}</div>
            <LocaleLink to={'/products/duo-10-ml'}>
              <button className="btn-image bg-transparent border-white ">
                {t('depan2.btn')}
              </button>
            </LocaleLink>
          </div>
        </div>
      </div>
      <div className="bg-comptoir-cream h-128 w-full relative">
        <Image
          src={
            'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/banniere_duo.jpg?v=1715954788'
          }
          className={`object-cover absolute h-full`}
          loading="eager"
        />
      </div>
    </div>
  );

  /*   return (
    <div className="px-4 center-item-inside my-16">
      <h1 className="t-banner text-center mb-2">{t('story_block.title')}</h1>
      <div className="max-w-[750px] text-center">
        {t('story_block.subtitle')}
      </div>
      <div className="my-8">
        <PictureCarousel
          urls={[
            'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/comptoir_1.webp?v=1706022556',
            'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/2.webp?v=1706022556',
            'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/3.webp?v=1706022556',
            'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/4.webp?v=1706022556',
            'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/5.webp?v=1706022627',
            'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/6.webp?v=1706022627',
          ]}
        />
      </div>
      <LocaleLink
        to="/pages/notre-histoire"
        className=" px-4 pr-2 py-2 mt-4 cursor-pointer hover:bg-slate-200 flex items-center"
        onClick={() => fireStoryBtnClick('story_see_more')}
      >
        {t('story_block.cta')}
        <RightArrowIcon />
      </LocaleLink>
    </div>
  ); */
};

export default StoryBlockBis;
