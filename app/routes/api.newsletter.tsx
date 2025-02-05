import {ActionArgs, json} from '@netlify/remix-runtime';
import {userPrefs} from '~/cookies.server';

const API_DOMAIN = 'https://csp-session-server.vercel.app';

export async function action({request, context}: ActionArgs) {
  const {env} = context;

  const body = await request.formData();
  const {storefront, translations} = context;
  const {i18n} = storefront;

  const {language, country} = i18n;
  const locale = `${language}-${country}`.toLowerCase();

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  const email = body.get('email');

  if (!email) {
    throw Error('ERROR_NO_EMAIL');
  }

  const response = await fetch(`${API_DOMAIN}/customer/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${btoa(env.PRIVATE_STOREFRONT_API_TOKEN)}`,
    },
    body: JSON.stringify({
      locale,
      email,
    }),
  });
  cookie.hideBanner = true;

  if (response.ok) {
    return json(response, {
      headers: {'Set-Cookie': await userPrefs.serialize(cookie)},
    });
  }
  /*   const res = await response.json(); */
  /*   console.log(res); */

  throw Error('ERROR_NEWSLETTER_USER');
}

/* export async function action({request, context}: ActionArgs) {
  const {env, storefront} = context;

  const body = await request.formData();

  const firstName = body.get('name');
  const email = body.get('email');

  const customer = {
    firstName,
    email,
    password: Math.random().toString(36) + Math.random().toString(20),
    acceptsMarketing: true,
  };

  console.log(customer);

  if (email) {
    console.log(env.KLAVIYO_API_KEY);
    const res = await KlaviyoSub(email, env.KLAVIYO_API_KEY);
    /* 
    const res = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: customer,
      },
    }); */

/* 

 */
/*     return json(
      {...res},
      {headers: {'Set-Cookie': await userPrefs.serialize(cookie)}},
    );
  }

  return json({ok: false, message: 'ERROR_NO_EMAIL'}, 500); */

/*   const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const test = await delay(1000);

  return json({ok: false, message: 'erreur'}, 500);

  return json({ok: true}); */

/*   const res = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
    variables: {
      input: customer,
    },
  });

  return json(res); 
}*/
const CUSTOMER_CREATE_MUTATION = `#graphql
mutation customerCreate($input: CustomerCreateInput!){
    customerCreate(input: $input) {
    customer  {
      id
    }
    customerUserErrors {
        code,
        field,
        message
    }
  }
}
` as const;
/* 
const KlaviyoSub = (email: string, token) => {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      revision: '2023-12-15',
      'content-type': 'application/json',
      Authorization: 'Klaviyo-API-Key ' + token,
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          custom_source: 'Marketing Event',
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email,
                  subscriptions: {
                    email: {marketing: {consent: 'SUBSCRIBED'}},
                    sms: {marketing: {consent: 'SUBSCRIBED'}},
                  },
                },
              },
            ],
          },
        },
      },
    }),
  };

  return fetch(
    'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
    options,
  );
};
 */
