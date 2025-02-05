import {useFetcher, useLocation, useRouteLoaderData} from '@remix-run/react';
import {useCallback, useEffect, useRef} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';
import type {CartBuyerIdentityInput} from '@shopify/hydrogen/storefront-api-types';
import {CartForm} from '@shopify/hydrogen';

import {Button} from '~/components/Button';
import {Heading} from '~/components/Text';
import {IconCheck} from '~/components/Icon';
import type {Localizations, Locale} from '~/lib/type';
import {DEFAULT_LOCALE} from '~/lib/utils';
import type {RootLoader} from '~/root';
import {GlobeIcon} from './icons';
import {countries} from '~/data/countries';

export function CountrySelector() {
  const fetcher = useFetcher();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const {pathname, search} = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    '',
  )}${search}`;

  const defaultLocale = countries?.['default'];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : '';

  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const observerRef = useRef(null);
  useEffect(() => {
    ref(observerRef.current);
  }, [ref, observerRef]);

  // Get available countries list when in view
  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === 'loading') return;
    fetcher.load('/api/countries');
  }, [inView, fetcher]);

  const handleChange = useCallback(
    (event) => {
      const selectedCountryPath = event.target.value;
      const countryLocale = countries[selectedCountryPath];
      const countryUrlPath = getCountryUrlPath({
        countryLocale,
        defaultLocalePrefix,
        pathWithoutLocale,
      }).split('?')[0]; // Trim the parameters after the ?

      window.location.href = countryUrlPath;
    },
    [countries, defaultLocalePrefix, pathWithoutLocale],
  );

  return (
    <div className="flex  w-full items-center">
      <GlobeIcon />
      <select
        className="w-full px-4 py-2 border rounded border-contrast/30 dark:border-white bg-contrast/30 text-[14px]"
        onChange={handleChange}
        value={Object.keys(countries).find(
          (countryPath) =>
            countries[countryPath].language === selectedLocale.language &&
            countries[countryPath].country === selectedLocale.country,
        )}
      >
        {countries &&
          Object.keys(countries).map((countryPath) => {
            const countryLocale = countries[countryPath];
            return (
              <option key={countryPath} value={countryPath}>
                {countryLocale.label}
              </option>
            );
          })}
      </select>
    </div>
  );
}

function Country({
  closeDropdown,
  countryLocale,
  countryUrlPath,
  isSelected,
}: {
  closeDropdown: () => void;
  countryLocale: Locale;
  countryUrlPath: string;
  isSelected: boolean;
}) {
  return (
    <ChangeLocaleForm
      key={countryLocale.country}
      redirectTo={countryUrlPath}
      buyerIdentity={{
        countryCode: countryLocale.country,
      }}
    >
      <Button
        className={clsx([
          'text-contrast dark:text-primary',
          'bg-primary dark:bg-contrast w-full p-2 transition rounded flex justify-start',
          'items-center text-left cursor-pointer py-2 px-4',
        ])}
        type="submit"
        variant="primary"
        onClick={closeDropdown}
      >
        {countryLocale.label}
        {isSelected ? (
          <span className="ml-2">
            <IconCheck />
          </span>
        ) : null}
      </Button>
    </ChangeLocaleForm>
  );
}

function ChangeLocaleForm({
  children,
  buyerIdentity,
  redirectTo,
}: {
  children: React.ReactNode;
  buyerIdentity: CartBuyerIdentityInput;
  redirectTo: string;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.BuyerIdentityUpdate}
      inputs={{
        buyerIdentity,
      }}
    >
      <>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {children}
      </>
    </CartForm>
  );
}

function getCountryUrlPath({
  countryLocale,
  defaultLocalePrefix,
  pathWithoutLocale,
}: {
  countryLocale: Locale;
  pathWithoutLocale: string;
  defaultLocalePrefix: string;
}) {
  let countryPrefixPath = '';
  const countryLocalePrefix = `${countryLocale.language}-${countryLocale.country}`;

  if (countryLocalePrefix !== defaultLocalePrefix) {
    countryPrefixPath = `/${countryLocalePrefix.toLowerCase()}`;
  }
  return `${countryPrefixPath}${pathWithoutLocale}`;
}
