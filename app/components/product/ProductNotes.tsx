import React from 'react';
import {useRouteLoaderData} from '@remix-run/react';

interface ProductNotesProps {
  noteOne: {
    references: {
      nodes: Array<{id: string; label: {value: string}}>;
    };
  };
  noteTwo: {
    references: {
      nodes: Array<{id: string; label: {value: string}}>;
    };
  };
  noteThree: {
    references: {
      nodes: Array<{id: string; label: {value: string}}>;
    };
  };
}

const ProductNotes: React.FC<ProductNotesProps> = ({
  noteOne,
  noteTwo,
  noteThree,
}) => {
  const {i18nData} = useRouteLoaderData('root');
  return (
    <div className="bg-comptoir-lightblue text-comptoir-bluedarker p-4 md:bg-transparent md:text-black md:text-center md:h-full md:flex md:flex-col md:justify-center">
      <div>
        <h2 className="t2 md:t1 md:py-4 font-semibold">
          {i18nData.notes_title}
        </h2>
        <div className="md:mb-2">
          <div className="font-bold">{i18nData.note_one}</div>
          {noteOne.references?.nodes.map((node) => node.label.value).join(', ')}
        </div>
        <div className="md:mb-2">
          <div className="font-bold">{i18nData.note_two}</div>
          {noteTwo.references?.nodes.map((node) => node.label.value).join(', ')}
        </div>
        <div>
          <div className="font-bold">{i18nData.note_three}</div>
          {noteThree.references?.nodes
            .map((node) => node.label.value)
            .join(', ')}
        </div>
      </div>
    </div>
  );
};

export default ProductNotes;
