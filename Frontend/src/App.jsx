/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import './App.css';

const convertYouTubeToEmbed = (url) => {
  try {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${urlObj.pathname}`;
    }
    return url;
  } catch (err) {
    console.warn('Invalid video URL:', url);
    return '';
  }
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const [username, setUser] = useState('');
  const [password, setKey] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [chats, setChats] = useState([]);
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('.');

  
  useEffect(() => {
    let interval;
    if (isTyping) {
      interval = setInterval(() => {
        setTypingDots((prev) => (prev.length < 3 ? prev + '.' : '.'));
      }, 300);
    } else {
      setTypingDots('.');
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  const typeBotMessage = (text, embedUrl) => {
    return new Promise((resolve) => {
      const words = text.split(' ');
      let currentText = '';
      let index = 0;

      setIsTyping(false);
      
      const interval = setInterval(() => {
        // Build up the text until we finish every word
        if (index < words.length) {
          currentText += (index > 0 ? ' ' : '') + words[index];
          index++;

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].text = currentText;
            return updated;
          });
          setChats((prev) => {
            const updatedChats = [...prev];
            const currentMessages = [...updatedChats[activeChatIndex].messages];
            currentMessages[currentMessages.length - 1].text = currentText;
            updatedChats[activeChatIndex].messages = currentMessages;
            return updatedChats;
          });

          if (index === words.length) {
            clearInterval(interval);
            setChats((prev) => {
              const updatedChats = [...prev];
              const currentMessages = [...updatedChats[activeChatIndex].messages];
              currentMessages[currentMessages.length - 1].showVideo = true;
              updatedChats[activeChatIndex].messages = currentMessages;
              return updatedChats;
            });
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].showVideo = true;
              return updated;
            });
            resolve();
          }
        }
      }, 150);
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (activeChatIndex === null) {
      const title = input.trim().split(' ').slice(0, 4).join(' ') + (input.trim().split(' ').length > 4 ? '...' : '');
      const newChat = { title, messages: [] };
      const newChats = [...chats, newChat];
      const newIndex = newChats.length - 1;
      setChats(newChats);
      setActiveChatIndex(newIndex);
      setMessages([]);
      setTimeout(() => {
        setChats((prevChats) => {
          const updated = [...prevChats];
          updated[newIndex].messages.push({ from: 'user', text: input });
          return updated;
        });
        setMessages([{ from: 'user', text: input }]);
        processBotResponse(input, newIndex);
      }, 0);
      setInput('');
      return;
    }

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setChats((prev) => {
      const updated = [...prev];
      updated[activeChatIndex].messages = newMessages;
      return updated;
    });
    setInput('');
    setIsTyping(true);

    await processBotResponse(input, activeChatIndex);
    uploadMsgs()
  };

  const processBotResponse = async (inputText, chatIndex) => {
    const base = process.env.REACT_APP_API_BASE_URL;
    const message = process.env.REACT_APP_API_MESSAGES_PATH;
    
    try {
      console.log(`Trying to reach the backend at ${base}`);
      const response = await fetch(`${base}${message}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      const embedUrl = convertYouTubeToEmbed(data.video);

      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: '', video: embedUrl, showVideo: false },
      ]);

      setChats((prev) => {
        const updated = [...prev];
        updated[chatIndex].messages.push({ from: 'bot', text: '', video: embedUrl, showVideo: false });
        return updated;
      });      

      await typeBotMessage(data.text, embedUrl);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'The backend can not be reached as of now, please try again later.' },
      ]);
    }
  };

  const switchChat = (index) => {
    setActiveChatIndex(index);
    setMessages(chats[index].messages);
  };

  const deleteChat = (index) => {
    const chatid = chats[index]['title'] 

    const updatedChats = chats.filter((_, i) => i !== index);
    const newIndex = updatedChats.length ? 0 : null;
    setChats(updatedChats);
    setActiveChatIndex(newIndex);
    setMessages(updatedChats[newIndex]?.messages || []);

    if (!currentUser)
      return;
    deleteChatDB(currentUser, chatid)
  };

  const createNewConversation = () => {
    const newChat = { title: `Chat ${chats.length + 1}`, messages: [] };
    const newChats = [...chats, newChat];
    setChats(newChats);
    setActiveChatIndex(newChats.length - 1);
    setMessages([]);
  };

  const signup = async () => {
    const base = process.env.REACT_APP_API_BASE_URL;
    const signup = process.env.REACT_APP_API_SIGNUP_PATH;

    try {
      console.log(`Trying to reach the backend at ${base}`);
      const response = await fetch(`${base}${signup}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: username, pass: password, key: `${process.env.REACT_APP_API_MASTER_KEY}` })
      });
      const data = await response.json();
      if (response.ok) {
        if (data['status'] === 200){
          setCurrentUser(data.user || username);
          setShowAuthModal(false);
        }
      } else {
        console.error('Signup failed:', data.error || data);
      }
    } catch (err) {
      console.error('Error during signup:', err);
    }
  };

  const login = async () => {
    const base = process.env.REACT_APP_API_BASE_URL;
    const login = process.env.REACT_APP_API_LOGIN_PATH;

    try {
      console.log(`Trying to reach the backend at ${base}`);
      const response = await fetch(`${base}${login}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: username, pass: password, key: `${process.env.REACT_APP_API_MASTER_KEY}` })
      });
      const data = await response.json();
      if (response.ok) {
        console.log()
        if (data['status'] === 200){
          setCurrentUser(data.user || username);
          setShowAuthModal(false);
          loadMsgs(data.user || username);
        }
      } else {
        console.error('Login failed:', data.error || data);
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  const uploadMsgs = async () => {
    if (!currentUser) {
      console.log("No signed in user found");
      return;
    }
    try{
      const curr_chat = chats[activeChatIndex];
      
      console.log("Upload:", chats);
      console.log("Upload:", curr_chat);

      const curr_messages = curr_chat['messages'];
      
      const length = curr_messages.length;
      
      const question = curr_messages[length - 3]['text'];
      const answer = curr_messages[length - 1]['text'];
      const video = curr_messages[length - 2]['video'];
      const chat_id = curr_chat['title'];


      const base = process.env.REACT_APP_API_BASE_URL;
      const save = process.env.REACT_APP_API_SAVE_PATH;

      console.log(`Trying to reach the backend at ${base}`);
      const response = await fetch(`${base}${save}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          uid:currentUser,
          question:question,
          answer:answer,
          video:video,
          cid:chat_id,
          key: `${process.env.REACT_APP_API_MASTER_KEY}`
        })
      });

      if (response.ok) console.log("Messages upload successful");
    } catch (err) {
      console.error('Error while uploading chats to Database:', err);
    }
  };

  const loadMsgs = async (currUser) => {
    try {
      const base = process.env.REACT_APP_API_BASE_URL;
      const load = process.env.REACT_APP_API_LOAD_PATH;

      console.log(`Trying to reach the backend at ${base}`);
      const response = await fetch(`${base}${load}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uid: currUser, key: `${process.env.REACT_APP_API_MASTER_KEY}` }),
      });

      if (!response.ok) {
        console.error('Failed to load:', await response.text());
        return;
      }

      const { conversations } = await response.json();

      const chatMap = new Map();
      for (const conversation of conversations){
        const chat = conversation['chat_id']; 

        if (!chatMap.has(chat)){
          chatMap.set(chat, {title: chat, messages: [] });
        }

        const chatObj = chatMap.get(chat);
        chatObj.messages.push({from:'user', text: conversation['question']});
        chatObj.messages.push({from:'bot', text: conversation['answer'], video: conversation['video'], showVideo: true})
      }

      const loadedChats = Array.from(chatMap.values());
      setChats(loadedChats);

      if (loadedChats.length > 0){
        setActiveChatIndex(0);
        setMessages(loadedChats[0].messages);
      }
    } catch (err) {
      console.error('Error while loading chats:', err);
    }
  };

  const deleteChatDB = async (currUser, chatid) => {
    try{
      const base = process.env.REACT_APP_API_BASE_URL;
      const deleteDB = process.env.REACT_APP_API_DELETE_CHAT_PATH;

      console.log(`Trying to reach the backend at ${base}`);
      const response = await fetch(`${base}${deleteDB}`, {

        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uid: currUser, chat: chatid, key: `${process.env.REACT_APP_API_MASTER_KEY}`})
      });

      if (!response.ok) {
        console.error('Failed to load:', await response.text());
        return;
      }
    } catch (err){
      console.err('Error while deleting chat from database:', err);
    }
  };


