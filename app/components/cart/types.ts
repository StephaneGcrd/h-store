import {CartLine} from '@shopify/hydrogen/storefront-api-types';

// types.ts
export interface Cart {
  updatedAt: string;
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  buyerIdentity: CartBuyerIdentity;
  lines: CartLines;
  cost: CartCost;
  note: string;
  attributes: Array<any>;
  discountCodes: Array<any>;
}

export interface CartBuyerIdentity {
  countryCode: string;
  customer: null | any;
  email: null | any;
  phone: null | any;
}

export interface CartLines {
  edges: Array<CartLineEdge>;
}

export interface CartLineEdge {
  node: CartLine;
}

export interface CartLineNode {
  id: string;
  quantity: number;
  attributes: Array<any>;
  cost: CartLineCost;
  merchandise: CartMerchandise;
}

export interface CartLineCost {
  totalAmount: CartAmount;
  amountPerQuantity: CartAmount;
  compareAtAmountPerQuantity: null | any;
}

export interface CartAmount {
  amount: string;
  currencyCode: string;
}

export interface CartMerchandise {
  id: string;
  availableForSale: boolean;
  compareAtPrice: null | any;
  price: CartAmount;
  requiresShipping: boolean;
  title: string;
  image: CartImage;
  product: CartProduct;
  selectedOptions: Array<CartSelectedOption>;
}

interface CartImage {
  id: string;
  url: string;
  altText: null | any;
  width: number;
  height: number;
}

interface CartProduct {
  handle: string;
  title: string;
  id: string;
  vendor: string;
}

interface CartSelectedOption {
  name: string;
  value: string;
}

interface CartCost {
  subtotalAmount: CartAmount;
  totalAmount: CartAmount;
  totalDutyAmount: null | any;
  totalTaxAmount: null | any;
}
