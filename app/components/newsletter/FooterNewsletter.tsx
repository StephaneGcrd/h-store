import {useRouteLoaderData} from '@remix-run/react';
import {useState} from 'react';

type NewsletterFormState = {
  isSuccess: boolean;
  error?: string;
  isLoading: boolean;
};

const defaultFormState = {
  isSuccess: false,
  isLoading: false,
  error: '',
};

const FooterNewsletter = ({notFooter}) => {
  const [formState, setFormState] =
    useState<NewsletterFormState>(defaultFormState);

  const [isFocus, setFocus] = useState(false);

  const FORM_SUCCESS: NewsletterFormState = {
    isSuccess: true,
    isLoading: false,
    error: '',
  };

  const {i18nData} = useRouteLoaderData('root');

  const errorMessage = {
    NO_EMAIL: i18nData.error_no_email,
    DEFAULT: i18nData.error_generic,
  };

  const handleSubmit = async (event: React.ChangeEvent<any>) => {
    event.preventDefault();

    setFormState({
      ...formState,
      isLoading: true,
    });

    const res = await fetch(`/api/newsletter`, {
      method: 'POST',
      body: new URLSearchParams(new FormData(event.target)),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    setFormState({
      ...formState,
      isLoading: false,
    });

    const resp = await res.json();

    if (res.status == 200) {
      setFormState(FORM_SUCCESS);
    } else {
      setFormState({
        isSuccess: false,
        isLoading: false,
        error: errorMessage[error] || errorMessage['DEFAULT'],
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`px-4 py-8 flex flex-col items-center ${
        notFooter ? 'bg-white text-black' : 'bg-comptoir-blue text-white'
      } md:bg-white  md:text-black`}
    >
      <div className="w-full">
        <div className="t2 text-center py-2">{i18nData.newsletter_title}</div>
        <div className="text-md text-center">
          {i18nData.newsletter_description}
        </div>
        <div className="my-4">
          <input
            type="email"
            name="email"
            required
            placeholder={i18nData.newsletter_placeholder_email}
            className="input-primary"
            onFocus={() => setFocus(true)}
          />
          <input
            type="hidden"
            name="language"
            value={i18nData.language || 'fr-fr'}
          />
        </div>
        {isFocus ? (
          <>
            {formState.isLoading ? (
              <button type="submit" disabled={true} className="btn-primary">
                ...
              </button>
            ) : (
              <button
                type="submit"
                disabled={formState.isSuccess}
                className={`${
                  notFooter ? 'btn-primary' : 'btn-secondary-white'
                } md:btn-primary mb-2`}
              >
                {formState.isSuccess
                  ? i18nData.newsletter_send_success
                  : i18nData.newsletter_send}
              </button>
            )}

            {formState.error ? (
              <div className="text-red-400">{formState.error}</div>
            ) : (
              <></>
            )}

            <div className="text-sm">{i18nData.newsletter_legal}</div>
          </>
        ) : (
          <></>
        )}
      </div>
    </form>
  );
};

export default FooterNewsletter;
