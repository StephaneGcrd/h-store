import type {Localizations} from '~/lib/type';

export const countries: Localizations = {
  default: {
    label: 'English (EUR €)',
    language: 'EN',
    country: 'FR',
    currency: 'EUR',
  },
  '/fr-fr': {
    label: 'France (EUR €)',
    language: 'FR',
    country: 'FR',
    currency: 'EUR',
  },
  /*   '/it-it': {
    label: 'Italy (EUR €)',
    language: 'IT',
    country: 'IT',
    currency: 'EUR',
  },
  '/de-de': {
    label: 'Germany (EUR €)',
    language: 'DE',
    country: 'DE',
    currency: 'EUR',
  }, */
};
