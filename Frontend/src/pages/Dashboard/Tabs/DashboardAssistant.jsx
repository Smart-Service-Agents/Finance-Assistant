import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Lightbulb, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../../../components/Generic/LoadingSpinner';

export default function DashboardAssistant() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your Hotel Management Assistant. Ask me about guest reviews, service improvements, or anything else you need!",
      timestamp: new Date(),
      suggestions: [
        "What are the main complaints in recent reviews?",
        "How can I improve room service?",
        "Show me trends in guest satisfaction",
        "What should I prioritize for improvements?"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState([]);

  const messagesEndRef = useRef(null);

  const quickActions = [
    { id: '1', title: 'Review Analysis', description: 'Analyze recent feedback', message: "What are the main complaints in recent reviews?" },
    { id: '2', title: 'Priority Roadmap', description: 'Get improvement priorities', message: "What should I prioritize for improvements?" },
    { id: '3', title: 'Satisfaction Trends', description: 'Track performance over time', message: "Show me trends in guest satisfaction" },
    { id: '4', title: 'Service Improvement', description: 'Enhance guest services', message: "How can I improve room service?" },
    { id: '5', title: 'Competitor Analysis', description: 'Compare with competitors', message: "How do I compare to my competitors?" },
    { id: '6', title: 'Staff Training', description: 'Identify training needs', message: "What staff training should I prioritize?" },
    { id: '7', title: 'Revenue Optimization', description: 'Boost revenue strategies', message: "How can I increase revenue per guest?" },
    { id: '8', title: 'Guest Retention', description: 'Improve loyalty programs', message: "What can I do to improve guest retention?" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch('/api/insights');
        const data = await res.json();
        setInsights(data);
      } catch (err) {
        console.error('Failed to fetch insights:', err);
      }
    };
    fetchInsights();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const rawReviews = JSON.parse(localStorage.getItem('reviews_cache') || '[]');
    const reviews = rawReviews.map(r => ({
      text: r.text,
      rating: r.rating,
      creationDate: r.creationDate || "NULL"
    }));    
    
    try {
      const uri = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_CHATBOT_PATH

      const res = await fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: messageToSend,
          reviews: reviews
        })
      });

      const assistantResponse = await res.json();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse.content,
        timestamp: new Date(),
        suggestions: assistantResponse.suggestions || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Assistant API error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, something went wrong. Try again later.",
        timestamp: new Date(),
        suggestions: []
      }]);
    }

    setIsLoading(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Left Panel - Quick Actions */}
        <div className="xl:col-span-1 order-2 xl:order-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6 h-[700px] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleSendMessage(action.message)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="font-medium text-gray-800 text-sm">{action.title}</div>
                  <div className="text-xs text-gray-600">{action.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Chat */}
        <div className="xl:col-span-2 order-1 xl:order-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[700px]">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Hotel Assistant</h3>
                  <p className="text-sm text-green-600">● Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'
                      }`}>
                        {message.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {message.content}
                        </div>
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs opacity-75 font-medium">Suggested questions:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSendMessage(suggestion)}
                                className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-2 transition-all duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <LoadingSpinner size="sm" color="purple" />
                      <span className="text-sm text-gray-600">Analyzing your data...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about improving your hotel..."
                  disabled={isLoading}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Quick Insights */}
        <div className="xl:col-span-1 order-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6 h-[700px] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Lightbulb size={20} className="text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-800">Quick Insights</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {insights.map((insight) => (
                <div key={insight.id} className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {insight.icon || <TrendingUp size={20} className="text-gray-500" />}
                      <h4 className="font-medium text-gray-800 text-sm">{insight.title}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(insight.priority)}`}>
                      {insight.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">{insight.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}