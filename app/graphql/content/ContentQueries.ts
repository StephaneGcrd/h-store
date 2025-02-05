import {PRODUCT_ITEM_FRAGMENT} from '../product/ProductQueries';

export const HOMEPAGE_CONTENT_QUERY = `#graphql
    query HomepageContent(
        $country: CountryCode
        $language: LanguageCode
    ) @inContext(language: $language, country: $country){
    metaobject(
      handle:{type:"homepage_content",
        handle: "homepage-content-json"}){
      id,
      fields {
        value
      }
    }
  }
` as const;

export const GENERAL_FAQ_QUERY = `#graphql
    query HomepageContent(
        $country: CountryCode
        $language: LanguageCode
    ) @inContext(language: $language, country: $country){
    metaobject(
      handle:{type:"general_faq",
        handle: "general-faq-amabbhwv"}){
      id,
      fields {
        value
      }
    }
  }
` as const;

export const PERFUME_FAQ_QUERY = `#graphql
    query HomepageContent(
        $country: CountryCode
        $language: LanguageCode
    ) @inContext(language: $language, country: $country){
    metaobject(
      handle:{type:"general_faq",
        handle: "faq-perfumes"}){
      id,
      fields {
        value
      }
    }
  }
` as const;

export const FOOTER_CONTENT_QUERY = `#graphql
    query FooterContent(
        $country: CountryCode
        $language: LanguageCode
    ) @inContext(language: $language, country: $country){
    metaobject(
      handle:{type:"homepage_content",
        handle: "footer-content"}){
      id,
      fields {
        value
      }
    }
  }
` as const;

export const MIX_AND_MATCH_QUERY = `#graphql
    ${PRODUCT_ITEM_FRAGMENT}
    query mixAndMatch(
      $country: CountryCode
      $language: LanguageCode
    ) @inContext(language: $language, country: $country){
     metaobject(handle: { type: "mix_and_match_list", handle: "prod" }) {
    id
    title: field(key: "titre_page") {
      value
    },
    subheader: field(key: "subheader_page") {
      value
    },
    explanation: field(key: "explanation") {
      value
    },
    elements: field(key: "list") {
      references(first: 10) {
        ... on MetafieldReferenceConnection {
          nodes {
            ... on Metaobject {
              title: field(key: "title") {
                value
              }
              fragrance_one: field(key: "fragrance_one") {
                reference {
                  ... on Product {
                    ...ProductItem
                  }
                }
              }
              fragrance_two: field(key: "fragrance_two") {
                reference {
                  ... on Product {
                                       ...ProductItem
                  }
                }
              }
              description: field(key: "description") {
                value
              }
              orientation: field(key:"orientation"){
                value
              }
            }
          }
        }
      }
    }
  }
  }`;

export const HOMEPAGE_ELEMENTS_QUERY = `#graphql
${PRODUCT_ITEM_FRAGMENT}
query homepageElements(
  $country: CountryCode
  $language: LanguageCode
) @inContext(language: $language, country: $country){
  metaobject(
    handle: {type: "homepage_elements", handle: "homepage-elements-prod"}
  ) {
    id
    elements: field(key: "elements") {
      references(first: 10) {
        ... on MetafieldReferenceConnection {
          ...metafieldNode
        }
      }
    }
  }
}

fragment metafieldNode on MetafieldReferenceConnection{
  nodes {
    ... on Metaobject{
      id
      type
      fields{
        ...homepageSectionField
      }
    }
  }
}

fragment homepageSectionField on MetaobjectField {
  key
  type
  value
  ...mediaImageField
  ...collectionSectionFields
}

fragment mediaImageField on MetaobjectField {
  media_image: reference {
    ... on MediaImage {
      ...imageFields
    }
  }
}


fragment collectionSectionFields on MetaobjectField {
  collection: references(first: 20) {
    ... on MetafieldReferenceConnection {
      nodes {
        ... on Product {
          ...ProductItem
        }
      }
    }
    ... on MetafieldReferenceConnection {
      nodes {
        ... on ProductVariant {
          id
        	title
          image{
            url
          }
          price{
            amount
          }
          product{
            ...ProductItem
          }
        }
      }
    }
  }
}

fragment imageFields on MediaImage {
  image {
    url
  }
}
` as const;
