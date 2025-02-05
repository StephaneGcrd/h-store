import {Await, useRouteLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from '@netlify/remix-runtime';
import {CartForm, type CartQueryDataReturn, Analytics} from '@shopify/hydrogen';

import {isLocalPath} from '~/lib/utils';
import {Cart} from '~/components/Cart';
import type {RootLoader} from '~/root';
import {PROMOTION_QUERY} from '~/graphql/promotions/PromotionQuery';
import type {Promotions, Promotion} from '~/types/Promotions';
import {Cart as CartType} from '@shopify/hydrogen/storefront-api-types';

async function processPromotions(cart, promotions: Promotions) {
  const awCart: CartType = await cart.get();

  const linesToAdd: Array<{
    merchandiseId: string;
    quantity: number;
    attributes: {key: string; value: string};
  }> = [];
  const linesToDelete: string[] = [];

  const checkGiftInCart = (promotionId: string, giftId: string) => {
    let lineId = null;

    const giftInCart = awCart?.lines?.edges.some((edge) => {
      if (
        edge.node.merchandise.id === giftId &&
        edge.node.attributes?.some(
          (attr) => attr.key === 'gift' && attr.value === promotionId,
        )
      ) {
        lineId = edge.node.id;
        return true;
      }
    });
    return {giftInCart, lineId};
  };

  const addOrRemoveGift = (
    conditionMet: boolean,
    giftInCart: boolean,
    promotion: Promotion,
    lineId: string | null,
  ) => {
    if (conditionMet && !giftInCart) {
      linesToAdd.push({
        merchandiseId: promotion.gift.value,
        quantity: 1,
        attributes: {key: 'gift', value: promotion.id},
      });
    }

    if (!conditionMet && giftInCart) {
      linesToDelete.push(lineId);
    }
  };

  for (const promotion of promotions.references.nodes) {
    if (promotion.active.value === 'true') {
      if (promotion.type.value === 'ITEM') {
        const itemInCart = awCart.lines.edges.some((edge) =>
          promotion.items_condition.references.edges.some(
            (promotionEdge) =>
              promotionEdge.node.id === edge.node.merchandise.id,
          ),
        );

        const {giftInCart, lineId} = checkGiftInCart(
          promotion.id,
          promotion.gift.value,
        );
        addOrRemoveGift(itemInCart, giftInCart, promotion, lineId);
      }

      if (promotion.type.value === 'MONEY') {
        const totalBeforeDiscount =
          awCart &&
          awCart.cost &&
          awCart.cost.subtotalAmount &&
          awCart.cost.subtotalAmount.amount &&
          parseFloat(awCart.cost.subtotalAmount.amount);

        const promotionMinValue =
          promotion.minimum_value &&
          promotion.minimum_value.value &&
          parseFloat(promotion.minimum_value.value);

        const cartMeetConditions = totalBeforeDiscount >= promotionMinValue;

        const {giftInCart, lineId} = checkGiftInCart(
          promotion.id,
          promotion.gift.value,
        );
        addOrRemoveGift(cartMeetConditions, giftInCart, promotion, lineId);
      }
    }
  }

  await cart.addLines(linesToAdd);
  return await cart.removeLines(linesToDelete);
}

async function processFreeSamples(cart) {
  const awCart: CartType = await cart.get();

  const linesToDelete: string[] = [];

  awCart.lines.edges.forEach(({node}) => {
    if (
      node.attributes?.some(
        (attr) => attr.key === 'FreeSamples' && attr.value === 'true',
      )
    ) {
      linesToDelete.push(node.id);
    }
  });

  if (linesToDelete.length == 0) {
    return null;
  }

  return await cart.removeLines(linesToDelete);
}

export async function action({request, context}: ActionFunctionArgs) {
  const {cart, storefront} = context;

  const {metaobject} = await storefront.query(PROMOTION_QUERY, {});
  const promotions: Promotions = metaobject.promotions;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  const {redirectTo} = inputs;

  const isGiftRemoved = inputs?.isGift;
  const isFreeSamples = inputs?.freeSamples;

  if (isFreeSamples) {
    await processFreeSamples(cart);
  }

  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  // Process promotions after cart action
  if (!isGiftRemoved) {
    result = await processPromotions(cart, promotions);
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  if (
    typeof redirectTo === 'string' &&
    (isLocalPath(redirectTo) ||
      redirectTo.startsWith('https://checkout.comptoir-sud-pacifique.com/') ||
      redirectTo.startsWith('https://0185a3.myshopify.com'))
  ) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors, userErrors} = result;

  return json(
    {
      cart: cartResult,
      userErrors,
      errors,
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart} = context;
  return json(await cart.get());
}

export default function CartRoute() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  // @todo: finish on a separate PR
  return (
    <>
      <div className="grid w-full gap-8 p-6 py-8 md:p-8 lg:p-12 justify-items-start">
        <Await resolve={rootData?.cart}>
          {(cart) => <Cart layout="page" cart={cart} />}
        </Await>
      </div>

      <Analytics.CartView />
    </>
  );
}
