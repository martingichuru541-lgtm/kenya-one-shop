import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';

interface RafikiAIAssistantProps {
  onSelectProduct: (productId: string) => void;
}

export const RafikiAIAssistant: React.FC<RafikiAIAssistantProps> = ({ onSelectProduct }) => {
  const { 
    isRafikiOpen, 
    setIsRafikiOpen, 
    rafikiMessages, 
    sendRafikiMessage, 
    products, 
    currency 
  } = useCommerce();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'Niaje! Nipe deals za leo',
    'Coffee ya Nyeri SL-28 inafaa V60?',
    'Deliveries za Mombasa & Kisumu ni how much?',
    'How does M-Pesa escrow protection work?'
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [rafikiMessages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const query = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      await sendRafikiMessage(query);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPromptClick = async (prompt: string) => {
    if (isTyping) return;
    setIsTyping(true);
    try {
      await sendRafikiMessage(prompt);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isRafikiOpen && (
        <button
          onClick={() => setIsRafikiOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all transform hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Open Rafiki AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-display font-bold text-xs tracking-wide hidden sm:inline pr-1">
            Rafiki AI · Sheng & Swahili
          </span>
        </button>
      )}

      {/* Expanded Rafiki Chat Modal */}
      {isRafikiOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] h-[580px] bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up text-stone-100 font-sans">
          
          {/* Header */}
          <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center text-white font-bold shadow">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-white">Rafiki AI Concierge</h3>
                  <span className="text-[9px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Fluent in Sheng, Swahili & English · 47 Counties
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRafikiOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-stone-950/60 border-b border-stone-800/80 overflow-x-auto custom-scrollbar flex items-center gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPromptClick(p)}
                className="text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 rounded-full px-3 py-1 whitespace-nowrap shrink-0 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {rafikiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'rafiki' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-900/80 border border-emerald-700 text-emerald-300 flex items-center justify-center shrink-0 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-stone-400 mt-1 block text-right font-mono">
                    {msg.timestamp}
                  </span>

                  {/* Render Suggested Products if available */}
                  {msg.suggestedProductIds && msg.suggestedProductIds.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-800 space-y-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        Recommended for You
                      </span>
                      {msg.suggestedProductIds.map(pid => {
                        const prod = products.find(p => p.id === pid);
                        if (!prod) return null;
                        return (
                          <div
                            key={prod.id}
                            onClick={() => onSelectProduct(prod.id)}
                            className="p-2 bg-stone-900 hover:bg-stone-800 rounded-xl border border-stone-700 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={prod.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                              <div className="min-w-0">
                                <h6 className="font-semibold text-white truncate text-[11px]">{prod.title}</h6>
                                <span className="font-mono text-emerald-400 text-[10px] font-bold">
                                  {formatCurrency(prod.priceKes, currency)}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center shrink-0 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                </div>
                <span>Rafiki is drafting advice...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-stone-950 border-t border-stone-800">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask in Sheng, Swahili, or English..."
                className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow transition-colors"
                title="Send to Rafiki AI"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
