import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { PlusCircle, X, Menu, ChevronRight, DollarSign } from 'lucide-react';
import ConversationList from './ConversationList';

const Sidebar: React.FC = () => {
  const { startNewConversation } = useChat();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsMobileSidebarOpen(true)}
        className="fixed top-4 left-4 z-20 md:hidden p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        aria-label="Open sidebar"
      >
        <Menu size={20} className="text-gray-700 dark:text-gray-300" />
      </button>
      
      {/* Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out transform ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Finance Coach</h1>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <button
          onClick={() => {
            startNewConversation();
            setIsMobileSidebarOpen(false);
          }}
          className="mx-4 mt-4 flex items-center justify-center space-x-2 p-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
        >
          <PlusCircle size={20} />
          <span>New Conversation</span>
        </button>
        
        <div className="flex-1 overflow-y-auto mt-4">
          <ConversationList closeMobileSidebar={() => setIsMobileSidebarOpen(false)} />
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Finance Coach 1.0
            </div>
            <a 
              href="#" 
              className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 flex items-center"
            >
              <span>Upgrade</span>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;