import React from 'react';

interface ProgressIndicatorProps {
  count: number;
  total: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  count,
  total,
}) => {
  return (
    <div className="flex justify-center mt-4">
      {Array.from({length: total}).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full mx-1 ${
            index < count ? 'bg-comptoir-blue' : 'bg-slate-100'
          }`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
