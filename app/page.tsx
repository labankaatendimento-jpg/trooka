'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck, Zap, Star, Recycle, Handshake, Info, Shield, Headphones, CircleDollarSign, Menu, X, ChevronRight } from 'lucide-react';
import { IphoneModel } from '@/lib/mockData';
import { EstimateResult } from '@/utils/calculateEstimate';
import SimulatorChat from '@/components/chat/SimulatorChat';
import LocationOfferSheet from '@/components/chat/LocationOfferSheet';

export default function Home() {
  const [simulationState, setSimulationState] = useState<{
    flowType: 'sell' | 'upgrade' | null;
    currentModel: IphoneModel | null;
    desiredModel: IphoneModel | null;
    condition: 'excelente' | 'bom' | 'marcas' | 'tela_quebrada' | null;
    batteryCondition: '90-100' | '80-89' | 'below-80' | null;
    hasRepaired: 'sim' | 'nao' | 'nao_sei' | null;
    desiredCondition: 'novo' | 'seminovo' | null;
    estimate: EstimateResult | null;
    step: number;
  }>({
    flowType: null,
    currentModel: null,
    desiredModel: null,
    desiredCondition: null,
    condition: null,
    batteryCondition: null,
    hasRepaired: null,
    estimate: null,
    step: 0
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (simulationState.step >= 8 && window.innerWidth < 1024) {
      setTimeout(() => {
        cardContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 500);
    }
  }, [simulationState.step]);

  useEffect(() => {
    // Force scroll to top on page load to ensure logo is visible
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleStateChange = React.useCallback((state: typeof simulationState) => {
    setSimulationState(state);
  }, []);

  const handleOpenLocationSheet = () => {
    setIsLocationSheetOpen(true);
  };

  // Safe fallback values matching reference image if not calculated yet
  const displayValue = simulationState.estimate?.valorEstimado 
    ? `R$ ${simulationState.estimate.valorEstimado.toLocaleString('pt-BR')}`
    : 'R$ 2.450';

  const displayModel = simulationState.desiredModel
    ? `${simulationState.desiredModel.modelo} ${simulationState.desiredModel.armazenamento || '256GB'}`
    : 'iPhone 17 Pro Max 256GB';

  return (
    <div className="w-full flex-1 flex flex-col relative select-none">
      
      {/* Figma Reference Background - Escurecido para ficar sutil */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex justify-center">
        <div className="relative w-full max-w-[1920px] h-full">
          {/* Desktop Background */}
          <Image
            src="/images/pretoeroxodesk.PNG"
            alt="Fundo Trooka Desktop"
            fill
            className="hidden lg:block object-cover object-center"
            priority
            quality={100}
          />

          {/* Mobile Background */}
          <Image
            src="/images/pretoeroxo.png"
            alt="Fundo Trooka Mobile"
            fill
            className="block lg:hidden object-cover object-right-top"
            priority
            quality={100}
          />
          {/* Overlay Mobile: Sombra extra + blur */}
          <div className="block lg:hidden absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Overlay Desktop: Gradiente com sombra e blur fosco */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#050505] via-black/80 to-transparent backdrop-blur-sm pointer-events-none" />
        </div>
      </div>

      {/* HEADER */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[1.35rem] font-bold tracking-[0.05em] text-white flex items-baseline md:items-end leading-none whitespace-nowrap">
            <svg viewBox="0 0 24 24" className="w-9 h-9 md:w-8 md:h-8 shrink-0 -mr-1 translate-y-[5px] md:translate-y-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="t-gradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#7e22ce" />
                </linearGradient>
                <linearGradient id="t-highlight" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#fdf4ff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-gradient)" />
              <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-highlight)" />
            </svg>
            ROOKA
          </span>
        </div>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2.5 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* SIDE DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* OVERLAY */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* DRAWER CONTENT */}
          <div className="relative w-[300px] h-full bg-neutral-950 border-l border-neutral-800 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold tracking-[0.05em] text-white flex items-baseline leading-none whitespace-nowrap">
                <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 -mr-0.5 translate-y-[2px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="t-gradient-drawer" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#7e22ce" />
                    </linearGradient>
                    <linearGradient id="t-highlight-drawer" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#fdf4ff" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-gradient-drawer)" />
                  <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-highlight-drawer)" />
                </svg>
                ROOKA
              </span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Sections */}
            <div className="flex-1 overflow-y-auto space-y-8">
              {/* Consumidor */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Para o Consumidor</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/como-funciona" className="flex items-center justify-between py-2 text-sm text-neutral-300 hover:text-white transition-colors cursor-pointer">
                      Como funciona
                      <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="flex items-center justify-between py-2 text-sm text-neutral-300 hover:text-white transition-colors cursor-pointer">
                      Dúvidas frequentes (FAQ)
                      <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Lojistas */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Para Lojista / Parceiros</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/lojista/login" className="flex items-center justify-between py-2 text-sm text-neutral-300 hover:text-white transition-colors cursor-pointer">
                      Área do lojista / Entrar
                      <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/lojista/cadastro" className="flex items-center justify-between py-2 text-sm text-neutral-300 hover:text-white transition-colors cursor-pointer">
                      Cadastrar sua loja
                      <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Suporte */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Suporte & Contato</h3>
                <ul className="space-y-1">
                  <li>
                    <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-2 text-sm text-neutral-300 hover:text-white transition-colors cursor-pointer">
                      Falar no Whatsapp
                      <ChevronRight className="w-4 h-4 text-neutral-600" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 lg:px-6 pt-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 w-full items-stretch">

        {/* LEFT COLUMN: Conversational Simulator */}
        <div className="lg:col-span-6 flex flex-col justify-start h-full w-full">
          {/* Badge & Headlines */}
          <div className="mb-6 space-y-4 pt-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] transition-all duration-500">
              {simulationState.flowType === 'sell' ? (
                <>
                  <span className="block sm:hidden">
                    Descubra quanto <br />
                    vale seu <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">iPhone.</span>
                  </span>
                  <span className="hidden sm:block">
                    Descubra quanto vale <br />
                    seu <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">iPhone.</span>
                  </span>
                </>
              ) : simulationState.flowType === 'upgrade' ? (
                <>
                  <span className="block sm:hidden">
                    Descubra quanto <br />
                    vale seu <span className="bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">Upgrade.</span>
                  </span>
                  <span className="hidden sm:block">
                    Descubra quanto vale <br />
                    seu <span className="bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">Upgrade.</span>
                  </span>
                </>
              ) : (
                <>
                  {/* Mobile version */}
                  <span className="block sm:hidden">
                    Descubra o valor <br />
                    do seu <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">iPhone</span> <br />
                    ou <span className="bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">Upgrade.</span>
                  </span>
                  {/* Desktop version */}
                  <span className="hidden sm:block text-balance">
                    Descubra o valor do seu{' '}
                    <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">iPhone</span> ou <span className="bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">Upgrade.</span>
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-sm sm:text-lg text-neutral-400 max-w-md font-medium leading-relaxed">
              {simulationState.flowType === 'sell' ? (
                <>
                  Nossa IA calcula uma estimativa de preço<br />
                  rápida e realista para o seu aparelho.
                </>
              ) : simulationState.flowType === 'upgrade' ? (
                <>
                  Nossa IA calcula uma estimativa de preço<br />
                  rápida e realista para o seu Upgrade.
                </>
              ) : (
                <>
                  Nossa IA calcula uma estimativa de preço rápida<br />
                  e realista para o seu aparelho ou Upgrade.
                </>
              )}
            </p>

            {/* Social Proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
                ].map((src, i) => (
                  <div key={i} className="relative w-7 h-7 rounded-full border-2 border-black overflow-hidden bg-neutral-900">
                    <img src={src} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-medium leading-tight">
                <span className="text-white font-semibold">+250 mil simulações realizadas</span><br />
                com segurança e precisão
              </p>
            </div>
          </div>

          {/* Conversational Simulator Flow */}
          <div className="w-full flex flex-col">
            <SimulatorChat
              onStateChange={handleStateChange}
              onOpenLocationSheet={handleOpenLocationSheet}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Realistic Background and Estimate Card */}
        <div ref={cardContainerRef} className="lg:col-span-6 flex flex-col items-end lg:items-center relative w-full h-full z-40 pointer-events-none">
          
          {/* No background - pure floating card */}

          {/* Dynamic Estimation card floating on top (desktop) or at the end (mobile) */}
          <div 
            className={`z-10 w-full max-w-sm glass-card border-purple-500/20 rounded-2xl lg:rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto transition-all ${
              simulationState.step >= 8 
                ? 'block self-center mt-6 mb-8 lg:mt-auto lg:sticky lg:top-auto lg:bottom-16 lg:mb-0' 
                : 'hidden lg:block lg:sticky lg:mt-0 lg:top-32 mt-auto'
            }`}
          >
            
            {/* Card Badge */}
            <div className="flex items-center gap-1.5 text-purple-500 text-[10px] font-bold uppercase tracking-wider mb-3 sm:mb-4">
              <span className="text-sm sm:text-base leading-none -mt-0.5">✦</span> <span>SUA ESTIMATIVA</span>
            </div>

            {/* Estimation values */}
            <div className="space-y-5">
              
              {/* MAIN HIGHLIGHT: DIFFERENCE */}
              {simulationState.flowType !== 'sell' && (
                <div className="flex flex-col">
                  <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">Seu upgrade a partir de</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl lg:text-[3.5rem] font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-purple-300 bg-clip-text text-transparent leading-none py-1 drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                      {simulationState.estimate?.diferencaMin 
                        ? `R$ ${simulationState.estimate.diferencaMin.toLocaleString('pt-BR')}`
                        : 'R$ 3.540'}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="inline-flex items-center gap-1.5 bg-neutral-900/80 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs font-medium text-purple-200">
                      <ArrowRight className="w-3 h-3 text-purple-400" /> Na troca pelo {displayModel}
                    </div>
                  </div>
                </div>
              )}

              {/* MAIN HIGHLIGHT: SELL VALUE */}
              {simulationState.flowType === 'sell' && (
                <div className="flex flex-col">
                  <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">Seu aparelho vale até</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl lg:text-[3.5rem] font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-purple-300 bg-clip-text text-transparent leading-none py-1 drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                      {displayValue}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="inline-flex items-center gap-1.5 bg-neutral-900/80 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs font-medium text-purple-200">
                      <CircleDollarSign className="w-3 h-3 text-purple-400" /> Valor estimado
                    </div>
                  </div>
                </div>
              )}

              {/* SECONDARY INFO: DEVICE VALUE */}
              {simulationState.flowType !== 'sell' && (
                <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-2xl p-4 flex flex-col gap-3 backdrop-blur-md shadow-inner">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <CircleDollarSign className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <span className="text-[13px] text-neutral-300 font-medium">Seu usado vale até</span>
                    </div>
                    <span className="text-base text-purple-400 font-bold sm:text-right">
                      {displayValue}
                    </span>
                  </div>

                  <div className="h-[1px] w-full bg-neutral-800/50" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-neutral-500 font-medium">Valor médio do novo</span>
                    <span className="text-[12px] text-neutral-400 font-medium">
                      R$ {simulationState.estimate?.precoDesejado?.toLocaleString('pt-BR') || '5.990'}
                    </span>
                  </div>
                </div>
              )}

              <hr className="border-neutral-900 my-2 sm:my-4" />

              {/* Information pill */}
              <div className="flex items-center gap-2.5 bg-neutral-950/80 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-neutral-900">
                <Info className="w-4 h-4 text-neutral-300 shrink-0" />
                <p className="text-[11px] text-neutral-300 leading-normal">
                  O valor poderá variar após avaliação presencial da loja.
                </p>
              </div>

              {/* Main Upgrade Button */}
              <button
                onClick={handleOpenLocationSheet}
                className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-300 text-white font-semibold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all group text-sm sm:text-base"
              >
                <span>Ofertas imperdíveis</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
        </div>
      </main>

      {/* FOOTER FEATURES */}
      <footer className="relative z-10 w-full border-t border-neutral-900/60 mt-auto bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          {/* Features grid */}
          <div className="overflow-hidden mb-8 lg:overflow-visible [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] lg:[mask-image:none]">
            
            {/* Mobile Marquee */}
            <div className="flex lg:hidden w-full overflow-hidden group">
              <div className="flex gap-8 pr-8 animate-marquee shrink-0 will-change-transform transform-gpu group-hover:[animation-play-state:paused]">
                {[
                  { icon: ShieldCheck, title: 'Sua segurança é', desc: 'nossa prioridade' },
                  { icon: Lock, title: 'Seus dados protegidos', desc: 'e nunca compartilhados' },
                  { icon: Zap, title: 'Simulação rápida', desc: 'e sem compromisso' },
                  { icon: Star, title: 'Ofertas exclusivas', desc: 'de lojas verificadas' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(255,94,0,0.05)] shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold leading-tight text-neutral-300">
                        {item.title} <br />
                        <span className="text-neutral-500 font-normal">{item.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-8 pr-8 animate-marquee shrink-0 will-change-transform transform-gpu group-hover:[animation-play-state:paused]" aria-hidden="true">
                {[
                  { icon: ShieldCheck, title: 'Sua segurança é', desc: 'nossa prioridade' },
                  { icon: Lock, title: 'Seus dados protegidos', desc: 'e nunca compartilhados' },
                  { icon: Zap, title: 'Simulação rápida', desc: 'e sem compromisso' },
                  { icon: Star, title: 'Ofertas exclusivas', desc: 'de lojas verificadas' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(255,94,0,0.05)] shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-semibold leading-tight text-neutral-300">
                        {item.title} <br />
                        <span className="text-neutral-500 font-normal">{item.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-6 w-full">
              {[
                { icon: ShieldCheck, title: 'Sua segurança é', desc: 'nossa prioridade' },
                { icon: Lock, title: 'Seus dados protegidos', desc: 'e nunca compartilhados' },
                { icon: Zap, title: 'Simulação rápida', desc: 'e sem compromisso' },
                { icon: Star, title: 'Ofertas exclusivas', desc: 'de lojas verificadas' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(255,94,0,0.05)] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold leading-tight text-neutral-300">
                      {item.title} <br />
                      <span className="text-neutral-500 font-normal">{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-neutral-900/60 mb-10" />

          {/* Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-900 hover:bg-neutral-900 transition-colors group flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(255,94,0,0.05)] mb-1">
                <Recycle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors">Como funciona</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Descubra o passo a passo de como avaliamos seu aparelho usado e passamos uma estimativa para você ter uma base de preços, com total transparência e rapidez.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-900 hover:bg-neutral-900 transition-colors group flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(255,94,0,0.05)] mb-1">
                <Handshake className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors">Para lojistas</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Faça parte da nossa rede de parceiros verificados. Receba leads qualificados e ofertas exclusivas de aparelhos diretamente na sua região.
              </p>
            </div>
          </div>

          {/* Minimal Footer Links */}
          <div className="pt-8 border-t border-neutral-950 text-xs text-neutral-500 w-full">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12 w-full">
              <p className="shrink-0 opacity-60">© {new Date().getFullYear()} Trooka. Todos os direitos reservados.</p>
              <div className="flex flex-row items-center justify-center gap-6 shrink-0 w-full lg:w-auto">
                {[
                  { label: 'Privacidade', path: '/privacidade' },
                  { label: 'Termos', path: '/termos' },
                  { label: 'Contato', path: 'https://wa.me/5511999999999' }
                ].map(link => (
                  link.path.startsWith('http') ? (
                    <a key={link.label} href={link.path} target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors whitespace-nowrap">
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.label} href={link.path} className="hover:text-neutral-300 transition-colors whitespace-nowrap">
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Location Bottom Sheet Triggered by estimate button */}
      <LocationOfferSheet
        isOpen={isLocationSheetOpen}
        onClose={() => setIsLocationSheetOpen(false)}
        currentModel={simulationState.currentModel}
        desiredModel={simulationState.desiredModel}
        condition={simulationState.condition}
        reparo={simulationState.hasRepaired}
        estimate={simulationState.estimate}
      />

    </div>
  );
}
