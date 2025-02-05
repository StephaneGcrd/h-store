import {createCookie} from '@netlify/remix-runtime';

const oneSecond = 1;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;
const oneWeek = oneDay * 7;
const oneMonth = oneWeek * 4;
const oneYear = oneMonth * 12;

export const userPrefs = createCookie('user-prefs', {
  maxAge: oneYear,
});

export const userPrefsShort = createCookie('user-prefs', {
  maxAge: oneWeek,
});

export const pendingOrder = createCookie('pending-order', {
  maxAge: oneHour,
});

export const ABTestValue = createCookie('ab-test-value', {
  maxAge: oneMonth,
});

export const sponsoredCookie = createCookie('sponsored', {
  maxAge: oneWeek,
});
