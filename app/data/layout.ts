import {AppLoadContext} from '@netlify/remix-runtime';
import invariant from 'tiny-invariant';
import {HEADER_MENU_QUERY} from '~/graphql/layout/MenuQuery';
import {LAYOUT_QUERY} from '~/graphql/layout/LayoutQuery';
import {parseMenu} from '~/lib/utils';

export async function getLayoutData({storefront, env}: AppLoadContext) {
  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu',
      footerMenuHandle: 'footer',
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  /*
      Modify specific links/routes (optional)
      @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
      e.g here we map:
        - /blogs/news -> /news
        - /blog/news/blog-post -> /news/blog-post
        - /collections/all -> /products
    */
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(
        data.headerMenu,
        data.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(
        data.footerMenu,
        data.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  const metaMenu = await storefront.query(HEADER_MENU_QUERY, {
    cache: storefront.CacheLong(),
  });

  return {
    shop: data.shop,
    footerMenu: metaMenu.footerMenu,
    headerMenu: metaMenu.headerMenu,
    headerBanner: data.headerBanner,
  };
}
