import {useEffect, useState} from 'react';
import {MinusIcon, PlusIcon} from '../icons';
import {Link} from '../Link';
import {useRouteLoaderData} from 'react-router';

export const FooterCollapseMenu = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const {layout} = useRouteLoaderData('root');

  const {footerMenu} = layout || {};

  useEffect(() => {
    // Automatically unfold menu on desktop
    const screenX = window.innerWidth;

    if (screenX > 768) {
      setToggleMenu(true);
    }

    return () => {};
  }, []);

  return (
    <div className="md:h-72">
      <button
        onClick={() => setToggleMenu(!toggleMenu)}
        className="p-4 flex justify-between items-center font-regular text-md w-full t2"
      >
        {footerMenu.title.value}
        <div>{toggleMenu ? <MinusIcon /> : <PlusIcon />}</div>
      </button>
      {toggleMenu ? (
        <div className="py-2 px-4 flex flex-col font-secondary gap-1">
          {footerMenu.menu.references.edges.map((edge, key) => {
            const {node} = edge;

            return (
              <Link key={key} to={node.path.value} className="text-sm pb-2">
                {node.label.value}
              </Link>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
