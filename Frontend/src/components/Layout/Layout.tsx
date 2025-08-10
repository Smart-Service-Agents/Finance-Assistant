import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ChatContainer from '../Chat/ChatContainer';

const Layout: React.FC = () => {
  return (
    <div className="h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 md:ml-80">
        <ChatContainer />
      </main>
    </div>
  );
};

export default Layout;