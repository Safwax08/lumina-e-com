import React, { useState, useRef, useEffect } from 'react';
import { Product, ChatMessage } from '../types';
import { CloseIcon, SparklesIcon } from './Icons';
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
      text: 'Hi! I\'m Sparky, your personal gadgets and fashion assistant. Looking for something specific or need some gift advice?' 
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
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border
          ${isOpen ? 'bg-slate-900 rotate-90 border-slate-800 text-white' : 'bg-[#750a27] text-white hover:scale-110 shadow-lg shadow-slate-900/20 border-transparent'}
        `}
      >
        {isOpen ? (
            <CloseIcon className="w-5 h-5" />
        ) : (
            <SparklesIcon className="w-5 h-5 animate-pulse text-[#ffd002]" />
        )}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-40 w-[90vw] sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}
      `}
      style={{ maxHeight: '600px', height: '70vh' }}
      >
        {/* Header */}
        <div className="bg-[#750a27] p-4 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-white/10 border border-white/10 p-2 rounded-xl">
             <SparklesIcon className="w-4 h-4 text-[#ffd002]" />
          </div>
          <div>
             <h3 className="text-white font-bold text-sm tracking-wide">Spark Assistant</h3>
             <p className="text-red-200 text-[10px] font-semibold uppercase tracking-widest">Powered by Gemini AI</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === 'user' 
                        ? 'bg-[#750a27] text-white rounded-br-none shadow-sm font-medium' 
                        : 'bg-white text-slate-800 rounded-2xl rounded-bl-none border border-slate-200/60 shadow-sm font-light'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white text-slate-500 border border-slate-200/60 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-[#750a27] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#750a27] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-1.5 h-1.5 bg-[#750a27] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3.5 bg-white border-t border-slate-100">
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
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-300 focus:bg-white placeholder-slate-400 transition-all font-light"
                />
                <button 
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-[#750a27] hover:bg-slate-900 text-white p-2.5 rounded-2xl hover:opacity-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
            </form>
        </div>
      </div>
    </>
  );
};