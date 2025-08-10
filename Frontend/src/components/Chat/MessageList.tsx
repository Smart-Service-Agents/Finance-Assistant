import React, { useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import Message from './Message';
import { Bot, User } from 'lucide-react';

const WelcomeMessage: React.FC = () => (
  <div className="flex items-start space-x-4 p-6 max-w-4xl mx-auto animate-fade-in">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
      <Bot size={20} className="text-emerald-600" />
    </div>
    <div className="flex-1">
      <div className="text-gray-800 dark:text-gray-200 prose dark:prose-invert">
        <h3 className="text-lg font-medium mb-2">Hello! I'm your Hotel Assistant</h3>
        <p>I help hotel management students and professionals with daily operations, guest services, and hospitality best practices. Ask me anything about running or managing a hotel!</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Here are some things I can help with:
        </p>
        <ul className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <li>Front office & housekeeping</li>
          <li>Budgeting & cost control</li>
          <li>Guest experience strategies</li>
          <li>Inventory and vendor management</li>
          <li>Hospitality marketing and SOPs</li>
        </ul>
      </div>
    </div>
  </div>
);

const MessageList: React.FC = () => {
  const { currentConversation, loading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);
  
  const renderProfileIcon = (role: 'user' | 'assistant') => {
    if (role === 'assistant') {
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <Bot size={20} className="text-emerald-600" />
        </div>
      );
    } else {
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User size={20} className="text-blue-600" />
        </div>
      );
    }
  };
  
  return (
    <div className="flex-1 overflow-y-auto py-4 px-4 md:px-6">
      {!currentConversation?.messages.length ? (
        <WelcomeMessage />
      ) : (
        <div className="space-y-6">
          {currentConversation.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              icon={renderProfileIcon(message.role)}
            />
          ))}
          
          {loading && (
            <div className="flex items-start space-x-4 p-4 max-w-4xl mx-auto animate-pulse">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Bot size={20} className="text-emerald-600" />
              </div>
              <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;