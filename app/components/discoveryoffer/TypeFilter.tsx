import React from 'react';

interface TypeFilterProps {
  typeFilter: string;
  handleTypeChange: (type: string) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({
  typeFilter,
  handleTypeChange,
}) => {
  return (
    <div>
      <label>
        <input
          type="radio"
          name="type"
          value="everything"
          checked={typeFilter === 'everything'}
          onChange={() => handleTypeChange('everything')}
        />
        Everything
      </label>
      <label>
        <input
          type="radio"
          name="type"
          value="EDP"
          checked={typeFilter === 'EDP'}
          onChange={() => handleTypeChange('EDP')}
        />
        EDP
      </label>
      <label>
        <input
          type="radio"
          name="type"
          value="EDT"
          checked={typeFilter === 'EDT'}
          onChange={() => handleTypeChange('EDT')}
        />
        EDT
      </label>
    </div>
  );
};

export default TypeFilter;
