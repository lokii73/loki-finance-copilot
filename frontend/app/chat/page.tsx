'use client';
import { useEffect, useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { chatAPI } from '@/lib/api';
import { Send, Trash2, MessageSquare, History, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Past chats sidebar simulation
  const conversations = [
    { id: '1', title: 'Portfolio Risk Audit', date: 'Today' },
    { id: '2', title: 'SIP Growth Pathing', date: 'Yesterday' },
    { id: '3', title: 'Tactical PSU Advice', date: '3 days ago' },
  ];
  const [activeConv, setActiveConv] = useState('1');

  useEffect(() => {
    // Welcome message customized to Logesh's holdings
    setMessages([{
      role: 'assistant',
      content: `👋 **Namaste! I'm Loki, your personal AI Wealth Advisor.**

I've successfully loaded your **₹2,076** Angel One portfolio context. I'm ready to evaluate your holdings, index weights, or long-term SIP allocations.

**Ask me anything, for example:**
* *"Why is my portfolio diversification score only 25/100?"*
* *"Should I start a Nifty 50 Index Fund SIP of ₹500/month?"*
* *"Can I reach ₹1 Crore by age 40 with my current SIP?"*
* *"What are the risks of my ABSL PSU Fund?"*
* *"Should I stop my Motilal Oswal SIP and switch to HDFC Mid Cap?"*

Ask me anything below. *Please note that AI outputs are probability-based insights.*`
    }]);
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput('');
    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage(messageText);
      const aiMessage: Message = { role: 'assistant', content: res.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '⚠️ API Connection Error. Please verify your FastAPI backend is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    await chatAPI.clearHistory();
    setMessages([{
      role: 'assistant',
      content: '🔄 Conversation reset. What index or holdings would you like to analyze next?'
    }]);
  };

  const quickPrompts = [
    'What should I do right now?',
    'Can I reach ₹1 Crore by age 40?',
    'Why is my XIRR -19.87%? Should I worry?',
    'How risky is my portfolio?',
    'Suggest my next SIP fund',
    'Tell me about Nippon Small Cap Fund',
  ];

  return (
    <AppLayout>
      <div className="flex gap-6 h-[calc(100vh-10rem)] min-h-[550px]">
        
        {/* Left Column: Conversation History (ChatGPT Style Sidebar) */}
        <div className="w-64 border border-slate-200 rounded-2xl flex flex-col justify-between bg-slate-50 shadow-sm flex-shrink-0 hidden lg:flex">
          <div>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <History size={12} className="text-slate-400" /> Conversations
              </span>
              <button 
                onClick={clearChat}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-900 bg-transparent border-none cursor-pointer transition-colors"
                title="New Chat"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="p-2 space-y-1 mt-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 border cursor-pointer ${
                    activeConv === conv.id 
                      ? 'bg-white text-blue-600 font-bold border-slate-200 shadow-sm' 
                      : 'bg-transparent text-slate-600 hover:text-blue-600 hover:bg-white border-transparent'
                  }`}
                >
                  <MessageSquare size={13} className={activeConv === conv.id ? 'text-blue-600' : 'text-slate-400'} />
                  <div className="truncate flex-1">{conv.title}</div>
                  <span className="text-[9px] text-slate-400 font-semibold">{conv.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 bg-white rounded-b-2xl">
            <button 
              onClick={clearChat}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer bg-white transition-all duration-150 shadow-sm"
            >
              <Trash2 size={12} /> Clear History
            </button>
          </div>
        </div>

        {/* Right Column: AI Chat Window */}
        <div className="flex-1 border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden bg-white shadow-sm">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Loki AI Wealth Advisor</h2>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{providerLabel} • ₹2,076 portfolio context</p>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wide">
              Live Context
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-blue-600 border-blue-600 text-white font-medium shadow-md shadow-blue-500/20 rounded-br-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-900 shadow-sm rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none text-slate-700">
                      <ReactMarkdown
                        components={{
                          strong: ({ children }) => <strong className="font-extrabold text-slate-900">{children}</strong>,
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-2.5 text-slate-700">{children}</ul>,
                          li: ({ children }) => <li>{children}</li>,
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl bg-white shadow-sm">
                              <table className="w-full text-xs">{children}</table>
                            </div>
                          ),
                          th: ({ children }) => <th className="bg-slate-50 text-left px-3.5 py-2 font-bold text-slate-900 border-b border-slate-200 uppercase tracking-wider text-[10px]">{children}</th>,
                          td: ({ children }) => <td className="px-3.5 py-2 border-b border-slate-100 text-slate-700 font-mono">{children}</td>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-semibold">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* AI Loading status */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-bl-sm text-slate-600 text-xs flex items-center gap-2.5 shadow-sm">
                  <div className="w-4 h-4 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-[11px] font-medium text-slate-600">Computing response telemetry...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="text-[10px] px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 hover:text-blue-600 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Flat Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Loki about index overlaps, asset allocation, portfolio risk..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm placeholder:text-slate-400"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="btn-primary px-5"
            >
              <Send size={13} />
            </button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
