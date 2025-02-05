import {useRouteLoaderData} from '@remix-run/react';

import {ClosedMailIcon, GiftIcon, PhoneIcon, TruckIcon} from '../icons';
import IconInfosCarousel from './IconInfosCarousel';
import IconInfo from './IconInfo';

export const IconInfos = () => {
  const {i18nData} = useRouteLoaderData('root');

  const iconItems = [
    {
      icon: <GiftIcon fill="#475769" />,
      title: i18nData.footer.icon_text.item_1.title,
      content: i18nData.footer.icon_text.item_1.content,
    },
    {
      icon: <TruckIcon fill="#475769" />,
      title: i18nData.footer.icon_text.item_2.title,
      content: i18nData.footer.icon_text.item_2.content,
    },
    {
      icon: <PhoneIcon fill="#475769" />,
      title: i18nData.footer.icon_text.item_3.title,
      content: i18nData.footer.icon_text.item_3.content,
    },
    {
      icon: <ClosedMailIcon fill="#475769" />,
      title: i18nData.footer.icon_text.item_4.title,
      content: i18nData.footer.icon_text.item_4.content,
    },
  ];

  return (
    <div className="p-4 w-screen bg-white md:bg-slate-200">
      {/* Use the carousel for mobile (hidden on md and above) */}
      <div className="md:hidden">
        <IconInfosCarousel items={iconItems} />
      </div>
      {/* Grid layout for desktop (visible on md and up) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4">
        {iconItems.map((item, idx) => (
          <IconInfo
            key={idx}
            icon={item.icon}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
    </div>
  );
};
