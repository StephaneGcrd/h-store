export const PRODUCT_ITEM_FRAGMENT_DISCOVERY = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    tags
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    photo_card: metafield(namespace: "custom", key: "photo_card"){
      reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    photo_card_hover: metafield(namespace: "custom", key: "photo_card_hover"){
      reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    type: metafield(namespace: "custom", key: "product_type"){
      value
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    noteOne: metafield(namespace:"custom", key:"note_one"){
      key,
      value
    }
    noteTwo: metafield(namespace:"custom", key:"note_two"){
      key,
      value
    }
    noteThree: metafield(namespace:"custom", key:"note_three"){
      key,
      value
    }
    headNotes: metafield(namespace: "custom", key: "head_notes"){
      references(first:3){
        ... on MetafieldReferenceConnection{
          nodes{
            ... on Metaobject{
              id
              label: field(key:"label"){
                value
              }
            }
          }
        }
      }
    }
    heartNotes: metafield(namespace: "custom", key: "heart_notes"){
      references(first:3){
        ... on MetafieldReferenceConnection{
          nodes{
            ... on Metaobject{
              id
              label: field(key:"label"){
                value
              }
            }
          }
        }
      }
    }
    baseNotes: metafield(namespace: "custom", key: "base_notes"){
      references(first:3){
        ... on MetafieldReferenceConnection{
          nodes{
            ... on Metaobject{
              id
              label: field(key:"label"){
                value
              }
            }
          }
        }
      }
    }
    descriptionHtml
  }
` as const;

export const DISCOVERY_OFFER_QUERY = `#graphql
${PRODUCT_ITEM_FRAGMENT_DISCOVERY}
query getDiscoveryOfferProducts($country: CountryCode, $language: LanguageCode) 
  @inContext(country: $country, language: $language) {
  metaobject(handle: { handle: "prod", type: "discovery_offer_list" }) {
    id
    products: field(key: "products") {
      references(first: 50) {
				nodes{
          ... on Product{
          ...ProductItem
          }
        }
      }
    }
    variants: field(key: "variants"){
      references(first: 50) {
				nodes{
          ... on ProductVariant{
          id
          product{
                   ...ProductItem
          }
          }
        }
      }
    }
  }
}`;
