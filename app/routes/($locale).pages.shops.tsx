import {useLoaderData, useRouteLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {json, redirect} from '@netlify/remix-runtime';
import {useEffect, useState} from 'react';
import FrequentQuestions from '~/components/product/FrequentQuestions';

import {BottomPointingIcon} from '~/components/icons';
import {linksToDefine} from '~/lib/createCanonicalLinks';
import {I18N_CONTENT_QUERY} from '~/graphql/layout/i18nQuery';

export const meta: V2_MetaFunction = ({data}) => {
  return [
    {title: data.title},
    {
      name: 'description',
      content: data.description,
    },
    data.dynamicLinks.map((link) => {
      let newLink = {};

      if (link.hreflang) {
        newLink['hrefLang'] = link.hreflang;
      }

      return {
        tagName: 'link',
        rel: link.rel,
        href: link.href,
        ...newLink,
      };
    }),
  ];
};

export async function loader({request, params, context}: LoaderArgs) {
  const {locale} = params;
  const {storefront} = context;
  const {i18n} = storefront;

  const {metaobject} = await storefront.query(I18N_CONTENT_QUERY, {
    variables: {
      language: storefront.i18n.language,
    },
  });

  const i18nData = JSON.parse(metaobject?.content?.value);

  return json({
    dynamicLinks: linksToDefine(request, params),
    title: i18nData.shops.seo.title,
    description: i18nData.shops.seo.description,
  });
}

export const AnimatedPics = () => {
  const [cursor, setCursor] = useState(0);

  const urls = [
    'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/b2.jpg?v=1718201401',
    'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/b1.jpg?v=1718201268',
    'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/4_08293f3b-2595-4fcb-b669-cac49a2150d7.webp?v=1718200592',
    'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/1.webp?v=1718200592',
    'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/5_ed92f587-85c7-48d9-9350-b753d2c22cbe.webp?v=1718200591',
  ];

  useEffect(() => {
    let intervalId;
    if (cursor < urls.length - 1) {
      intervalId = setInterval(() => {
        setCursor(cursor + 1);
      }, 2000);
    } else {
      intervalId = setInterval(() => {
        setCursor(0);
      }, 2000);
    }

    return () => clearInterval(intervalId);
  }, [cursor]);

  return (
    <>
      <div className="bg-slate-400 w-full h-full  absolute overflow-hidden">
        <Image
          className={`${
            cursor == 0 ? 'block' : 'hidden'
          } object-cover w-full h-full`}
          crop="center"
          aspectRatio="5/4"
          src={urls[0]}
        />
        <Image
          className={`${
            cursor == 1 ? 'block' : 'hidden'
          } object-cover w-full h-full`}
          crop="center"
          src={urls[1]}
        />
        <Image
          className={`${
            cursor == 2 ? 'block' : 'hidden'
          } object-cover w-full h-full`}
          crop="center"
          src={urls[2]}
        />
        <Image
          className={`${
            cursor == 3 ? 'block' : 'hidden'
          } object-cover w-full h-full`}
          crop="center"
          src={urls[3]}
        />
        <Image
          className={`${
            cursor == 4 ? 'block' : 'hidden'
          } object-cover w-full h-full`}
          crop="center"
          src={urls[4]}
        />
      </div>
    </>
  );
};

export default function Page() {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="page">
      <header>
        {/*         <h1 className="title-page">{page.title}</h1> */}
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="w-full h-96 lg:h-128 text-white relative">
          <AnimatedPics />
          <div className="absolute w-full h-full flex justify-center items-center align-middle">
            <div className="t2 md:t1">{i18nData.shops.title}</div>
            {/*             <BottomPointingIcon className="h-8 w-8 animate-bounce" /> */}
          </div>
        </div>
        <div className="p-4">
          <div className="p-8">
            {i18nData.shops.paragraph_1}
            <br />
            <br />
            {i18nData.shops.paragraph_2}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 text-center w-full mt-12">
            <div className="flex  flex-col h-full w-full justify-center">
              <div className="t2">{i18nData.shops.shop_1.title}</div>
              <div className="text-sm">{i18nData.shops.shop_1.address}</div>
              <div className="text-sm">{i18nData.shops.shop_1.telephone}</div>
              <div className="text-sm">{i18nData.shops.shop_1.timeslot_1}</div>
              <div className="text-sm">{i18nData.shops.shop_1.timeslot_2}</div>
            </div>

            <div className="flex flex-col h-full w-full justify-center mt-12 mb-24 md:mt-0 md:mb-0">
              <div className="t2">{i18nData.shops.shop_2.title}</div>
              <div className="text-sm">{i18nData.shops.shop_2.address}</div>
              <div className="text-sm">{i18nData.shops.shop_2.telephone}</div>
              <div className="text-sm">{i18nData.shops.shop_2.timeslot_1}</div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
