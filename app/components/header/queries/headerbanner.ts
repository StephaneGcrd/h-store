export const HEADER_BANNER_QUERY = `#graphql
    query getMenu($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  metaobject(id: "gid://shopify/Metaobject/111343370568") {
    id
    text: field(key: "text") {
      key,
      value
    }
  }
}`;

export type HeaderBannerText = {
  id: string;
  text: {
    key: string;
    value: string;
  };
};
