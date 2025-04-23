/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

const App = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm your Finance Coach.\n I can help you with financial planning, budgeting, investing, and other money matters.\n Ask me anything about personal finance!" },
  ]);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([
    { title: 'Chat 1', messages: [] },
    { title: 'Chat 2', messages: [] },
    { title: 'Chat 3', messages: [] },
  ]);
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [videoLink, setVideoLink] = useState('');
  const [botText, setBotText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('.');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let interval;
    if (isTyping) {
      interval = setInterval(() => {
        setTypingDots((prev) => {
          const next = prev.length < 7 ? prev + '.' : '.';
          return next;
        });
      }, 300);
    } else {
      setTypingDots('.');
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  const typeBotMessage = (text) => {
    const words = text.split(' ');
    let currentText = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index >= words.length) {
        clearInterval(interval);
        setShowVideo(true);
        return;
      }
      currentText += (index > 0 ? ' ' : '') + words[index];
      index++;
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = currentText;
        return [...newMessages];
      });
    }, 150);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setChats(prev => prev.map((chat, idx) =>
      idx === activeChatIndex ? { ...chat, messages: newMessages } : chat
    ));
    setInput('');
    setIsTyping(true);
    setShowVideo(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chatbot/messages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();

      setBotText(data.text);
      setVideoLink(data.video);

      setMessages(prev => [
        ...prev,
        { from: 'bot', text: '' }
      ]);

      typeBotMessage(data.text);
    } catch (error) {
      console.error('Error fetching bot response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const switchChat = (index) => {
    setActiveChatIndex(index);
    setMessages(chats[index].messages);
  };

  const deleteChat = (index) => {
    const updatedChats = chats.filter((_, i) => i !== index);
    setChats(updatedChats);
    const newIndex = index === 0 ? 0 : index - 1;
    setActiveChatIndex(newIndex);
    setMessages(updatedChats[newIndex]?.messages || []);
  };

  const createNewConversation = () => {
    const newChat = { title: `Chat ${chats.length + 1}`, messages: [] };
    setChats([...chats, newChat]);
    setActiveChatIndex(chats.length);
    setMessages([]);
  };

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: '#0b1a2b', color: 'white' }}>
      <div style={{ width: '20%', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
        <div style={{ height: '12%', borderBottom: '1px solid #334155' }} className="d-flex align-items-center justify-content-center">
          <h5 className="text-white">FinanceGPT</h5>
        </div>

        <div className="px-3 py-2 text-center">
          <Button variant="success" className="w-100 text-white rounded" style={{ backgroundColor: '#28a745', borderColor: '#218838' }} onClick={createNewConversation}>
            New Conversation
          </Button>
        </div>

        <div style={{ flexGrow: 1, padding: '10px', overflowY: 'auto' }}>
          {chats.map((chat, idx) => (
            <div key={idx} className="position-relative mb-2">
              <Button
                variant="dark"
                className="w-100 text-start text-white rounded"
                style={{ borderRadius: '10px', border: '1px solid transparent', backgroundColor: 'transparent' }}
                onClick={() => switchChat(idx)}
                onMouseEnter={(e) => e.currentTarget.style.border = '1px solid #475569'}
                onMouseLeave={(e) => e.currentTarget.style.border = '1px solid transparent'}
              >
                {chat.title}
                <span
                  className="position-absolute end-0 top-0 mt-1 me-1"
                  style={{ cursor: 'pointer', padding: '2px 6px', color: 'white', background: 'transparent', borderRadius: '5px' }}
                  onClick={(e) => { e.stopPropagation(); deleteChat(idx); }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'red'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  &#x1F5D1;
                </span>
              </Button>
            </div>
          ))}
        </div>

        <div style={{ height: '5%', borderTop: '1px solid #334155' }} className="d-flex align-items-center px-2">
          <small className="text-white">FinanceGPT v1.0</small>
        </div>
      </div>

      <div style={{ width: '80%' }} className="d-flex flex-column">
        <div style={{ width: '75%', margin: '0 auto', flexGrow: 1, paddingTop: '10px', overflowY: 'auto' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 d-flex ${msg.from === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}>
              <div
                style={{
                  backgroundColor: msg.from === 'bot' ? '#1e293b' : '#10b981',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  maxWidth: '75%'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="d-flex justify-content-start">
              <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '10px', borderRadius: '10px', maxWidth: '75%' }}>
                Typing{typingDots}
              </div>
            </div>
          )}
          {showVideo && videoLink && (
            <div className="d-flex justify-content-start mt-2">
              <a href={videoLink} target="_blank" rel="noopener noreferrer" className="btn btn-info">
                Watch Related Video
              </a>
            </div>
          )}
        </div>

        <div className="p-3 border-top d-flex" style={{ backgroundColor: '#0f172a' }}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Ask your finance coach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button variant="success" onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default App;
