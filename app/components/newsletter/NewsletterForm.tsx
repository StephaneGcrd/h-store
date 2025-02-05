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

const NewsletterForm = () => {
  const {i18nData} = useRouteLoaderData('root');

  const [formState, setFormState] =
    useState<NewsletterFormState>(defaultFormState);

  const [isFocus, setFocus] = useState(false);

  const FORM_SUCCESS: NewsletterFormState = {
    isSuccess: true,
    isLoading: false,
    error: '',
  };

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
      className={`flex flex-col items-center md:text-black`}
    >
      <div className="t3 text-center">{i18nData.newsletter.action.title}</div>
      <div className="text-sm mb-2">{i18nData.newsletter.action.subtitle}</div>
      <div className="w-full">
        <div className="my-2 w-full flex justify-center">
          <input
            type="email"
            name="email"
            required
            placeholder={i18nData.newsletter_placeholder_email}
            className="bg-slate-100 border-slate-200 w-full max-w-[650px]"
            onFocus={() => setFocus(true)}
          />
          <input type="hidden" name="language" value={'fr-fr'} />
        </div>
        <div className="text-xs text-center my-2 p-2  flex justify-center">
          <div className="max-w-[450px]">
            {i18nData.newsletter.action.legal}
          </div>
        </div>
        <div className="flex justify-center">
          {formState.isLoading ? (
            <button type="submit" disabled={true} className="">
              <span className="loader"></span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={formState.isSuccess}
              className={
                'border-b border-black hover:font-bold hover:border-b-2 h-6'
              }
            >
              {formState.isSuccess
                ? i18nData.newsletter_send_success
                : i18nData.newsletter.action.cta}
            </button>
          )}

          {formState.error ? (
            <div className="text-red-400">{formState.error}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </form>
  );
};

export default NewsletterForm;
