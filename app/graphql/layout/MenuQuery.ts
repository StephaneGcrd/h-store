export const HEADER_MENU_QUERY = `#graphql
query getMenu($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
  headerMenu: metaobject(handle: { type: "menu", handle: "header_prod" }) {
    id
    menu: field(key: "elements") {
      key
      references(first: 20) {
        ...menuReferences
      }
    }
  },
  footerMenu: metaobject(handle: { type: "menu", handle: "footer_prod" }) { 
    id
    menu: field(key: "elements") {
      key
      references(first: 20) {
        ...menuReferences
      }
    }
    title: field(key:"title"){
      key,
      value
    }
  }
}

fragment menuReferences on MetafieldReferenceConnection {
  edges {
    node {
      ...menuNode
    }
  }
}

fragment subMenuReferences on MetafieldReferenceConnection {
  edges {
    node {
      ...subMenuNode
    }
  }
}

fragment subMenuNode on Metaobject {
  id
  label: field(key: "label") {
    value
  }
  links: field(key: "links") {
    references(first: 10) {
      edges {
        node {
          ... on Metaobject {
            id
            label: field(key: "label") {
              value
            }
            path: field(key: "path") {
              value
            }
          }
        }
      }
    }
  }
}

fragment menuNode on Metaobject {
  id
  label: field(key: "label") {
    value
  }
  path: field(key: "path") {
    value
  }
  submenu: field(key: "submenus") {
    key
    references(first: 20) {
      ...subMenuReferences
    }
  }
}
` as const;
