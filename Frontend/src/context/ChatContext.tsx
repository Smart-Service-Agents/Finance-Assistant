import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation, Message, BackendChatEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  setCurrentConversation: (conversation: Conversation) => void;
  startNewConversation: () => void;
  sendMessage: (content: string) => void;
  deleteConversation: (id: string) => void;
  fetchConversations: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_MASTER_KEY;

  useEffect(() => {
    if (user?.username) {
      fetchConversations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchConversations = async () => {
    if (!user?.username) return;
    try {
      const res = await fetch(`${API_BASE}load_chats/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.username, key: API_KEY })
      });

      const data = await res.json();
      
      console.log(data);

      if (res.ok && data.conversations) {
        const grouped = new Map<string, Message[]>();
        console.log(data.conversations);
        data.conversations.forEach((item: BackendChatEntry) => {
          const chatId = item.chat_id;
          if (!grouped.has(chatId)) grouped.set(chatId, []);
          grouped.get(chatId)!.push(
            {
              id: uuidv4(),
              role: 'user',
              content: item.question,
              timestamp: new Date()
            },
            {
              id: uuidv4(),
              role: 'assistant',
              content: item.answer,
              video: item.video,
              timestamp: new Date()
            }
          );
        });

        const loaded: Conversation[] = Array.from(grouped.entries()).map(([id, messages]) => ({
          id,
          title: messages[0]?.content.slice(0, 25) + '...',
          messages,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        console.log(loaded);
        setConversations(loaded);
        if (loaded.length > 0) setCurrentConversation(loaded[0]);
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations([newConversation, ...conversations]);
    setCurrentConversation(newConversation);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentConversation || !user?.username) return;

    setLoading(true);

    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      updatedAt: new Date()
    };

    if (updatedConversation.messages.length === 1) {
      updatedConversation.title = content.length > 25 ? content.substring(0, 25) + '...' : content;
    }

    setCurrentConversation(updatedConversation);
    updateConversations(updatedConversation);

    try {
      const res = await fetch(`${API_BASE}messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content })
      });

      const data = await res.json();

      const botMessage: Message = {
        id: uuidv4(),
        content: data.text || 'No response from server',
        video: data.video,
        role: 'assistant',
        timestamp: new Date()
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, botMessage],
        updatedAt: new Date()
      };

      setCurrentConversation(finalConversation);
      updateConversations(finalConversation);

      // Save to DB
      const response = await fetch(`${API_BASE}upload_chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user.username,
          question: content,
          answer: data.text,
          video: data.video,
          chat_id: updatedConversation.title,
          chat_uid: updatedConversation.id,
          key: API_KEY
        })
      });

      const d = await response.json();
      console.log(d);

    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateConversations = (updatedConversation: Conversation) => {
    setConversations(prev =>
      prev.map(convo => convo.id === updatedConversation.id ? updatedConversation : convo)
    );
  };

  const deleteConversation = async (id: string) => {
    setConversations(prev => prev.filter(convo => convo.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }

    try {
      await fetch(`${API_BASE}delete_chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: user?.username,
          chat: id,
          key: API_KEY
        })
      });
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversation,
      loading,
      setCurrentConversation,
      startNewConversation,
      sendMessage,
      deleteConversation,
      fetchConversations
    }}>
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
