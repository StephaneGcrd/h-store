export type MetaMenu = {
  id: string;
  menu: {
    key: 'elements';
    references: {
      edges: Array<{node: MetaMenuNode}>;
    };
  };
};

export type MetaMenuNode = {
  id?: string;
  label: {
    value: string;
  };
  path: {
    value: string;
  };
  submenu?: {
    key: 'submenus';
    references: {
      edges: Array<{node: MetaMenuSubmenuNode}>;
    };
  };
};

export type MetaMenuSubmenuNode = {
  id?: string;
  label: {
    value: string;
  };
  links: {
    references: {
      edges: Array<{node: MetaMenuNode}>;
    };
  };
};

export type CleanedMetaMenuSubmenuNode = {
  id?: string;
  label: {
    value: string;
  };
  links: Array<MetaMenuNode>;
};
