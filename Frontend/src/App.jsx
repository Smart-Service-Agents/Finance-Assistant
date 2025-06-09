/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Dropdown } from 'react-bootstrap';
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDeleteIndex, setChatToDeleteIndex] = useState(null);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState('');


  
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
  
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const sessionStart = localStorage.getItem('sessionStart');
  
    if (storedUser && sessionStart) {
      const now = Date.now();
      const elapsed = now - parseInt(sessionStart, 10);
    
      const SESSION = 3 * 24 * 60 * 60 * 1000;
      if (elapsed < SESSION) {
        setCurrentUser(storedUser);
        loadMsgs(storedUser);
      } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionStart');
      }
    }
  }, []);

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
      const newChat = { title, messages: [], uid: 'null' };
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
    const chatid = chats[index]['uid']

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
    const newChat = { title: `Chat ${chats.length + 1}`, messages: [], uid: 'null' };
    const newChats = [...chats, newChat];
    setChats(newChats);
    setActiveChatIndex(newChats.length - 1);
    setMessages([]);
  };

  const signup = async () => {
    const base = process.env.REACT_APP_API_BASE_URL;
    const signup = process.env.REACT_APP_API_SIGNUP_PATH;

    try {
      
      const response = await fetch(`${base}${signup}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: username, pass: password, key: `${process.env.REACT_APP_API_MASTER_KEY}` })
      });
      const data = await response.json();
      if (response.ok) {
        if (data['status'] === 200){
          setCurrentUser(data.user || username);
          
          const now = new Date().getTime(); // Current timestamp in milliseconds
          localStorage.setItem('currentUser', data.user || username);
          localStorage.setItem('sessionStart', now.toString());

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
      
      const response = await fetch(`${base}${login}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: username, pass: password, key: `${process.env.REACT_APP_API_MASTER_KEY}` })
      });
      const data = await response.json();
      if (response.ok) {
        console.log()
        if (data['status'] === 200){
          setCurrentUser(data.user || username);
          
          const now = new Date().getTime(); // Current timestamp in milliseconds
          localStorage.setItem('currentUser', data.user || username);
          localStorage.setItem('sessionStart', now.toString());

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
      const unique_id = curr_chat['uid']

      const base = process.env.REACT_APP_API_BASE_URL;
      const save = process.env.REACT_APP_API_SAVE_PATH;

      
      const response = await fetch(`${base}${save}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          uid:currentUser,
          question:question,
          answer:answer,
          video:video,
          cid:chat_id,
          chat_uid:unique_id,
          key: `${process.env.REACT_APP_API_MASTER_KEY}`
        })
      });

      const data = await response.json();
      
      const unique_chatid = '';
      if (unique_id == 'null'){
        unique_chatid = data['chat_uid'];
        chats[activeChatIndex]['uid'] = unique_chatid;
      }
      
      if (response.ok) console.log("Messages upload successful");
    } catch (err) {
      console.error('Error while uploading chats to Database:', err);
    }
  };

  const loadMsgs = async (currUser) => {
    try {
      const base = process.env.REACT_APP_API_BASE_URL;
      const load = process.env.REACT_APP_API_LOAD_PATH;

      
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
        const chat = conversation['chat_uid']; 

        if (!chatMap.has(chat)){
          chatMap.set(chat, {title: conversation['chat_id'], messages: [], uid: chat });
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
      console.error('Error while deleting chat from database:', err);
    }
  };

  const updateChatName = async (currUser, chat, oldTitle, idx) => {
    const user = currUser;
    const updatedTitle = chat['title'];
    const chat_uid = chat['uid'];
    const oldName = oldTitle;

    console.log(user);
    console.log(updatedTitle);
    console.log(chat_uid);
    try{
      const base = process.env.REACT_APP_API_BASE_URL;
      const updateName = process.env.REACT_APP_API_UPDATE_CHAT_NAME;
      console.log(`${base} ${updateName}`)

      const response = await fetch(`${base}/api/chatbot/update-chat/`, {
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({uid: user, c_uid: chat_uid, updated_title: updatedTitle, key: `${process.env.REACT_APP_API_MASTER_KEY}`})
      })
    } catch (err){
      console.error('Error while updating chat name:', err);
      
      const revertedChats = [...chats];
      revertedChats[idx].title = oldName;
      setChats(revertedChats);
    }
  };


  return (
    <div
      className="d-flex vh-100 flex-column"
      style={{
        backgroundColor: '#0b1a2b',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* ───── Header ───── */}
      <div
        style={{
          flex: '0 0 6%',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          backgroundColor: '#0f172a',
        }}
      >
        <h5 className="text-white mb-0">Hotel FinanceGPT</h5>
        {currentUser ? (
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light" style={{ borderRadius: '20px' }}>
              {currentUser}
            </Dropdown.Toggle>

            <Dropdown.Menu
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
              }}
            >
              <Dropdown.Item
                href="#"
                style={{ color: 'white' }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#334155')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                🛠 Settings
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                style={{ color: 'white' }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#334155')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                💎 Premium
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setShowLogoutModal(true);
                }}
                style={{ color: 'white' }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#334155')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                🚪 Log out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button variant="outline-light" onClick={() => setShowAuthModal(true)}>
            Login / Signup
          </Button>
        )}
      </div>

      {/* ───── Main area: sidebar + chat ───── */}
      <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          style={{
            flex: '0 0 20%',
            borderRight: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0f172a',
            overflow: 'hidden',
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

          <div style={{ flex: '1 1 auto', padding: '10px', overflowY: 'auto' }}>
            {chats.map((chat, idx) => (
              <div key={idx} className="position-relative mb-2">
                {/* Edit input field shown only when editing */}
                {editingIndex === idx && (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const updatedChats = [...chats];
                        const oldTitle = updatedChats[idx].title;
                        updatedChats[idx].title = editedTitle.trim() || 'Untitled Chat';
                        setChats(updatedChats);
                        updateChatName(currentUser, chat, oldTitle, idx);
                        setEditingIndex(null);
                      } else if (e.key === 'Escape') {
                        setEditingIndex(null);
                      }
                    }}
                    autoFocus
                    className="form-control mb-1"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      zIndex: 10,
                      backgroundColor: '#1e293b',
                      color: 'white',
                      border: '1px solid #334155',
                    }}
                  />
                )}
                          
                <Button
                  variant="dark"
                  className={`w-100 text-start text-white rounded ${activeChatIndex === idx ? 'border border-success' : ''}`}
                  style={{ borderRadius: '10px', backgroundColor: 'transparent', position: 'relative' }}
                  onClick={() => switchChat(idx)}
                >
                  {chat.title}

                  {/* Edit icon (left of trash can) */}
                  <span
                    className="position-absolute"
                    style={{
                      top: '0.25rem',
                      right: '2rem',
                      cursor: 'pointer',
                      padding: '2px 6px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingIndex(idx);
                      setEditedTitle(chat.title);
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#475569')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    ✏️
                  </span>
                  
                  {/* Trash icon */}
                  <span
                    className="position-absolute"
                    style={{
                      top: '0.25rem',
                      right: '0.25rem',
                      cursor: 'pointer',
                      padding: '2px 6px',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatToDeleteIndex(idx);
                      setShowDeleteModal(true);
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'red')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    🗑️
                  </span>
                </Button>

              </div>
            ))}
          </div>

          <div style={{ flex: '0 0 5%', borderTop: '1px solid #334155' }} className="d-flex align-items-center px-2">
            <small className="text-white">FinanceGPT v1.0</small>
          </div>
        </div>

        {/* Chat area */}
        <div
          className="d-flex flex-column"
          style={{
            flex: '1 1 auto',
            backgroundColor: '#0b1a2b',
            overflow: 'hidden',
          }}
        >
          {/* Messages container: 70% width, centered, scrollable */}
          <div
            className="no-scrollbar"
            style={{
              width: '70%',
              margin: '0 auto',
              flex: '1 1 auto',
              padding: '10px',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 d-flex ${msg.from === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}
              >
                <div
                  style={{
                    backgroundColor: msg.from === 'bot' ? '#1e293b' : '#10b981',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '75%',
                  }}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
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
                      <div className="mt-2 d-flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded feedback-button"
                          onClick={() => {
                            setFeedbackContext(msg.text);
                            setShowFeedbackModal(true);
                          }}
                        >
                          Need detailed answer?
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded feedback-button"
                          onClick={() => {
                            setFeedbackContext(msg.text);
                            setShowFeedbackModal(true);
                          }}
                        >
                          Not Satisfied?
                        </Button>
                      </div>
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
                    maxWidth: '75%',
                  }}
                >
                  Typing{typingDots}
                </div>
              </div>
            )}
          </div>

          {/* Input bar: centered 70%, input fills available space */}
          <div
            className="p-3 border-top d-flex justify-content-center"
            style={{ backgroundColor: '#0f172a', flex: '0 0 auto' }}
          >
            <div style={{ width: '70%', display: 'flex' }}>
              <input
                type="text"
                className="form-control me-2"
                placeholder="Ask your finance coach..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{ flexGrow: 1 }}
              />
              <Button variant="success" onClick={sendMessage}>
                Send
              </Button>
            </div>
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
                />
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

      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: '#1e293b', color: 'white', textAlign: 'center' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title w-100">Delete this chat?</h5>
              </div>
              <div className="modal-footer justify-content-center border-0 pb-4">
                <Button
                  variant="danger"
                  onClick={() => {
                    deleteChat(chatToDeleteIndex);
                    setShowDeleteModal(false);
                  }}
                  className="me-2"
                >
                  Yes
                </Button>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  No
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: '#1e293b', color: 'white', textAlign: 'center' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title w-100">Logout?</h5>
              </div>
              <div className="modal-footer justify-content-center border-0 pb-4">
                <Button
                  variant="danger"
                  onClick={() => {
                    setCurrentUser(null);
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('lastLoginTime');
                    setChats([]);
                    setMessages([]);
                    setActiveChatIndex(null);

                    setShowLogoutModal(false);
                  }}
                  className="me-2"
                >
                  Yes
                </Button>
                <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                  No
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">Send Feedback</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowFeedbackModal(false)} />
              </div>
              <div className="modal-body">
                <p>You’re requesting further help on:</p>
                <div className="p-2" style={{ backgroundColor: '#0f172a', borderRadius: '5px' }}>
                  <small>{feedbackContext}</small>
                </div>
                <p className="mt-3">An email will be sent to: <strong>support@example.com</strong></p>
              </div>
              <div className="modal-footer border-0">
                <Button variant="success" onClick={() => {
                  // sendFeedbackEmail(feedbackContext);
                  setShowFeedbackModal(false);
                }}>
                  Send
                </Button>
                <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
                  Cancel
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