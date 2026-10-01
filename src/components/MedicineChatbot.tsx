import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  RefreshCw, 
  ShieldAlert,
  Bot,
  User,
  Info,
  RotateCcw,
  Zap,
  Coins,
  Utensils,
  Stethoscope,
  ChevronRight,
  Check
} from 'lucide-react';
import { Medicine, ChatMessage } from '../types';

interface MedicineChatbotProps {
  medicine: Medicine;
  onClose: () => void;
}

export type ChatRole = 'clinical' | 'substitutes' | 'lifestyle';
export type ModelSpeed = 'general' | 'fast';

export const MedicineChatbot: React.FC<MedicineChatbotProps> = ({
  medicine,
  onClose,
}) => {
  // Role & Model State
  const [selectedRole, setSelectedRole] = useState<ChatRole>('clinical');
  const [modelSpeed, setModelSpeed] = useState<ModelSpeed>('general');

  // Initial welcome message based on role
  const getWelcomeMessage = (role: ChatRole, med: Medicine): string => {
    if (role === 'substitutes') {
      return `Hello! I am your MediCheck Generic & Substitute Specialist for ${med.brand_name}. I can analyze bioequivalent generics, calculate price savings with Jan Aushadhi (PMBJP) alternatives, and verify CDSCO therapeutic equivalence.`;
    }
    if (role === 'lifestyle') {
      return `Hello! I am your MediCheck Food & Lifestyle Interaction Guide for ${med.brand_name}. Ask me about meal timing (with food vs empty stomach), alcohol interactions, storage conditions, or what to do if you miss a dose.`;
    }
    return `Hello! I am your MediCheck Chief Clinical Pharmacist for ${med.brand_name} (${med.strength}). Ask me about approved therapeutic indications, pharmacology mechanism of action, precautions, or potential side effects.`;
  };

  // Multi-turn conversation messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: getWelcomeMessage('clinical', medicine),
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeModelUsed, setActiveModelUsed] = useState<string>('gemini-3.5-flash');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to bottom of thread on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update welcome message when role changes (if only 1 welcome msg exists)
  const handleRoleChange = (newRole: ChatRole) => {
    setSelectedRole(newRole);
    if (messages.length <= 1) {
      setMessages([
        {
          id: `msg-welcome-${newRole}`,
          sender: 'assistant',
          text: getWelcomeMessage(newRole, medicine),
          timestamp: 'Just now',
        },
      ]);
    } else {
      // Append a system note about persona switch
      const roleName = newRole === 'substitutes' ? 'Generic & Substitute Specialist' : newRole === 'lifestyle' ? 'Food & Lifestyle Guide' : 'Clinical Pharmacist';
      setMessages((prev) => [
        ...prev,
        {
          id: `role-switch-${Date.now()}`,
          sender: 'assistant',
          text: `[Persona switched to ${roleName}] How can I assist you with ${medicine.brand_name}?`,
          timestamp: 'Just now',
        },
      ]);
    }
  };

  // Reset conversation
  const handleReset = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: getWelcomeMessage(selectedRole, medicine),
        timestamp: 'Just now',
      },
    ]);
  };

  // Suggested prompt chips based on role and active medicine
  const getPromptChips = (role: ChatRole) => {
    if (role === 'substitutes') {
      return [
        `What is the cheapest Jan Aushadhi substitute for ${medicine.brand_name}?`,
        'Are generic equivalents bioequivalent in bioavailability?',
        `How much can I save switching from ${medicine.brand_name}?`,
      ];
    }
    if (role === 'lifestyle') {
      return [
        'Should I take this with meals or on an empty stomach?',
        'Can I drink alcohol while on this medication?',
        'How should I store this in Indian summer temperatures?',
        'What should I do if I miss a scheduled dose?',
      ];
    }
    return [
      `What exact conditions is ${medicine.brand_name} prescribed for?`,
      'What are the most common documented side effects?',
      'How does the active chemical formulation work in the body?',
      'Are there any critical allergy warnings or contraindications?',
    ];
  };

  // Send message through multi-turn /api/chat
  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setLoading(true);

    try {
      // Format full history for multi-turn endpoint
      const historyPayload = updatedMessages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          medicine: medicine,
          role: selectedRole,
          modelPreference: modelSpeed,
        }),
      });

      const data = await response.json();
      if (data.model) setActiveModelUsed(data.model);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Consult your prescribing doctor for specific advice.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Chat request fallback:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: `For ${medicine.brand_name}, clinical documentation emphasizes taking this medication strictly according to your prescription. Food guidance: ${medicine.food_information || 'Take as advised by your physician'}. Please consult your physician for individualized adjustments.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-xl">
      <div className="relative flex flex-col h-[88vh] w-full max-w-2xl rounded-3xl tech-card shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden font-minimal border border-[#00e599]/25">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#00e599]/15 bg-black/60 px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00e599] text-black shadow-[0_0_15px_rgba(0,229,153,0.3)] shrink-0">
              <Bot className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  MediCheck Clinical Intelligence
                </h3>
                <span className="rounded bg-[#00e599]/20 px-1.5 py-0.2 text-[9px] font-mono-tag font-bold text-[#00e599] border border-[#00e599]/30">
                  MULTI-TURN
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono-tag truncate max-w-[240px] sm:max-w-md">
                Active Context: <strong className="text-white">{medicine.brand_name}</strong> ({medicine.strength})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset Conversation Thread"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Role & Persona Selector Bar */}
        <div className="border-b border-white/[0.08] bg-black/40 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 font-mono-tag">
            <span className="text-[10px] text-zinc-500 mr-1 uppercase">Role:</span>
            <button
              onClick={() => handleRoleChange('clinical')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedRole === 'clinical'
                  ? 'bg-[#00e599] text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <Stethoscope className="h-3 w-3" />
              <span>Pharmacist</span>
            </button>

            <button
              onClick={() => handleRoleChange('substitutes')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedRole === 'substitutes'
                  ? 'bg-[#00e599] text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <Coins className="h-3 w-3" />
              <span>Substitutes</span>
            </button>

            <button
              onClick={() => handleRoleChange('lifestyle')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedRole === 'lifestyle'
                  ? 'bg-[#00e599] text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <Utensils className="h-3 w-3" />
              <span>Food & Timing</span>
            </button>
          </div>

          {/* Model Speed Switcher */}
          <div className="flex items-center gap-1 font-mono-tag text-[10px]">
            <span className="text-zinc-500">Engine:</span>
            <div className="flex rounded-md border border-white/10 bg-white/[0.04] p-0.5">
              <button
                onClick={() => setModelSpeed('general')}
                className={`rounded px-1.5 py-0.5 ${
                  modelSpeed === 'general' ? 'bg-[#00e599]/20 text-[#00e599] font-bold' : 'text-zinc-400'
                }`}
                title="gemini-3.5-flash for clinical tasks"
              >
                Balanced
              </button>
              <button
                onClick={() => setModelSpeed('fast')}
                className={`rounded px-1.5 py-0.5 ${
                  modelSpeed === 'fast' ? 'bg-[#00e599]/20 text-[#00e599] font-bold' : 'text-zinc-400'
                }`}
                title="gemini-3.1-flash-lite for rapid replies"
              >
                Fast
              </button>
            </div>
          </div>
        </div>

        {/* Clinical Guardrail Indicator */}
        <div className="border-b border-[#00e599]/10 bg-[#00e599]/[0.03] px-4 py-1.5 text-[10px] text-zinc-300 flex items-center justify-between font-mono-tag">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3 shrink-0 text-[#00e599]" />
            <span>Strict CDSCO pharma guidelines active · Multi-turn thread preserved</span>
          </div>
          <span className="text-zinc-500 text-[9px] hidden sm:inline">
            Model: {activeModelUsed}
          </span>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-[#00e599] text-black font-bold shadow-[0_0_10px_rgba(0,229,153,0.3)]'
                    : 'bg-white/10 text-[#00e599] border border-white/10'
                }`}
              >
                {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              <div
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[85%] space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-[#00e599] text-black font-medium'
                    : 'border border-[#00e599]/20 bg-black/60 text-zinc-200 shadow-md'
                }`}
              >
                <div className="whitespace-pre-line text-[12px]">
                  {msg.text}
                </div>
                <div
                  className={`text-[9px] font-mono-tag text-right ${
                    msg.sender === 'user' ? 'text-black/60' : 'text-zinc-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-mono-tag pl-10">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#00e599]" />
              <span className="text-[#00e599] animate-pulse">
                Consulting clinical pharmacology records via {modelSpeed === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'}...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="border-t border-white/[0.06] bg-black/40 px-4 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[10px] text-zinc-500 font-mono-tag flex items-center gap-1 shrink-0 mr-1">
              <Sparkles className="h-3 w-3 text-[#00e599]" />
              Suggestions:
            </span>
            {getPromptChips(selectedRole).map((chip, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(chip)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-300 hover:border-[#00e599]/40 hover:text-white transition-all disabled:opacity-50 shrink-0 font-minimal"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-turn Chat Input Bar */}
        <div className="border-t border-[#00e599]/15 bg-black/70 p-3 sm:p-4">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              disabled={loading}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask a question about ${medicine.brand_name}... (Press Enter to send)`}
              className="w-full rounded-2xl border border-white/15 bg-white/[0.04] py-3 pl-4 pr-12 text-xs text-white placeholder-zinc-500 focus:border-[#00e599] focus:outline-none focus:ring-1 focus:ring-[#00e599] font-mono-tag"
            />

            <button
              disabled={!inputQuery.trim() || loading}
              onClick={() => handleSend()}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl tech-button-mint text-black disabled:opacity-30 disabled:hover:scale-100 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
