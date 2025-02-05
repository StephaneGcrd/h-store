import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm, useAnalytics} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';

import {Button} from '~/components/Button';
import InlineSpinner from './common/InlineSpinner';

export function AddToCartButton({
  children,
  lines,
  className = '',
  variant = 'primary',
  width = 'full',
  disabled,
  ...props
}: {
  children: React.ReactNode;
  lines: CartLineInput[];
  className?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  width?: 'auto' | 'full';
  disabled?: boolean;
  [key: string]: any;
}) {
  const {publish} = useAnalytics();

  const handleClick = () => {
    publish('custom_add_to_cart', {});
  };

  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
      fetcherKey="cart-fetcher"
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <Button
          as="button"
          type="submit"
          width={width}
          variant={variant}
          className={className}
          disabled={disabled ?? fetcher.state !== 'idle'}
          onClick={handleClick}
          {...props}
        >
          {fetcher.state == 'idle' ? (
            children
          ) : (
            <div className="flex justify-center align-middle">
              <InlineSpinner />
            </div>
          )}
        </Button>
      )}
    </CartForm>
  );
}
