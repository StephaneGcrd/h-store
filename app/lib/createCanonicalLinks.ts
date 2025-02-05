export const linksToDefine = (request, params) => {
  let currentUrl = '';
  const {locale} = params;
  const locales = ['fr-fr', 'en-gb', 'it-fr', 'x-default'];
  let links = [];

  const strippedUrl = request.url.split('?')[0] + '/';

  const strippedUrlSecond = strippedUrl.split('//')[1];
  const strippedUrlThird = strippedUrlSecond.split('/');

  const urlAfterLocale = strippedUrlThird.slice(2, -1);

  const buildUrlWithLocale = (locale) => {
    if (locale == 'x-default') {
      return (
        strippedUrl.split('//')[0] +
        '//' +
        strippedUrlThird[0] +
        '/' +
        urlAfterLocale.join('/')
      );
    }

    return (
      strippedUrl.split('//')[0] +
      '//' +
      strippedUrlThird[0] +
      '/' +
      locale +
      '/' +
      urlAfterLocale.join('/')
    );
  };

  locales.forEach((loc) => {
    if (loc == locale) {
      //currentLocale
      links.push({rel: 'canonical', href: buildUrlWithLocale(loc)});
      links.push({
        rel: 'relative',
        hreflang: loc == 'en-gb' ? 'en' : loc,
        href: buildUrlWithLocale(loc),
      });
      currentUrl = buildUrlWithLocale(loc);
    } else {
      links.push({
        rel: 'relative',
        hreflang: loc == 'en-gb' ? 'en' : loc,
        href: buildUrlWithLocale(loc),
      });
    }
  });

  return links;
};
