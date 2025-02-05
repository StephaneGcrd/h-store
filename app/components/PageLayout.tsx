import {type LayoutQuery} from 'storefrontapi.generated';

import {CountrySelector} from '~/components/CountrySelector';

import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';

import type {RootLoader} from '~/root';
import DesktopMenu from './header/DesktopMenu';
import {MetaMenu} from '../graphql/layout/MenuQuery';
import {Footer} from './footer/Footer';
import {useEffect} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
    metaMenu?: MetaMenu;
  };
};

export function PageLayout({children, layout}: LayoutProps) {
  const {publish} = useAnalytics();
  let listenerInitialized = false;

  const CreateCookieBotListener = () => {
    const initializeListener = () => {
      console.log('initListener');
      if (typeof window !== 'undefined' && window.CookieConsent) {
        window.CookieConsent = new Proxy(window.CookieConsent, {
          set: (obj, prop, value) => {
            if (prop == 'host') {
              const pushEvent = new CustomEvent('consentUpdate', {
                detail: obj && obj.consent,
              });
              window.dispatchEvent(pushEvent);
            }
            return Reflect.set(obj, prop, value);
          },
        });

        window.addEventListener('consentUpdate', (event) => {
          if (event.detail) {
            publish('custom_consent_update', {consent: event.detail});
          }
        });
      }
    };

    if (typeof window !== 'undefined' && !listenerInitialized) {
      listenerInitialized = true;
      if (window.CookieConsent) {
        initializeListener();
      } else {
        const intervalId = setInterval(() => {
          if (window.CookieConsent) {
            clearInterval(intervalId);
            initializeListener();
          }
        }, 100);
      }
    }

    return undefined;
  };

  useEffect(() => {
    CreateCookieBotListener();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen font-avenir">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <DesktopMenu />
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
