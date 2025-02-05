export const PRODUCT_ITEM_FRAGMENT = `#graphql
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
    hidden: metafield(namespace:"custom", key:"hidden"){
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
    variants(first: 5) {
      nodes {
        availableForSale
        compareAtPrice {
          amount
          currencyCode
        }
        price{
          amount
          currencyCode
        }
        title
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
export const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(id: $id) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
        }
      }
    }
  }
` as const;

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    quantityAvailable
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

export const PRODUCT_FRAGMENT = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  fragment Product on Product {
    id
    title
    vendor
    handle
    hidden: metafield(namespace: "custom", key: "hidden"){
      value
    }
    linked_products: metafield(namespace: "custom", key:"linked_products"){
      key
      value
      references(first:5){
          ... on MetafieldReferenceConnection{
            nodes{
              ... on Product {
                ...ProductItem
              }
            }
          }
      }
    }
    olfactive_families: metafield(namespace: "custom", key:"olfactive_families"){
      key
      value
      references(first:3){
          ... on MetafieldReferenceConnection{
            nodes{
              ...on Metaobject{
                id
                title: field(key:"name"){
                value
                }
                description: field(key:"description"){
                  value
                }
              }
            }
          }
      }
    }
    heading_description: metafield(namespace: "custom", key: "heading_description"){
      key
      value
    }
    photo_100: metafield(namespace: "custom", key: "photo_card"){
      reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    photo_100_box: metafield(namespace: "custom", key: "photo_card_hover"){
      reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    photo_30: metafield(namespace: "custom", key: "photo_30ml"){
      reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    photo_10: metafield(namespace: "custom", key: "photo_10ml"){
      reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    photo_10030: metafield(namespace: "custom", key: "photo_100ml30ml"){
      reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    photos_mood: metafield(namespace: "custom", key: "photos_mood"){
      id,
      value
      references(first:3){
          ... on MetafieldReferenceConnection{
            nodes{
              ... on MediaImage {
                image{
                  url
                }
              }
            }
          }
      }
    }
    photo_notes: metafield(namespace: "custom", key: "picture_mood"){
            reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    photoIllustrationProduit: metafield(namespace: "custom", key: "picture_mood"){
      reference{
                ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    productType: metafield(namespace:"custom", key:"product_type"){
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
    ingredients: metafield(namespace:"custom", key:"ingredients"){
      key,
      value
    }
    metafields(identifiers: [{key: "product_type",namespace: "custom"},
    {key: "note_one",namespace: "custom"},
    {key: "note_two",namespace: "custom"},
    {key: "note_three",namespace: "custom"},
    {key: "ingredients",namespace: "custom"},
    {key: "picture_mood",namespace: "custom"},
    {key: "isBundle",namespace: "custom"}
    ]){
      key,
      value,
      reference{
          ... on MediaImage {
            image {
              url
            }
          }
      }
    }
    images(first:3){
      nodes{
        id,
        width,
        height,
        url,
        altText
      }
    }
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 3) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
