import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../utils/api';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Reunite AI assistant. I can help you with finding lost items, reporting found items, understanding how to use the platform, and more. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      // Prepare conversation history (excluding system message)
      const history = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await chatAPI.sendMessage(userMessage, history);
      
      // Add AI response
      setMessages([...newMessages, { role: 'assistant', content: response.response }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: err.response?.response || "I'm sorry, I'm having trouble responding right now. Please try again in a moment."
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm your Reunite AI assistant. I can help you with finding lost items, reporting found items, understanding how to use the platform, and more. How can I assist you today?"
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2f303c] mb-2">AI Assistant</h2>
            <p className="text-[#5C5B61]">Ask me anything about Reunite or lost and found items!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg border border-purple-200 shadow-sm">
              <span className="text-lg font-bold text-purple-700">🤖 AI</span>
            </div>
            <button
              onClick={handleClear}
              className="bg-white text-[#5C5B61] px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-semibold text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M6.701 2.993a.5.5 0 0 1 .6 0l1.4 1.066a.5.5 0 0 0 .598 0l1.4-1.066a.5.5 0 0 1 .6 0l1.4 1.066a.5.5 0 0 0 .598 0l1.4-1.066a.5.5 0 0 1 .6 0l1.4 1.066a.5.5 0 0 0 .598 0L15.74 2.993a.5.5 0 0 1 .6 0l.4.304a.5.5 0 0 1 .2.6L15.5 6.5l.24 1.603a.5.5 0 0 1-.2.6l-.4.304a.5.5 0 0 1-.6 0l-1.4-1.066a.5.5 0 0 0-.598 0l-1.4 1.066a.5.5 0 0 1-.6 0l-1.4-1.066a.5.5 0 0 0-.598 0l-1.4 1.066a.5.5 0 0 1-.6 0l-1.4-1.066a.5.5 0 0 0-.598 0l-1.4 1.066a.5.5 0 0 1-.6 0l-1.4-1.066a.5.5 0 0 0-.598 0L2.26 9.507a.5.5 0 0 1-.6 0l-.4-.304a.5.5 0 0 1-.2-.6L1.5 6.5l-.24-1.603a.5.5 0 0 1 .2-.6l.4-.304a.5.5 0 0 1 .6 0l1.4 1.066a.5.5 0 0 0 .598 0L6.701 2.993ZM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clipRule="evenodd" />
              </svg>
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-[#4278ff] text-white'
                    : 'bg-gray-100 text-[#2f303c]'
                }`}
              >
                <div className="flex items-start gap-2">
                  {msg.role === 'assistant' && (
                    <span className="text-lg flex-shrink-0">🤖</span>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="border-t border-gray-100 p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#4278ff] focus:outline-none transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#4278ff] text-white px-6 py-3 rounded-lg hover:bg-[#3a6ce0] transition-colors font-semibold text-sm shadow-lg shadow-[#4278ff]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" />
                  </svg>
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
