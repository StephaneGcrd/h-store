import {useState} from 'react';
import {Link} from '@remix-run/react';

const questions = [
  {
    id: 'q1',
    question: 'How often do you use our product?',
    answers: ['Daily', 'Weekly', 'Monthly'],
  },
  {
    id: 'q2',
    question: 'What is your primary goal with our product?',
    answers: ['Improve efficiency', 'Save time', 'Reduce cost'],
  },
  {
    id: 'q3',
    question: 'ça va fréro?',
    answers: ['Oui', 'Non', 'Peut-être', 'Je sais pas', "Jordan c'est un bg"],
  },
];

const AnswerOption = ({text, selected, onClick}) => {
  const borderClass = selected ? 'border-comptoir-blue' : 'border-gray-300';
  return (
    <div
      className={`p-4 mb-2 border rounded cursor-pointer ${borderClass}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

const Slide = ({
  question,
  answers,
  selectedAnswer,
  handleAnswerChange,
  nextSlide,
  prevSlide,
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">{question}</h2>
    <div className="mb-4">
      {answers.map((answer) => (
        <AnswerOption
          key={answer}
          text={answer}
          selected={selectedAnswer === answer}
          onClick={() => handleAnswerChange(answer)}
        />
      ))}
    </div>
    <div className="flex justify-between">
      {prevSlide && (
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={prevSlide}
        >
          Previous
        </button>
      )}
      <button
        className="bg-comptoir-blue text-white px-4 py-2 rounded"
        onClick={nextSlide}
      >
        Next
      </button>
    </div>
  </div>
);

const Summary = ({answers, prevSlide}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Summary of Your Answers</h2>
    {questions.map((q) => (
      <div key={q.id} className="mb-4">
        <p className="mb-2">{q.question}</p>
        <p className="mb-2">Answer: {answers[q.id]}</p>
      </div>
    ))}
    <button
      className="bg-gray-500 text-white px-4 py-2 rounded"
      onClick={prevSlide}
    >
      Previous
    </button>
  </div>
);

export default function Diagnostic() {
  const [slide, setSlide] = useState(0);
  const [answers, setAnswers] = useState({q1: '', q2: ''});

  const nextSlide = () => setSlide(slide + 1);
  const prevSlide = () => setSlide(slide - 1);

  const handleAnswerChange = (question, answer) => {
    setAnswers({...answers, [question]: answer});
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-200 px-4 relative">
      <Link
        to="/"
        className="absolute top-4 left-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Go back to /
      </Link>
      <div className="bg-white p-8 shadow-md w-full max-w-lg">
        {slide === 0 && (
          <div className="text-center">
            <h1 className="t1 mb-4">Welcome to the Diagnostic Tool</h1>
            <p className="mb-4">
              We will ask you a few questions to diagnose the best product for
              you.
            </p>
            <button
              className="bg-comptoir-blue text-white px-4 py-2"
              onClick={nextSlide}
            >
              Start
            </button>
          </div>
        )}
        {questions.map(
          (q, index) =>
            slide === index + 1 && (
              <Slide
                key={q.id}
                question={q.question}
                answers={q.answers}
                selectedAnswer={answers[q.id]}
                handleAnswerChange={(answer) =>
                  handleAnswerChange(q.id, answer)
                }
                nextSlide={nextSlide}
                prevSlide={index > 0 ? prevSlide : null}
              />
            ),
        )}
        {slide === questions.length + 1 && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Results</h2>
            <p className="mb-4">
              Based on your answers, we recommend the following product...
            </p>
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={prevSlide}
              >
                Previous
              </button>
              <button
                className="bg-comptoir-blue text-white px-4 py-2 rounded"
                onClick={nextSlide}
              >
                View Summary
              </button>
            </div>
          </div>
        )}
        {slide === questions.length + 2 && (
          <Summary answers={answers} prevSlide={prevSlide} />
        )}
      </div>
    </div>
  );
}
