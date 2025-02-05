import React from 'react';

const Description = ({headingDescription, descriptionHtml}) => (
  <div className="md:flex md:flex-col md:justify-center md:items-center">
    <div className="p-4 mt-4 text-xl font-garamond italic md:max-w-xl leading-snug tracking-tight text-start md:text-start">
      {headingDescription}
    </div>
    <div
      className="p-4 pt-0 text-center md:max-w-xl [&_p]:mb-4 leading-snug text-start"
      dangerouslySetInnerHTML={{__html: descriptionHtml}}
    />
  </div>
);

export default Description;
