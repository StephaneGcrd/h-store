export const PROMOTION_QUERY = `#graphql
query getVariantList($country: CountryCode, $language: LanguageCode) 
  @inContext(country: $country, language: $language) {
  metaobject(handle: { handle: "prod", type: "cart_promotions" }) {
    id
    promotions: field(key: "promotions") {
      references(first: 3) {
        ...MetafieldReferenceConnectionFragment
      }
    }
  }
}

# Fragments for cleaner structure and reusability

fragment MetafieldReferenceConnectionFragment on MetafieldReferenceConnection {
  nodes {
    ...MetaobjectFieldsFragment
  }
}

fragment MetaobjectFieldsFragment on Metaobject {
  id
  gift: field(key: "gift") {
    key
    value
  }
  active: field(key: "active") {
    key
    value
  }
  type: field(key: "type") {
    key
    value
  }
  minimum_value: field(key: "minimum_value") {
    key
    value
  }
  items_condition: field(key: "items_condition") {
    key
    value
    references(first: 100) {
      ...ProductVariantReferencesFragment
    }
  }
}

fragment ProductVariantReferencesFragment on MetafieldReferenceConnection {
  edges {
    node {
      ... on ProductVariant {
        id
      }
    }
  }
}` as const;
