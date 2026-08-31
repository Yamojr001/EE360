import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionUrl?: string;
  actionText?: string;
  timestamp: string;
}

interface QuickQuestion {
  id: string;
  label: string;
  question: string;
  answer: string;
  actionUrl?: string;
  actionText?: string;
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    id: 'siwes',
    label: 'SIWES / Internship / NYSC',
    question: 'How do I apply for SIWES, Internship, or NYSC posting?',
    answer: 'You can apply directly online through our official portal! We accept students for industrial attachments, graduate internships, and NYSC primary assignments. Applications are reviewed directly by EEFarm360 Management.',
    actionUrl: '/apply',
    actionText: 'Go to Application Portal',
  },
  {
    id: 'sales',
    label: 'Wholesale Fish & Yateem Water',
    question: 'How do I purchase Catfish, Poultry, or Yateem Water?',
    answer: 'We offer wholesale pricing for fresh catfish, fingerlings, dressed chicken, eggs, rabbits, pigeons, and Yateem Table Water. Call our sales desk directly at 07061444050 or 09077640697.',
    actionUrl: 'tel:07061444050',
    actionText: 'Call Sales (07061444050)',
  },
  {
    id: 'location',
    label: 'Location & Hours',
    question: 'Where is EEFarm360 located and what are your opening hours?',
    answer: 'EEFarm360 is located at Madobi Road, Sharifai Community, Dutse, Jigawa State, Nigeria. We are open Monday to Saturday from 8:00 AM to 6:00 PM.',
  },
  {
    id: 'services',
    label: 'Farm Setup & Management',
    question: 'What farm management and setup services do you provide?',
    answer: 'We offer complete end-to-end farm management and setup services for landowners—including fish pond construction (earthen & tarpaulin), pen construction, feeding routines, sanitation compliance, and stock records.',
    actionUrl: '/#stock',
    actionText: 'View Our Services',
  },
  {
    id: 'contact',
    label: 'Contact Support',
    question: 'How can I reach EEFarm360 Customer Care directly?',
    answer: 'You can reach customer support via call (07061444050 or 09077640697), email (eefarmandranch@gmail.com), or chat directly on WhatsApp.',
    actionUrl: 'https://wa.me/2347061444050',
    actionText: 'Chat on WhatsApp',
  },
];

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! 👋 Welcome to EEFarm360 Assistant. How can I help you today? Select a quick question below or type your inquiry:',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSelectQuestion = (qq: QuickQuestion) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // User message
    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: qq.question,
      timestamp: time,
    };

    // Bot response
    const botMsg: Message = {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      text: qq.answer,
      actionUrl: qq.actionUrl,
      actionText: qq.actionText,
      timestamp: time,
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: time,
    };

    // Keyword matching logic
    let answerText = 'Thank you for contacting EEFarm360! For immediate assistance regarding sales, orders, or general inquiries, please call our desk at 07061444050 or 09077640697.';
    let actionUrl: string | undefined;
    let actionText: string | undefined;

    const qLower = query.toLowerCase();
    if (qLower.includes('siwes') || qLower.includes('nysc') || qLower.includes('intern') || qLower.includes('apply')) {
      answerText = 'You can apply for SIWES, Internship, or NYSC directly on our online application portal!';
      actionUrl = '/apply';
      actionText = 'Open Application Portal';
    } else if (qLower.includes('water') || qLower.includes('yateem')) {
      answerText = 'Yateem Table Water is treated and bottled on-site in Sharifai. Contact 07061444050 for wholesale pricing and delivery!';
      actionUrl = 'tel:07061444050';
      actionText = 'Call Sales Desk';
    } else if (qLower.includes('fish') || qLower.includes('chicken') || qLower.includes('buy') || qLower.includes('price') || qLower.includes('catfish')) {
      answerText = 'We supply table catfish, fingerlings, dressed chickens, eggs, and livestock. Call 07061444050 or 09077640697 to place an order!';
      actionUrl = 'tel:07061444050';
      actionText = 'Call Sales Desk';
    } else if (qLower.includes('where') || qLower.includes('location') || qLower.includes('address')) {
      answerText = 'EEFarm360 is located at Madobi Road, Sharifai Community, Dutse, Jigawa State, Nigeria.';
    }

    const botMsg: Message = {
      id: 'bot-' + Date.now(),
      sender: 'bot',
      text: answerText,
      actionUrl,
      actionText,
      timestamp: time,
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-full p-4 shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 group border border-emerald-700/50"
          aria-label="Open EEFarm360 Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-emerald-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-emerald-900 rounded-full animate-pulse" />
          </div>
          <span className="font-bold text-xs pr-1 hidden sm:inline-block">EEFarm360 Assistant</span>
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-white border border-emerald-600">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  EEFarm360 Assistant
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                </h3>
                <p className="text-[11px] text-emerald-300/80">Online · Instant Answers</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900/60 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 dark:bg-slate-950/40 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-1 ${
                    msg.sender === 'user'
                      ? 'bg-slate-800 text-white'
                      : 'bg-emerald-800 text-emerald-200'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-slate-800 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-sm rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Action Button inside message */}
                    {msg.actionUrl && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                        {msg.actionUrl.startsWith('http') || msg.actionUrl.startsWith('tel:') ? (
                          <a
                            href={msg.actionUrl}
                            target={msg.actionUrl.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                          >
                            {msg.actionText || 'Click here'} <ArrowRight className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            href={msg.actionUrl}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                          >
                            {msg.actionText || 'Click here'} <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1 px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Quick Questions Section */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Suggested Questions:
              </p>
              <div className="flex flex-col gap-1.5">
                {QUICK_QUESTIONS.map(qq => (
                  <button
                    key={qq.id}
                    onClick={() => handleSelectQuestion(qq)}
                    className="text-left px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all hover:border-emerald-500/50 shadow-2xs text-[11px]"
                  >
                    {qq.label}
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Custom Input Form */}
          <form onSubmit={handleSendCustom} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-800 dark:text-slate-100"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputText.trim()}
              className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl h-8 w-8 p-0 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
