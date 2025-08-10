import React from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

const ChatContainer: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="pt-16 pb-32 h-full overflow-hidden flex flex-col">
        <MessageList />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pt-6 px-4">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatContainer;