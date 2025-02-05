import {CountrySelector} from '../CountrySelector';
import FooterNewsletter from '../newsletter/FooterNewsletter';
import {FooterCollapseMenu} from './FooterCollapseMenu';
import {FooterInformations} from './FooterInformations';
import {IconInfos} from './IconInfos';

export const Footer = () => {
  return (
    <div>
      <IconInfos />

      <div className="md:grid md:grid-cols-3">
        <FooterNewsletter />

        <FooterCollapseMenu />

        <FooterInformations />
      </div>
      <div className="p-4 md:hidden">
        <CountrySelector />
      </div>
      <div className="p-4"> © 2025 Comptoir Sud Pacifique</div>
    </div>
  );
};
