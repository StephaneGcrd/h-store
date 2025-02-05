import {convertMetaMenuToArrayOfMenuNodes} from './queries/helpers';
import {Link} from '../Link';
import HeaderBanner from './HeaderBanner';
import {useRouteLoaderData} from '@remix-run/react';
import logo from '~/assets/logo_vec.svg';
import CartButton from '../cart/CartButton';
import SearchButton from '../search/SearchButton';
import {CountrySelector} from '../CountrySelector';
import {useState} from 'react';
import MobileMenuDrawer from './MobileMenuDrawer';
import {IconMenu} from '../Icon';

type Menu = {
  id: string;
  label: {
    value: string;
  };
  path: {
    value: string;
  };
  submenu?: {
    id: string;
    label: {
      value: string;
    };
    links: {
      id: string;
      label: {
        value: string;
      };
      path: {
        value: string;
      };
    }[];
  }[];
};

const MenuLink = ({node}: {node: Menu}) => (
  <div className="group">
    <Link
      to={node.path?.value}
      className={'block font-avenir py-2 group-hover:underline'}
    >
      {node.label?.value}
    </Link>
    {node.submenu && (
      <div className="absolute left-0 w-screen h-64 z-50 bg-white grid-cols-6 hidden group-hover:grid">
        {node.submenu?.map((submenu) => (
          <div className="h-full px-4 font-avenir" key={submenu.id}>
            <div className="font-bold">{submenu.label.value}</div>
            {submenu.links.map((link) => (
              <Link
                key={link.id}
                to={link.path?.value}
                className={'hover:underline block'}
              >
                {link.label.value}
              </Link>
            ))}
          </div>
        ))}
      </div>
    )}
  </div>
);

const Menu = ({menu}: {menu: Menu[]}) => (
  <div className=" flex gap-4">
    {menu.map((node, key) => (
      <MenuLink key={key} node={node} />
    ))}
  </div>
);

const DesktopMenu = () => {
  const {layout} = useRouteLoaderData('root');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanedMenu = convertMetaMenuToArrayOfMenuNodes(layout?.headerMenu);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="fixed top-0 z-50 bg-white w-full ">
        <HeaderBanner text={layout.headerBanner?.text?.value} />
        <div className=" flex align-center justify-between text-center px-4 border-b border-gray-200 border-[1px]">
          <div className="w-48 items-center hidden md:flex">
            <CountrySelector />
          </div>
          <div className="w-48 flex items-center md:hidden">
            <button onClick={toggleMobileMenu} className="p-2">
              <span className="material-icons">
                <IconMenu />
              </span>
            </button>
          </div>
          <div className="w-32 h-16">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="w-32 h-16 py-4 object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center w-48 justify-end ">
            <div className="h-8 mr-4 pt-1">
              <SearchButton />
            </div>
            <div className="h-8 pt-1">
              <CartButton />
            </div>
          </div>
        </div>
        <div className="hidden md:flex justify-center px-4 gap-4 py-0 text-black transition-colors text-[14px]">
          <Menu menu={cleanedMenu} />
        </div>
      </div>
      <div className="h-[66px] md:h-[106px]"></div>

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
        menu={cleanedMenu}
      />
    </>
  );
};

export default DesktopMenu;

const menuExample: Menu[] = [
  {
    id: 'gid://shopify/Metaobject/307467813189',
    label: {
      value: 'Perfumes',
    },
    path: {
      value: '/collections',
    },
    submenu: [
      {
        id: 'gid://shopify/Metaobject/309310325061',
        label: {
          value: 'Collections',
        },
        links: [
          {
            id: 'gid://shopify/Metaobject/309310259525',
            label: {
              value: 'Eaux de Voyage',
            },
            path: {
              value: '/collections/eaux-de-voyages',
            },
          },
          {
            id: 'gid://shopify/Metaobject/309310292293',
            label: {
              value: 'Jardins Pop',
            },
            path: {
              value: '/collections/jardins-pop',
            },
          },
        ],
      },
      {
        id: 'gid://shopify/Metaobject/309310357829',
        label: {
          value: 'Offers',
        },
        links: [
          {
            id: 'gid://shopify/Metaobject/307468108101',
            label: {
              value: 'FAQ',
            },
            path: {
              value: '/faq',
            },
          },
          {
            id: 'gid://shopify/Metaobject/307467944261',
            label: {
              value: 'Mix & Match',
            },
            path: {
              value: '/mix-and-match',
            },
          },
        ],
      },
      {
        id: 'gid://shopify/Metaobject/309310390597',
        label: {
          value: 'Olfactive Notes',
        },
        links: [
          {
            id: 'gid://shopify/Metaobject/308525629765',
            label: {
              value: "L'Offre Découverte",
            },
            path: {
              value: '/products/discovery-offer',
            },
          },
          {
            id: 'gid://shopify/Metaobject/309310259525',
            label: {
              value: 'Eaux de Voyage',
            },
            path: {
              value: '/collections/eaux-de-voyages',
            },
          },
          {
            id: 'gid://shopify/Metaobject/309310292293',
            label: {
              value: 'Jardins Pop',
            },
            path: {
              value: '/collections/jardins-pop',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'gid://shopify/Metaobject/307467944261',
    label: {
      value: 'Mix & Match',
    },
    path: {
      value: '/mix-and-match',
    },
  },
  {
    id: 'gid://shopify/Metaobject/308525629765',
    label: {
      value: "L'Offre Découverte",
    },
    path: {
      value: '/products/discovery-offer',
    },
  },
];
