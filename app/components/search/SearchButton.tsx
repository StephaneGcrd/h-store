import React, {useState} from 'react';
import SearchDrawer from './SearchDrawer';
import {SearchIcon} from '../icons';

const SearchButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleButtonClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <button onClick={handleButtonClick}>
        <SearchIcon />
      </button>
      <SearchDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default SearchButton;
