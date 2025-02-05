import {useLoaderData, useRouteLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {json, redirect} from '@netlify/remix-runtime';

import {BottomPointingIcon} from '~/components/icons';
import {ProductItem} from '~/components/PerfumeCard/PerfumeCard';
import {MIX_AND_MATCH_QUERY} from '~/graphql/content/ContentQueries';
import {I18N_CONTENT_QUERY} from '~/graphql/layout/i18nQuery';
import {linksToDefine} from '~/lib/createCanonicalLinks';

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

  const mixAndMatch_one = await storefront.query(MIX_AND_MATCH_QUERY, {
    cache: storefront.CacheLong(),
  });

  const {metaobject} = await storefront.query(I18N_CONTENT_QUERY, {
    variables: {
      language: storefront.i18n.language,
    },
  });

  const i18nData = JSON.parse(metaobject?.content?.value);

  return json({
    mixAndMatch_one,
    dynamicLinks: linksToDefine(request, params),
    title: i18nData.mixandmatch.seo.title,
    description: i18nData.mixandmatch.seo.description,
  });
}

export const ComboComponent = ({mixAndMatchElement}: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div
        className={`w-full h-full flex justify-center p-8 md:px-16 max-w-[600px] ${
          mixAndMatchElement &&
          mixAndMatchElement.orientation &&
          mixAndMatchElement.orientation.value == 'left'
            ? 'md:order-1'
            : 'md:order-2'
        }`}
      >
        <div>
          <h1 className="t1 mb-2">
            {mixAndMatchElement &&
              mixAndMatchElement.title &&
              mixAndMatchElement.title.value}
          </h1>
          <p>
            {mixAndMatchElement &&
              mixAndMatchElement.description &&
              mixAndMatchElement.description.value}
          </p>
        </div>
      </div>
      <div
        className={`w-full h-full p-8 flex justify-center align-middle gap-2 ${
          mixAndMatchElement &&
          mixAndMatchElement.orientation &&
          mixAndMatchElement.orientation.value == 'left'
            ? 'md:order-2'
            : 'md:order-1'
        }`}
      >
        <ProductItem
          product={
            mixAndMatchElement &&
            mixAndMatchElement.fragrance_one &&
            mixAndMatchElement.fragrance_one.reference
          }
        />
        <ProductItem
          product={
            mixAndMatchElement &&
            mixAndMatchElement.fragrance_two &&
            mixAndMatchElement.fragrance_two.reference
          }
        />
      </div>
    </div>
  );
};

export default function Page() {
  const {mixAndMatch_one} = useLoaderData();

  return (
    <div className="page">
      <header>
        {/*         <h1 className="title-page">{page.title}</h1> */}
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="w-full order-2 md:order-1 h-96 md:h-128  flex justify-center align-middle items-center">
          <div className="h-96 w-96 md:h-128 md:w-128 p-8">
            <Image
              src={
                'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/Dream_1.gif?v=1730634613'
              }
              className="object-contain"
              aspectRatio="1/1"
              crop="center"
              loading="eager"
            />
          </div>
        </div>
        <div className="w-full flex  p-8 md:px-0 md:justify-center md:items-center order-2 h-32 md:h-128">
          <div>
            <h1 className="t1 mb-0 text-5xl">
              {mixAndMatch_one &&
                mixAndMatch_one.metaobject &&
                mixAndMatch_one.metaobject.title &&
                mixAndMatch_one.metaobject.title.value}
            </h1>
            <p>
              {mixAndMatch_one &&
                mixAndMatch_one.metaobject &&
                mixAndMatch_one.metaobject.subheader &&
                mixAndMatch_one.metaobject.subheader.value}
            </p>
            <div className="hidden md:flex justify-center align-middle mt-4">
              <BottomPointingIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center order-3 h-fit md:h-96 px-8">
          <div className="max-w-[600px] py-4 md:py-16">
            {JSON.parse(
              mixAndMatch_one &&
                mixAndMatch_one.metaobject &&
                mixAndMatch_one.metaobject.explanation &&
                mixAndMatch_one.metaobject.explanation.value,
            ).map((text, key) => (
              <p key={key} className="mb-4">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
      {mixAndMatch_one &&
        mixAndMatch_one.metaobject &&
        mixAndMatch_one.metaobject.elements &&
        mixAndMatch_one.metaobject.elements.references.nodes.map((node) => {
          return <ComboComponent mixAndMatchElement={node} />;
        })}
    </div>
  );
}
