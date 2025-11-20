import React, { useState, useRef, useEffect } from 'react';
import { Product, ChatMessage } from '../types';
import { ChatBubbleIcon, CloseIcon, SparklesIcon } from './Icons';
import { chatWithShoppingAssistant } from '../services/geminiService';

interface AiAssistantProps {
  products: Product[];
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'init', 
      role: 'model', 
      text: 'Hi! I\'m Lumina, your personal shopping assistant. Looking for something specific or need style advice?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Convert format for Gemini API
    const history = messages
        .filter(m => m.id !== 'init')
        .map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

    const responseText = await chatWithShoppingAssistant(history, input, products);

    const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center
          ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-110'}
        `}
      >
        {isOpen ? (
            <CloseIcon className="w-6 h-6 text-white" />
        ) : (
            <SparklesIcon className="w-6 h-6 text-white animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-40 w-[90vw] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}
      `}
      style={{ maxHeight: '600px', height: '70vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
             <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
             <h3 className="text-white font-bold text-sm">Lumina Assistant</h3>
             <p className="text-indigo-100 text-xs">Powered by Gemini AI</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white text-gray-500 shadow-sm border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100">
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
                className="flex gap-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about products..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
            </form>
        </div>
      </div>
    </>
  );
};