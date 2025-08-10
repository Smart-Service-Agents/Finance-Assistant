import React from 'react';
import { useChat } from '../../context/ChatContext';
import { MessageSquare, Trash2 } from 'lucide-react';

interface ConversationListProps {
  closeMobileSidebar: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ closeMobileSidebar }) => {
  const { conversations, currentConversation, setCurrentConversation, deleteConversation } = useChat();
  
  const handleConversationClick = (id: string) => {
    const conversation = conversations.find(convo => convo.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
      closeMobileSidebar();
    }
  };
  
  if (conversations.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
        No conversations yet. Start a new one!
      </div>
    );
  }
  
  return (
    <ul className="space-y-1 px-2">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <button
            onClick={() => handleConversationClick(conversation.id)}
            className={`w-full flex items-center p-3 text-left rounded-lg transition-colors group ${
              currentConversation?.id === conversation.id
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-300'
            }`}
          >
            <MessageSquare size={18} className="flex-shrink-0 mr-3 text-gray-500 dark:text-gray-400" />
            <span className="flex-1 truncate">{conversation.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(conversation.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity"
              aria-label="Delete conversation"
            >
              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
            </button>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ConversationList;