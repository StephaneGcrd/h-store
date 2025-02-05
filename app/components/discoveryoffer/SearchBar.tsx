import {useRouteLoaderData} from '@remix-run/react';
import React from 'react';
import {SearchIcon, CloseIcon} from '~/components/icons'; // Import your icons

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({searchTerm, setSearchTerm}) => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
      <input
        type="text"
        placeholder={i18nData.search.placeholder}
        className="w-full bg-slate-100 border-none pl-10 pr-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <CloseIcon
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-4 h-4"
          onClick={() => setSearchTerm('')}
        />
      )}
    </div>
  );
};

export default SearchBar;
