export interface Promotions {
  references: {
    nodes: Promotion[];
  };
}

export interface Promotion {
  id: string;
  gift: {
    key: string;
    value: string;
  };
  active: {
    key: string;
    value: string;
  };
  type: {
    key: string;
    value: 'ITEM' | 'MONEY';
  };
  minimum_value: {
    key: string;
    value: string;
  };
  items_condition: {
    key: string;
    value: string;
    references: {
      edges: {
        node: {
          id: string;
        };
      }[];
    };
  };
}
