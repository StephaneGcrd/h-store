import React from 'react';

export interface IconInfoProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const IconInfo: React.FC<IconInfoProps> = ({icon, title, content}) => {
  return (
    <div className="h-44 md:h-64 flex flex-col justify-center items-center mb-2 text-slate-600">
      <div className="w-12 h-12 flex justify-center items-center mb-2">
        {icon}
      </div>
      <p>{title}</p>
      <p className="w-64 text-center md:text-sm">{content}</p>
    </div>
  );
};

export default IconInfo;
