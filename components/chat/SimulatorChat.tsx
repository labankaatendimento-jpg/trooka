'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, ArrowRight, CornerDownLeft, Smile, Meh, Frown } from 'lucide-react';
import { IphoneModel, MOCK_IPHONE_MODELS } from '@/lib/mockData';
import { calculateUpgradeEstimate, EstimateResult } from '@/utils/calculateEstimate';
import { dbService } from '@/services/dbService';
import { PriceRule } from '@/lib/mockData';
import DeviceSearchSheet from './DeviceSearchSheet';

interface SimulatorChatProps {
  onStateChange: (state: {
    flowType: 'sell' | 'upgrade' | null;
    currentModel: IphoneModel | null;
    desiredModel: IphoneModel | null;
    condition: 'excelente' | 'bom' | 'marcas' | 'tela_quebrada' | null;
    batteryCondition: '90-100' | '80-89' | 'below-80' | null;
    hasRepaired: 'sim' | 'nao' | 'nao_sei' | null;
    desiredCondition: 'novo' | 'seminovo' | null;
    estimate: EstimateResult | null;
    step: number;
  }) => void;
  onOpenLocationSheet: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ia' | 'user';
  text?: string;
  type?: 'text' | 'options-intent' | 'options-current' | 'options-models' | 'options-desired-condition' | 'options-condition' | 'options-battery' | 'options-repair' | 'loading';
  timestamp: string;
}

