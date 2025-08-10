import React from 'react';
import { quickQuestions } from '../../data/quickQuestions';

interface QuickQuestionsProps {
  onQuestionClick: (text: string) => void;
}

const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onQuestionClick }) => {
  return (
    <div className="py-4 w-full overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-4">
      <div className="flex gap-2 px-1">
        {quickQuestions.map((question) => (
          <button
            key={question.id}
            onClick={() => onQuestionClick(question.text)}
            className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap shadow-sm"
          >
            {question.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuestions;