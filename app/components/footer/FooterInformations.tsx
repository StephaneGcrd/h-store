import {useRouteLoaderData} from '@remix-run/react';
import {FacebookIcon, InstagramIcon, TikTokIcon} from '../icons';

export const FooterInformations = () => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="text-black p-4 md:py-0">
      <div className="t2 py-2  text-md">{i18nData.footer.shops_info.title}</div>
      <p className="text-sm">{i18nData.footer.shops_info.shop_1}</p>
      <p className="text-sm">{i18nData.footer.shops_info.shop_2}</p>

      <div className="t2 py-2  text-md">
        {i18nData.footer.company_info.title}
      </div>

      <p className="text-sm">{i18nData.footer.company_info.address}</p>

      <div className="t2 py-2  text-md">
        {i18nData.footer.contact_info.title}
      </div>

      <p className="text-sm">{i18nData.footer.contact_info.phone}</p>
      <p className="text-sm">{i18nData.footer.contact_info.email}</p>
      <div className="hidden md:block lg:hidden">
        <div className="text-bold py-2  text-md">
          {i18nData.footer.locale_title}
        </div>
        LocalePicker
      </div>
      <div className="w-full flex justify-center align-middle mt-4">
        <div className="flex gap-4 my-4">
          <a href="https://www.tiktok.com/@comptoirsudpacifique">
            <TikTokIcon className="w-8 h-8 fill-black" />
          </a>
          <a href="https://www.instagram.com/comptoir_sud_pacifique/">
            <InstagramIcon className="w-8 h-8 fill-black" />
          </a>
          <a href="https://www.facebook.com/comptoirsudpacifique">
            <FacebookIcon className="w-8 h-8 fill-black" />
          </a>
        </div>
      </div>
    </div>
  );
};
