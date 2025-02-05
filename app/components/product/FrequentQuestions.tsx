import {useRouteLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';
import {MinusIcon, PlusIcon} from '../icons';

const FrequentQuestions = ({questions, productPage}) => {
  const {i18nData} = useRouteLoaderData('root');

  return (
    <div className="w-full h-fit bg-comptoir-blue col-span-2 text-white">
      <div className="grid grid-cols-2">
        <div className="py-8 pb-16 px-8 col-span-2 lg:col-span-1 lg:px-16">
          <h4 className="t1 py-8 text-center">{i18nData.faq.page_title}</h4>
          {questions.map((item, key) =>
            productPage ? (
              !item.not_product_page && (
                <Question title={item.title} content={item.content} key={key} />
              )
            ) : (
              <Question title={item.title} content={item.content} key={key} />
            ),
          )}
          {!productPage && (
            <div className="mt-4 max-w-96">{i18nData.faq.small_text}</div>
          )}
        </div>
        <div className=" hidden lg:flex justify-center items-center">
          <div className="w-64">
            <Image
              src={
                'https://cdn.shopify.com/s/files/1/0757/4333/0629/files/visuel_vanille_ingredients.webp?v=1708006920'
              }
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Question = ({title, content, color, className}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className={
          'flex justify-between font-regular py-2 border-comptoir-blue-lighter border-b w-full text-left ' +
          className
        }
      >
        <div>{title}</div>
        {!showAnswer ? (
          <div>
            <PlusIcon fill={color || 'white'} />
          </div>
        ) : (
          <div>
            <MinusIcon fill={color || 'white'} />
          </div>
        )}
      </button>
      <div
        className={
          'transition-all duration-300 ' +
          (showAnswer
            ? `max-h-[550px] md:max-h-[350px] xl:max-h-[250px] border-b border-comptoir-blue-lighter ${className}`
            : 'max-h-[0px] overflow-hidden')
        }
      >
        <div className="h-4 "></div>
        {content}
        <div className="h-4 "></div>
      </div>
    </>
  );
};

export default FrequentQuestions;
