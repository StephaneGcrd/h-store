import {useLocation} from '@remix-run/react';
import React, {useEffect, useState} from 'react';
import {ProductVariantFragmentFragment} from 'storefrontapi.generated';
import {Link} from '~/components/Link';

const createVariantUriQuery = (variantTitle: string) => {
  return encodeURIComponent(variantTitle);
};

const VariantList = ({
  productHandle,
  variants,
}: {
  productHandle: string;
  variants: Array<ProductVariantFragmentFragment>;
}) => {
  const location = useLocation();
  const [currentVariant, setCurrentVariant] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const variantParam = params.get(variants[0].selectedOptions[0].name);
    setCurrentVariant(variantParam);
  }, [location.search, variants]);

  return (
    <div className="flex gap-4 w-full items-center justify-center">
      {variants
        .filter((variant) =>
          [
            '10 ml',
            '30 ml',
            '100 ml',
            'Coffret Parfum',
            'Perfume Set',
          ].includes(variant.title),
        )
        .map((variant) => (
          <Link
            key={variant.id}
            to={`/products/${productHandle}?${
              variant.selectedOptions[0].name
            }=${createVariantUriQuery(variant.selectedOptions[0].value)}`}
            preventScrollReset
            className={`border flex-grow h-16 flex justify-center items-center ${
              currentVariant === variant.selectedOptions[0].value
                ? ' border-black'
                : 'border-transparent '
            }`}
          >
            {variant.title}
          </Link>
        ))}
    </div>
  );
};

export default VariantList;
