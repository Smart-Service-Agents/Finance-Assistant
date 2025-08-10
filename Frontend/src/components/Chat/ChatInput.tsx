import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import QuickQuestions from './QuickQuestions';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, loading } = useChat();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      sendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleQuickQuestionClick = (questionText: string) => {
    setMessage(questionText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);
  
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mb-6">
      <QuickQuestions onQuestionClick={handleQuickQuestionClick} />
      
      <form 
        onSubmit={handleSubmit}
        className="flex items-end w-full bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 overflow-hidden"
      >
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your finance question..."
          rows={1}
          className="flex-1 p-4 pr-12 bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 max-h-[200px] min-h-[56px]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className={`absolute right-4 bottom-3 text-white rounded-lg p-2 transition-all ${
            message.trim() && !loading
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
      
      <div className="mt-2 px-3 text-xs text-gray-500 dark:text-gray-400">
        Finance Coach may provide inaccurate information. Verify important advice with a qualified professional.
      </div>
    </div>
  );
};

export default ChatInput;