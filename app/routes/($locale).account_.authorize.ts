import type {LoaderFunctionArgs} from '@netlify/remix-runtime';

export async function loader({context, params}: LoaderFunctionArgs) {
  return context.customerAccount.authorize();
}
