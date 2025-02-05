import {useEffect, useState} from 'react';

import {
  CloseIcon,
  RightArrowDropIcon,
  RightArrowIcon,
} from '~/components/icons';

import Postcard from 'public/carte.svg';
import {useRouteLoaderData} from '@remix-run/react';

const NewsletterPopup = () => {
  const [showPopup, setshowPopup] = useState(false);

  const [closingState, setClosingState] = useState(false);
  const [slideState, setSlideState] = useState(false);

  const [slide, setSlide] = useState(0);

  const {i18nData} = useRouteLoaderData('root');

  useEffect(() => {
    const timeout = setTimeout(() => setshowPopup(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const closePopUp = () => {
    setClosingState(true);

    const timeout = setTimeout(() => {
      setshowPopup(false);
      setClosingState(false);
      setSlide(0);
    }, 145);
  };

  const slidePopUp = () => {
    setSlideState(true);

    const timeout = setTimeout(() => {
      setSlideState(false);
      setSlide(slide + 1);

      if (slide == 1) {
        setTimeout(() => {
          closePopUp();
        }, 2000);
      }
    }, 95);
  };

  const CloseBtn = ({...args}) => {
    return (
      <div {...args}>
        <div
          className="bg-comptoir-bluedarker rounded-full p-1 shadow-md"
          onClick={async () => {
            await fetch('/api/hideMarketing', {method: 'POST'});
            closePopUp();
          }}
        >
          <CloseIcon fill={'#fff'} className="h-4 w-4" />
        </div>
      </div>
    );
  };

  const PopupStart = () => (
    <div
      className={`w-full md:pl-4 md:w-[600px] float-right bg-white h-fit rounded-sm  shadow-lg p-4 toast flex flex-col ${
        closingState && 'toast-close'
      } ${slideState && 'toast-close-X'}`}
    >
      <CloseBtn className="flex justify-end mt-[-24px] mr-[-24px]" />
      <button
        onClick={() => slidePopUp()}
        className="flex justify-between items-center"
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-[200px] md:w-[450px]  hidden md:flex justify-center">
            <img src={Postcard} alt="postcard" className="fit-contain" />
          </div>

          <div className="text-start flex flex-col justify-between ml-4">
            <div className="t2">{i18nData.marketing.popup.start.title}</div>
            {i18nData.marketing.popup.start.description}
            <div className="btn-primary mt-2 md:mt-0">
              {i18nData.marketing.popup.start.cta}
            </div>
          </div>
        </div>
      </button>
    </div>
  );

  const PopupSecond = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      setIsSubmitting(true);

      const a = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(new FormData(e.target)),
      });

      setIsSubmitting(false);

      if (a.status == 200) {
        setSlide(2);
        const timeout = setTimeout(() => {
          closePopUp();
        }, 2000);
      } else {
        setErrorMessage(i18nData.marketing.popup.error);
      }

      return false;
    };

    return (
      <div
        className={`w-full md:pl-4 md:w-128 float-right bg-white h-fit rounded-sm  shadow-lg toast-X flex px-4 flex-col ${
          closingState && 'toast-close'
        } ${slideState && 'toast-close-X'}`}
      >
        <CloseBtn className="flex justify-end mt-[-12px] mr-[-24px]" />
        <form onSubmit={(e) => handleSubmit(e)}>
          <div>
            <div className="flex gap-2"></div>
            <input
              type="hidden"
              name="language"
              value={i18n.language || 'FR'}
            />
            <input
              className="mb-4 input-primary"
              type="email"
              name="email"
              required
              placeholder={i18nData.marketing.popup.email_placeholder}
            />
          </div>
          <div className="text-xs">{i18nData.marketing.popup.conditions}</div>
          {errorMessage && (
            <div className="text-red-700 text-xs">{errorMessage}</div>
          )}
          <button
            type="submit"
            className="border my-4 btn-primary"
            /*             onClick={() => slidePopUp()} */
          >
            {isSubmitting ? (
              <span className="loader"></span>
            ) : (
              <>{i18nData.marketing.popup.action}</>
            )}
          </button>
        </form>
      </div>
    );
  };

  const PopupThanks = () => {
    return (
      <div
        className={`w-full pl-16 md:pl-4 md:w-128 float-right  bg-white h-fit rounded-sm  shadow-lg toast-X flex p-4 flex-col ${
          closingState && 'toast-close'
        }`}
      >
        <div className="">{i18nData.marketing.popup.thanks}💙</div>
      </div>
    );
  };

  const Slides = [<PopupStart />, <PopupSecond />, <PopupThanks />];

  return (
    <>
      {showPopup && (
        <div className="w-screen p-4 fixed bottom-0 z-50">{Slides[slide]}</div>
      )}
    </>
  );
};

export default NewsletterPopup;
