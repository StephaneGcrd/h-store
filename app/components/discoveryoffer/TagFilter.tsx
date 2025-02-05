import {useRouteLoaderData} from '@remix-run/react';
import React from 'react';

interface TagFilterProps {
  tagFilter: Array<string>;
  handleTagChange: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({tagFilter, handleTagChange}) => {
  const tags = [
    'floral',
    'sweet',
    'woody',
    'vanilla',
    'spicy',
    'citrus',
    'marine',
  ];
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="py-4 mb-4">
      <div className="flex gap-2 font-garamond tracking-wide overflow-y-scroll">
        {tags.map((tag) => (
          <div
            key={tag}
            className={`cursor-pointer px-2 py-1 h-8 border ${
              tagFilter.includes(tag)
                ? 'bg-comptoir-blue text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => handleTagChange(tag)}
          >
            {i18nData.product_tags[tag.toLowerCase()]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
