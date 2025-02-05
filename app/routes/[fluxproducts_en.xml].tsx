import type {LoaderArgs} from '@netlify/remix-runtime';

export async function loader({request, context: {storefront}}: LoaderArgs) {
  const {metaobject} = await storefront.query(SEA_PRODUCTS_QUERY, {
    variables: {
      country: 'GB',
      language: 'EN',
    },
  });

  const products =
    metaobject &&
    metaobject.products &&
    metaobject.products.references &&
    metaobject.products.references.edges;

  if (!products) {
    return '';
  }

  const xmlProducts = products.map((product) => {
    const node = product.node;
    const {
      id,
      product: shopify_product,
      price,
      barcode,
      image,
      title: variant_title,
    } = node;

    const {title, description, productType, handle, options, photo_100} =
      shopify_product;

    const image_url = image?.url;

    const url_end = `${handle}?${options && options[0].name}=${encodeURI(
      variant_title,
    )}`;

    if (
      !id ||
      !title ||
      !description ||
      !url_end ||
      !image_url ||
      !(price && price.amount) ||
      !productType ||
      !barcode
    ) {
      return ``;
    }

    return `
    <item>
  <g:id>${id}</g:id>
  <g:title>${title.replace(
    /&/g,
    '&amp;',
  )} - ${productType} - ${variant_title}</g:title>
  <g:description>${description.replace(/&/g, '&amp;')}</g:description>
  <g:link>https://www.comptoir-sud-pacifique.com/en-gb/products/${url_end}</g:link> <g:image_link>${image_url}</g:image_link> <g:condition>new</g:condition>
  <g:availability>in stock</g:availability>
  <g:price>${price?.amount} EUR</g:price>


  <g:gtin>${barcode}</g:gtin>
  <g:brand>Comptoir Sud Pacifique</g:brand>
  
  </item>
    `;
  });

  const xml_flux = `
  <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
  <title>Comptoir Sud Pacifique products</title>
  <link>https://comptoir-sud-pacifique.com</link>
  <description>This is a RSS 2.0 feed for Comptoir Sud Pacifique products, used on GMC</description>
  ${xmlProducts}
  </channel>
  </rss>
  `;

  return new Response(xml_flux, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60}`,
    },
  });
}

function xmlEncode(string: string) {
  return string.replace(/[&<>'"]/g, (char) => `&#${char.charCodeAt(0)};`);
}

const SEA_PRODUCTS_QUERY = `#graphql
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(id:"gid://shopify/Metaobject/58116899141") {
      id,
      products: field(key:"products"){
        key,
        references(first:200){
            ... on MetafieldReferenceConnection {
              edges{
                node{
                  ... on ProductVariant{
                    id
                    barcode,
                    image{
                      url
                    },
                    product{
                      title,
                      handle,
                      description,
                      productType,
                      options{
                        name
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
                      metafield(namespace:"custom",key:"product_type"){
                        value
                      }
                    }
                    title,
                    price{
                      amount
                    }
                    image{
                      url
                    }
                  }
                }
              }
            }
        }
      }
    }
  }
` as const;
