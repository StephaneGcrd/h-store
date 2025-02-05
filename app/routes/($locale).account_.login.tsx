import type {LoaderFunctionArgs} from '@netlify/remix-runtime';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  return context.customerAccount.login();
}
