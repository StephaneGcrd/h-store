import {useState, useEffect} from 'react';
import {CloseIcon, LeftArrowDropIcon} from '../icons';
import {Menu} from './DesktopMenu';
import {Link} from '../Link';

const MenuLinkMobile = ({
  node,
  toggleMenu,
  showSubMenu,
}: {
  node: Menu;
  toggleMenu: () => void;
  showSubMenu: (menu: Menu) => void;
}) => {
  try {
    return (
      <div
        className="border-b overflow-y-scroll text-[15px] "
        onClick={(e) => e.stopPropagation()}
      >
        {node.submenu ? (
          <button
            onClick={() => showSubMenu(node.label.value, node.submenu)}
            className="w-full h-full p-4  block text-start"
          >
            {node.label.value}
          </button>
        ) : node.links ? (
          <>
            <div className="font-bold p-4">{node.label.value}</div>
            {node.links.map((link) => (
              <Link
                key={link.id}
                to={link.path.value}
                onClick={toggleMenu}
                className={'w-full h-full px-4 pb-4  block'}
              >
                {link.label.value}
              </Link>
            ))}
          </>
        ) : (
          <Link
            to={node.path.value}
            onClick={toggleMenu}
            className={'w-full p-4  block'}
          >
            {node.label.value}
          </Link>
        )}
      </div>
    );
  } catch (e) {
    console.log('errror', node);
  }
};

const MobileMenuDrawer = ({
  isOpen,
  toggleMenu,
  menu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
  menu: Menu[];
}) => {
  const [currentMenu, setCurrentMenu] = useState<Menu[]>(menu);
  const [isSubMenu, setIsSubMenu] = useState(false);
  const [subMenuTitle, setSubMenuTitle] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const showSubMenu = (menuTitle, submenu: Menu) => {
    setCurrentMenu(submenu);
    setIsSubMenu(true);
    setSubMenuTitle(menuTitle);
  };

  const goBack = () => {
    setCurrentMenu(menu);
    setIsSubMenu(false);
    setSubMenuTitle('');
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 font-avenir z-50 h-full w-screen bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
        onClick={toggleMenu}
      >
        <div
          className="flex justify-between items-center p-4 border-b  h-16"
          onClick={(e) => e.stopPropagation()}
        >
          {isSubMenu && (
            <button onClick={goBack} className="p-2">
              <LeftArrowDropIcon className="w-8 h-8" />
            </button>
          )}
          <span className="font-bold flex-1 text-center">
            {isSubMenu ? subMenuTitle : 'Menu'}
          </span>
          <button onClick={toggleMenu} className="p-2">
            <span className="material-icons">
              <CloseIcon />
            </span>
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {currentMenu &&
            currentMenu.map((node, key) => (
              <MenuLinkMobile
                key={key}
                node={node}
                toggleMenu={toggleMenu}
                showSubMenu={showSubMenu}
              />
            ))}
          {/*           <div
            id="bottom-area-close"
            className="w-full h-[calc(100vh-20rem)]"
            onClick={toggleMenu}
          ></div> */}
        </div>
      </div>
    </>
  );
};

export default MobileMenuDrawer;