export default function SimulatorChat({ onStateChange, onOpenLocationSheet }: SimulatorChatProps) {
  const [flowType, setFlowType] = useState<'sell' | 'upgrade' | null>(null);
  const [currentModel, setCurrentModel] = useState<IphoneModel | null>(null);
  const [desiredModel, setDesiredModel] = useState<IphoneModel | null>(null);
  const [condition, setCondition] = useState<'excelente' | 'bom' | 'marcas' | 'tela_quebrada' | null>(null);
  const [batteryCondition, setBatteryCondition] = useState<'90-100' | '80-89' | 'below-80' | null>(null);
  const [hasRepaired, setHasRepaired] = useState<'sim' | 'nao' | 'nao_sei' | null>(null);
  const [desiredCondition, setDesiredCondition] = useState<'novo' | 'seminovo' | null>(null);
  const [step, setStep] = useState(0); // 0: intent, 1: current, 2: desired, 3: desired-condition, 4: condition, 5: battery, 6: repair, 7: loading, 8: done
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTarget, setSearchTarget] = useState<'current' | 'desired'>('current');
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [allModels, setAllModels] = useState<IphoneModel[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dbService.getPriceRules().then(data => setRules(data)).catch(console.error);
    dbService.getIphoneModels().then(data => setAllModels(data)).catch(console.error);
  }, []);

  // Trigger parent state update on changes
  useEffect(() => {
    const estimate = currentModel ? calculateUpgradeEstimate(currentModel, desiredModel, condition, hasRepaired, batteryCondition, desiredCondition, rules) : null;
    onStateChange({ flowType, currentModel, desiredModel, condition, batteryCondition, hasRepaired, desiredCondition, estimate, step });
  }, [flowType, currentModel, desiredModel, condition, batteryCondition, hasRepaired, desiredCondition, step, onStateChange, rules]);

  // Handle chat messages progression based on steps
  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (step === 0 && messages.length === 0) {
      // Step 0: Init IA greeting
      setMessages([
        {
          id: 'welcome',
          sender: 'ia',
          text: 'Olá! 👋 Sou a IA da Trooka. O que você gostaria de descobrir hoje?',
          type: 'options-intent',
          timestamp: formatTime(),
        },
      ]);
    }
  }, [step, messages.length]);

  const selectIntent = (intent: 'sell' | 'upgrade') => {
    setFlowType(intent);
    
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: `user-intent-${intent}`,
        sender: 'user',
        text: intent === 'sell' ? 'O valor do meu iPhone' : 'Quanto custa meu upgrade',
        timestamp: userTime,
      },
    ]);

    setStep(1);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'ask-current',
          sender: 'ia',
          text: 'Entendido! Primeiro, me conte qual iPhone você usa hoje?',
          type: 'options-current',
          timestamp: nextTime,
        },
      ]);
    }, 600);
  };

  // Scroll to bottom smoothly when a new message arrives, keeping it nicely in view
  useEffect(() => {
    if (messages.length > 1) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  }, [messages.length]);

  const selectCurrentModel = (model: IphoneModel) => {
    setCurrentModel(model);
    setIsSearchOpen(false);

    // Add user response bubble
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: `user-current-${model.id}`,
        sender: 'user',
        text: `${model.modelo} ${model.armazenamento}`,
        timestamp: userTime,
      },
    ]);

    // Delay next AI message
    setStep(flowType === 'upgrade' ? 2 : 4);
    setTimeout(() => {
      if (flowType === 'upgrade') {
        setMessages(prev => [
          ...prev,
          {
            id: 'ask-desired',
            sender: 'ia',
            text: 'Ótimo! E qual modelo você deseja pegar?',
            type: 'options-models',
            timestamp: nextTime,
          },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: 'ask-condition',
            sender: 'ia',
            text: 'Perfeito! Como está o estado do seu aparelho?',
            type: 'options-condition',
            timestamp: nextTime,
          },
        ]);
      }
    }, 600);
  };

  const selectDesiredModel = (model: IphoneModel) => {
    setDesiredModel(model);
    setIsSearchOpen(false);

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: `user-desired-${model.id}`,
        sender: 'user',
        text: `${model.modelo} ${model.armazenamento || '256GB'}`,
        timestamp: userTime,
      },
    ]);

    const valNovo = Number(model.preco_medio_novo) || 0;
    const valUsado = Number(model.preco_medio_usado) || 0;

    if (valNovo > 0 && valUsado > 0) {
      setStep(3);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'ask-desired-condition',
            sender: 'ia',
            text: 'Você prefere pegar um aparelho Novo (lacrado) ou Seminovo?',
            type: 'options-desired-condition',
            timestamp: nextTime,
          },
        ]);
      }, 600);
    } else {
      const selectedCond = (valUsado > 0 && valNovo === 0) ? 'seminovo' : 'novo';
      setDesiredCondition(selectedCond);
      setStep(4);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'ask-condition',
            sender: 'ia',
            text: `Como este modelo só possui a opção ${selectedCond === 'novo' ? 'Novo (lacrado)' : 'Seminovo'}, já selecionei para você. Perfeito! E como está o estado do seu aparelho atual?`,
            type: 'options-condition',
            timestamp: nextTime,
          },
        ]);
      }, 600);
    }
  };

  const selectDesiredCondition = (selectedCond: 'novo' | 'seminovo') => {
    setDesiredCondition(selectedCond);
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: `user-desired-cond-${selectedCond}`,
        sender: 'user',
        text: selectedCond === 'novo' ? 'Aparelho Novo' : 'Aparelho Seminovo',
        timestamp: userTime,
      },
    ]);

    setStep(4);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'ask-condition',
          sender: 'ia',
          text: 'Perfeito! E como está o estado do seu aparelho atual?',
          type: 'options-condition',
          timestamp: nextTime,
        },
      ]);
    }, 600);
  };

  const selectCondition = (selectedCond: 'excelente' | 'bom' | 'marcas' | 'tela_quebrada') => {
    setCondition(selectedCond);

    const condLabels = {
      excelente: 'Excelente',
      bom: 'Bom',
      marcas: 'Marcas visíveis',
      tela_quebrada: 'Tela quebrada ou defeitos',
    };

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: `user-cond-${selectedCond}`,
        sender: 'user',
        text: condLabels[selectedCond],
        timestamp: userTime,
      },
    ]);

    setStep(5);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'ask-battery',
          sender: 'ia',
          text: 'Como está a saúde da bateria dele?',
          type: 'options-battery',
          timestamp: nextTime,
        },
      ]);
    }, 600);
  };

  const selectBattery = (bat: '90-100' | '80-89' | 'below-80') => {
    setBatteryCondition(bat);
    const batLabels = {
      '90-100': '90 - 100%',
      '80-89': '80 - 89%',
      'below-80': 'Abaixo de 80%',
    };
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: `user-bat-${bat}`,
        sender: 'user',
        text: batLabels[bat],
        timestamp: userTime,
      },
    ]);

    setStep(6);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'ask-repair',
          sender: 'ia',
          text: 'Só mais uma pergunta. Seu aparelho já passou por manutenção?',
          type: 'options-repair',
          timestamp: nextTime,
        },
      ]);
    }, 600);
  };

  const selectRepair = (repairOption: 'sim' | 'nao' | 'nao_sei') => {
    setHasRepaired(repairOption);

    const repairLabels = {
      sim: 'Sim, já passou por reparo',
      nao: 'Não, nunca foi aberto',
      nao_sei: 'Não sei informar',
    };

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: `user-repair-${repairOption}`,
        sender: 'user',
        text: repairLabels[repairOption],
        timestamp: userTime,
      },
    ]);

    setStep(7);
    // Add pulsing loading state message
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'loading-calc',
          sender: 'ia',
          type: 'loading',
          timestamp: nextTime,
        },
      ]);
    }, 600);

    // After 2 seconds load actual estimation card
    setTimeout(() => {
      setStep(8);
      setMessages(prev => {
        // Remove loading state message
        const cleaned = prev.filter(m => m.id !== 'loading-calc');
        return [
          ...cleaned,
          {
            id: 'estimation-done',
            sender: 'ia',
            text: 'Prontinho! Sua estimativa de troca foi calculada com sucesso.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      });
    }, 2600);
  };

  const resetChat = () => {
    setFlowType(null);
    setCurrentModel(null);
    setDesiredModel(null);
    setCondition(null);
    setHasRepaired(null);
    setStep(0);
    setMessages([]);
    localStorage.removeItem('trooka_chat_state');
  };

  const handleOpenSearch = (target: 'current' | 'desired') => {
    setSearchTarget(target);
    setIsSearchOpen(true);
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 w-full max-w-2xl mx-auto pt-8 pb-0 relative">
      {/* Background ambient light effects */}
      {step > 0 && (
        <button
          onClick={resetChat}
          className="absolute top-2 right-4 text-[11px] font-medium text-white/90 bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-neutral-800 hover:text-white transition-all z-10 shadow-sm flex items-center gap-1.5"
        >
          <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reiniciar
        </button>
      )}

      {/* Vertical Timeline container */}
      <div className="relative flex flex-col gap-8 flex-1 min-w-0 self-stretch pl-12 lg:pl-16 pt-4 pb-0">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isIA = message.sender === 'ia';
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative flex flex-col gap-2 min-w-0"
              >
                {/* Timeline connection line to next message */}
                {index < messages.length - 1 && (
                  <div className="absolute left-[-24px] lg:left-[-32px] top-[22px] bottom-[-32px] w-[1px] bg-purple-900/50 z-0" />
                )}

                {/* Timeline circle icon */}
                {isIA && (
                  <div className="absolute left-[-42px] lg:left-[-50px] top-1 w-9 h-9 rounded-full bg-neutral-950 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 drop-shadow-[0_2px_4px_rgba(168,85,247,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill={`url(#t-gradient-chat-${message.id})`} />
                      <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill={`url(#t-highlight-chat-${message.id})`} />
                      <defs>
                        <linearGradient id={`t-gradient-chat-${message.id}`} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#d946ef" />
                          <stop offset="100%" stopColor="#7e22ce" />
                        </linearGradient>
                        <linearGradient id={`t-highlight-chat-${message.id}`} x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.5"/>
                          <stop offset="100%" stopColor="#fdf4ff" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                {/* Message Bubble */}
                {message.type !== 'loading' ? (
                  <div
                    className={`w-fit max-w-full lg:max-w-[85%] break-words rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed ${
                      isIA
                        ? 'bg-neutral-900/60 text-neutral-100 self-start border border-neutral-850'
                        : 'bg-neutral-850/80 text-white self-end border border-neutral-800'
                    }`}
                  >
                    {message.text}
                    
                    {/* Timestamp */}
                    <div className="text-[10px] text-neutral-500 mt-2 flex items-center justify-end gap-1">
                      {message.timestamp}
                      {!isIA && <Check className="w-3 h-3 text-purple-500" />}
                    </div>
                  </div>
                ) : (
                  /* Loading typing indicator bubble */
                  <div className="bg-neutral-900/60 text-neutral-100 self-start border border-neutral-850 rounded-3xl px-5 py-3.5 flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-medium">Analisando as informações...</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}

                {/* Interactive Cards/Options below IA messages */}
                {isIA && message.type === 'options-intent' && step === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 mt-3 w-full sm:max-w-xs"
                  >
                    {[
                      { key: 'sell', label: 'Descobrir o valor do meu iPhone' },
                      { key: 'upgrade', label: 'Quanto custa meu upgrade' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => selectIntent(opt.key as any)}
                        className="w-full text-center glass-card !border-purple-500/30 hover:glass-card-selected px-5 py-3.5 rounded-2xl text-[14px] font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {isIA && message.type === 'options-current' && step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 w-full"
                  >
                    <button
                      onClick={() => handleOpenSearch('current')}
                      className="glass-card hover:glass-card-selected rounded-2xl w-full sm:max-w-sm px-5 py-4 text-left flex items-center justify-between text-neutral-300 hover:text-white transition-all cursor-pointer"
                    >
                      <span>Selecione o iPhone que você usa hoje...</span>
                      <span className="px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/40 text-purple-400 text-[10px] font-bold uppercase tracking-wider transition-colors drop-shadow-[0_0_8px_rgba(192,38,211,0.3)]">
                        Selecionar
                      </span>
                    </button>
                  </motion.div>
                )}

                {isIA && message.type === 'options-models' && step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 w-full"
                  >
                    {[
                      { name: 'iPhone 17 Pro Max', id: '17-pro-max-256', color: 'from-purple-900/40 to-neutral-950/80', image: '/images/17PM.png', scale: 'scale-105', desc: '256GB' },
                      { name: 'iPhone 17 Pro', id: '17-pro-256', color: 'from-fuchsia-900/20 to-neutral-950/80', image: '/images/17P.png', scale: 'scale-150', desc: '256GB' },
                      { name: 'iPhone 17 Air', id: '17-air-256', color: 'from-purple-900/20 to-neutral-950/80', image: '/images/17air.png', scale: 'scale-[1.45]', desc: '256GB' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          const modelName = opt.name;
                          let model = allModels.find(m => m.modelo === modelName && m.armazenamento === '256GB');
                          if (!model) {
                            model = allModels.find(m => m.modelo === modelName);
                          }
                          if (!model) {
                            model = allModels.find(m => m.id === opt.id);
                          }
                          
                          if (model) selectDesiredModel(model);
                        }}
                        className="glass-card hover:glass-card-selected rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 relative group flex flex-col justify-between min-h-[140px]"
                      >
                        {/* Realistic metallic backdrop */}
                        <div className={`absolute inset-0 bg-gradient-to-b ${opt.color} rounded-2xl opacity-40 z-0 pointer-events-none`} />
                        
                        {opt.image ? (
                          <div className="w-20 h-20 mx-auto mt-2 mb-3 flex items-center justify-center z-10 flex-1">
                            <img src={opt.image} alt={opt.name} className={`w-full h-full object-contain drop-shadow-xl ${opt.scale || 'scale-100'}`} />
                          </div>
                        ) : (
                          <>
                            {/* Graphic representations of back cameras */}
                            <div className="w-10 h-10 mx-auto mt-4 mb-5 flex items-center justify-center z-10 flex-1">
                              <div className="relative w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 p-1 grid grid-cols-2 gap-0.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700"></div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="text-[13px] font-semibold text-neutral-200 group-hover:text-white z-10 leading-tight mb-1 mt-auto">
                          {opt.name} {opt.desc && <span className="font-normal">{opt.desc}</span>}
                        </div>
                      </button>
                    ))}

                    <button
                      onClick={() => handleOpenSearch('desired')}
                      className="glass-card hover:glass-card-selected border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[140px] group"
                    >
                      <div className="w-8 h-8 rounded-full border border-neutral-700 group-hover:border-purple-500/50 flex items-center justify-center text-neutral-400 group-hover:text-purple-500 transition-colors">
                        +
                      </div>
                      <div className="text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">
                        Outro modelo
                      </div>
                    </button>
                  </motion.div>
                )}

                {isIA && message.type === 'options-desired-condition' && step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 mt-3 w-full sm:max-w-xs"
                  >
                    {[
                      { key: 'novo', label: 'Novo (Lacrado)' },
                      { key: 'seminovo', label: 'Seminovo' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => selectDesiredCondition(opt.key as any)}
                        className="w-full text-center glass-card !border-purple-500/30 hover:glass-card-selected px-5 py-3.5 rounded-2xl text-[14px] font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {isIA && message.type === 'options-condition' && step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full"
                  >
                    {[
                      { key: 'excelente', title: 'Excelente', subtitle: 'Sem marcas aparentes', desc: 'Aparelho praticamente novo, sem riscos, amassados ou sinais de uso.', color: 'border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/5', iconColor: 'text-emerald-500', Icon: Smile },
                      { key: 'bom', title: 'Bom', subtitle: 'Marcas leves de uso', desc: 'Pequenos riscos ou sinais de uso, mas nada que chame atenção.', color: 'border-yellow-500/20 hover:border-yellow-500/50 bg-yellow-500/5', iconColor: 'text-yellow-500', Icon: Smile },
                      { key: 'marcas', title: 'Usado', subtitle: 'Marcas e riscos visíveis', desc: 'Riscos mais aparentes, pequenos amassados ou sinais de uso que podem ser vistos facilmente.', color: 'border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5', iconColor: 'text-amber-500', Icon: Meh },
                      { key: 'tela_quebrada', title: 'Danificado', subtitle: 'Tela quebrada ou problemas', desc: 'Tela trincada/quebrada, manchas, falhas, peças danificadas ou outros problemas.', color: 'border-rose-500/20 hover:border-rose-500/50 bg-rose-500/5', iconColor: 'text-rose-500', Icon: Frown },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => selectCondition(opt.key as any)}
                        className={`w-full min-w-0 glass-card !border-purple-500/30 hover:!border-purple-500/50 hover:glass-card-selected rounded-xl p-3 cursor-pointer transition-all duration-300 relative group flex flex-col items-center text-center gap-1.5`}
                      >
                        <div className="flex-1 flex flex-col items-center">
                          <opt.Icon className={`w-5 h-5 mb-1.5 ${opt.iconColor}`} />
                          <div className="text-[13px] font-semibold text-neutral-100 group-hover:text-white transition-colors">
                            {opt.title}
                          </div>
                          <div className="text-[12px] text-neutral-300 mt-0.5 font-medium">
                            {opt.subtitle}
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {isIA && message.type === 'options-battery' && step === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 mt-3 w-full sm:max-w-xs"
                  >
                    {[
                      { key: '90-100', label: '90 - 100%' },
                      { key: '80-89', label: '80 - 89%' },
                      { key: 'below-80', label: 'Abaixo de 80%' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => selectBattery(opt.key as any)}
                        className="w-full text-center glass-card !border-purple-500/30 hover:glass-card-selected px-5 py-3.5 rounded-2xl text-[14px] font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {isIA && message.type === 'options-repair' && step === 6 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 mt-3 w-full sm:max-w-xs"
                  >
                    {[
                      { key: 'nao', label: 'Não, nunca foi aberto' },
                      { key: 'sim', label: 'Sim, já passou por manutenção' },
                      { key: 'nao_sei', label: 'Não sei informar' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => selectRepair(opt.key as any)}
                        className="w-full text-center glass-card !border-purple-500/30 hover:glass-card-selected px-5 py-3.5 rounded-2xl text-[14px] font-medium text-neutral-200 hover:text-white transition-all cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* Spotlight Device Search Bottom Sheet */}
      <DeviceSearchSheet
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={searchTarget === 'current' ? selectCurrentModel : selectDesiredModel}
        excludeFutureModels={searchTarget === 'current'}
      />
    </div>
  );
}
