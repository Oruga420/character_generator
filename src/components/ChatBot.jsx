'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatBot({ onCopyToPrompt }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hey! I\'m your Character Assistant powered by Groq AI. Ask me about any character from TV shows, anime, or movies! I can help you find character names, describe their appearances, or suggest similar characters.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#00ffff] via-[#3b82f6] to-[#8b5cf6] p-1 rounded-t-xl">
        <div className="bg-[rgba(10,0,21,0.95)] p-5 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00ffff] to-[#8b5cf6] flex items-center justify-center text-2xl">
              💬
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Character Assistant
                <span className="status-dot online"></span>
              </h2>
              <p className="text-sm text-gray-400">Powered by Groq AI • Ask about any character</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[rgba(10,0,21,0.5)]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`chat-message ${message.role}`}>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[rgba(0,255,255,0.2)]">
                  <span className="text-[#00ffff]">🤖</span>
                  <span className="text-xs text-[#00ffff] font-semibold">AI Assistant</span>
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              {message.role === 'assistant' && index > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[rgba(0,255,255,0.2)]">
                  <button
                    onClick={() => copyToClipboard(message.content, index)}
                    className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      copiedId === index
                        ? 'bg-[#4ecdc4] text-white'
                        : 'bg-[rgba(0,255,255,0.2)] text-[#00ffff] hover:bg-[rgba(0,255,255,0.3)]'
                    }`}
                  >
                    {copiedId === index ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  {onCopyToPrompt && (
                    <button
                      onClick={() => onCopyToPrompt(message.content)}
                      className="text-xs px-4 py-2 bg-gradient-to-r from-[#ff00ff] to-[#8b5cf6] text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      ✨ Use in Prompt
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-message assistant">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-[#ff00ff] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-gray-400 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-5 bg-[rgba(15,5,30,0.8)] border-t border-[rgba(139,92,246,0.3)]">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a character..."
            className="neon-input flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              isLoading || !input.trim()
                ? 'bg-[rgba(139,92,246,0.3)] text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00ffff] to-[#3b82f6] text-white hover:shadow-lg hover:shadow-[rgba(0,255,255,0.3)]'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Try:</span>
          {['Who is Nami?', 'One Piece characters', 'Anime girls with blue hair'].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="text-xs px-3 py-1 bg-[rgba(139,92,246,0.2)] text-gray-400 rounded-full hover:bg-[rgba(255,0,255,0.2)] hover:text-white transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
