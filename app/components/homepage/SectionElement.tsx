import React from 'react';
import TwoPanelsBanner from './TwoPanelsBanner';
import CollectionHomepage from './CollectionHomepage';
import ImageText from './ImageText';
import NewsletterClubSection from '../newsletter/NewsletterClubSection';

const SectionElement = ({element}) => {
  if (element.type == 'homepage_two_panels_banner') {
    return <TwoPanelsBanner element={element} />;
  }

  if (element.type == 'collection_element') {
    return <CollectionHomepage element={element}></CollectionHomepage>;
  }

  if (element.type == 'banner_element') {
    return <ImageText element={element} />;
  }
  if (element.type == 'homepage_newsletter_element') {
    return <NewsletterClubSection />;
  }

  return <div>{element.type}</div>;
};

export default SectionElement;
