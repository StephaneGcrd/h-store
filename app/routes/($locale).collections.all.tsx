import {redirect, type LoaderFunctionArgs} from '@netlify/remix-runtime';

export async function loader({params}: LoaderFunctionArgs) {
  return redirect(params?.locale ? `${params.locale}/products` : '/products');
}
