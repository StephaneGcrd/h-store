// Get a metamenu object and convert it to a list Menu Nodes

import {MetaMenu} from '~/lib/types/menu';

export const convertMetaMenuToArrayOfMenuNodes = (metamenu: MetaMenu) => {
  return metamenu.menu.references.edges.map((edge) => {
    const node = edge.node;
    const submenu = node.submenu;

    const parsedSubmenu = submenu?.references.edges.map((edge) => {
      return {
        ...edge.node,
        links: edge.node.links?.references.edges.map((edge) => edge.node),
      };
    });

    return {...node, submenu: parsedSubmenu};
  });
};
