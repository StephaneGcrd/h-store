import React from 'react';
import {CartForm, OptimisticInput} from '@shopify/hydrogen';
import {FetcherWithComponents, useRouteLoaderData} from '@remix-run/react';
import InlineSpinner from '../common/InlineSpinner';

const RemoveButton = ({lineId, isGift}: {lineId: string; isGift: boolean}) => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <CartForm
      route="/cart"
      inputs={{
        lineIds: [lineId],
        isGift,
      }}
      action={CartForm.ACTIONS.LinesRemove}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <button className={`mt-2 py-1 px-0 rounded text-black text-xs block`}>
            {fetcher.state == 'idle' ? (
              <>{i18nData.checkout_delete_item}</>
            ) : (
              <InlineSpinner />
            )}
          </button>
          <OptimisticInput id={lineId} data={{action: 'remove'}} />
        </>
      )}
    </CartForm>
  );
};

export default RemoveButton;
