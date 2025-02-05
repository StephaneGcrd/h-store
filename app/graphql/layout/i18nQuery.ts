export const I18N_CONTENT_QUERY = `#graphql
query getMenu($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  metaobject(handle:{handle:"prod", type:"i_18_n"}) {
    id
    content: field(key: "content") {
      key,
     	value
    }
  }
} 
`;
