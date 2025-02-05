import {useLoaderData} from '@remix-run/react';
import {json, redirect} from '@netlify/remix-runtime';
import FrequentQuestions from '~/components/product/FrequentQuestions';
import {
  GENERAL_FAQ_QUERY,
  PERFUME_FAQ_QUERY,
} from '~/graphql/content/ContentQueries';
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

  const {metaobject} = await storefront.query(I18N_CONTENT_QUERY, {
    variables: {
      language: storefront.i18n.language,
    },
  });

  const i18nData = JSON.parse(metaobject?.content?.value);

  const homepageContentRes = await storefront.query(GENERAL_FAQ_QUERY, {
    cache: storefront.CacheLong(),
  });

  const homepageContent = JSON.parse(
    homepageContentRes.metaobject.fields[0].value,
  );

  const perfumeFaqRes = await storefront.query(PERFUME_FAQ_QUERY, {
    cache: storefront.CacheLong(),
  });

  const perfumeFaq = JSON.parse(perfumeFaqRes.metaobject.fields[0].value);

  return json({
    homepageContent,
    perfumeFaq,
    dynamicLinks: linksToDefine(request, params),
    title: i18nData.faq.seo.title,
    description: i18nData.faq.seo.description,
  });
}

export default function Page() {
  const {homepageContent, perfumeFaq} = useLoaderData();

  return (
    <div className="page">
      <header>
        {/*         <h1 className="title-page">{page.title}</h1> */}
      </header>
      <FrequentQuestions
        productPage={false}
        questions={[...perfumeFaq, ...homepageContent]}
      />
    </div>
  );
}