return (
  <div className="d-flex flex-column vh-100" style={{ backgroundColor: '#0b1a2b', color: 'white' }}>
    {/* Global Header */}
    <div
      style={{
        height: '6%',
        minHeight: '50px',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem'
      }}
    >
      <h5 className="mb-0">Hotel FinanceGPT</h5>
      {currentUser ? (
        <Button variant="outline-light" style={{ borderRadius: '20px', pointerEvents: 'none' }}>
          {currentUser}
        </Button>
      ) : (
        <Button variant="outline-light" onClick={() => setShowAuthModal(true)}>
          Login / Signup
        </Button>
      )}
    </div>

    {/* Main Content */}
    <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '20%',
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #334155'
        }}
      >
        <div className="px-3 py-2 text-center">
          <Button
            variant="success"
            className="w-100 text-white rounded"
            style={{ backgroundColor: '#28a745', borderColor: '#218838' }}
            onClick={createNewConversation}
          >
            New Conversation
          </Button>
        </div>
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
          {chats.map((chat, idx) => (
            <div key={idx} className="position-relative mb-2">
              <Button
                variant="dark"
                className={`w-100 text-start text-white rounded ${
                  activeChatIndex === idx ? 'border border-success' : ''
                }`}
                style={{ borderRadius: '10px', backgroundColor: 'transparent' }}
                onClick={() => switchChat(idx)}
              >
                {chat.title}
                <span
                  className="position-absolute end-0 top-0 mt-1 me-1"
                  style={{ cursor: 'pointer', padding: '2px 6px', color: 'white', borderRadius: '5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(idx);
                  }}
                >
                  &#x1F5D1;
                </span>
              </Button>
            </div>
          ))}
        </div>
        <div className="d-flex align-items-center px-2" style={{ height: '5%', borderTop: '1px solid #334155' }}>
          <small className="text-white">FinanceGPT v1.0</small>
        </div>
      </div>

      {/* Chat Window */}
      <div style={{ width: '80%' }} className="d-flex flex-column">
        <div className="no-scrollbar flex-grow-1 px-3 py-2" style={{ overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 d-flex ${msg.from === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}
            >
              <div
                style={{
                  backgroundColor: msg.from === 'bot' ? '#1e293b' : '#10b981',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  maxWidth: '75%'
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>

                {msg.from === 'bot' && msg.showVideo && msg.video && (
                  <div className="mt-2">
                    <iframe
                      width="100%"
                      height="400"
                      src={msg.video}
                      title="Related Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="d-flex justify-content-start">
              <div
                style={{
                  backgroundColor: '#1e293b',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  maxWidth: '75%'
                }}
              >
                Typing{typingDots}
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-3 border-top d-flex" style={{ backgroundColor: '#0f172a' }}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Ask your finance coach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button variant="success" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>

    {/* Auth Modal */}
    {showAuthModal && (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
          <div className="modal-content" style={{ backgroundColor: '#1e293b', color: 'white', textAlign: 'center', height: '350px' }}>
            <div className="modal-header justify-content-between border-0 px-4">
              <h5 className="modal-title mx-auto">Hotel FinanceGPT</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowAuthModal(false)}
                style={{ position: 'absolute', right: '1rem', top: '1rem' }}
              ></button>
            </div>
            <div className="modal-body d-flex flex-column justify-content-start px-4" style={{ flexGrow: 1, paddingTop: '30px' }}>
              <input
                type="text"
                className="form-control mb-3 text-center"
                placeholder="Username"
                value={username}
                onChange={(e) => setUser(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-4 text-center"
                placeholder="Password"
                value={password}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
            <div className="modal-footer justify-content-center border-0 pb-4">
              <Button variant="success" onClick={login} className="me-2">
                Login
              </Button>
              <Button variant="outline-light" onClick={signup}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);


};

export default App;
