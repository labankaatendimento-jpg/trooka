'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Mail, Lock, User, Phone } from 'lucide-react';

export default function LojistaCadastro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // For now, simulate saving to the waitlist
      setIsWaitlisted(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex items-center justify-center p-4 pt-10 pb-10 relative overflow-hidden select-none">
      {/* Background ambient lighting glows */}
      <div className="ambient-glow-purple top-[10%] left-[10%] opacity-40" />
      <div className="ambient-glow-purple bottom-[10%] right-[10%] opacity-30" />
      <div className="ambient-neon-lines" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md glass-card rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center mb-2">
            <span className="text-[1.35rem] font-bold tracking-[0.05em] text-white flex items-baseline md:items-end leading-none whitespace-nowrap">
              <svg viewBox="0 0 24 24" className="w-9 h-9 md:w-8 md:h-8 shrink-0 -mr-1 translate-y-[5px] md:translate-y-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="t-gradient-cadastro" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#d946ef" />
                    <stop offset="100%" stopColor="#7e22ce" />
                  </linearGradient>
                  <linearGradient id="t-highlight-cadastro" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#fdf4ff" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-gradient-cadastro)" />
                <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-highlight-cadastro)" />
              </svg>
              ROOKA
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            Seja um parceiro
          </p>
        </div>

        {isWaitlisted ? (
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Você está na Lista de Espera!</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              O acesso para novos lojistas parceiros está restrito no momento enquanto validamos a plataforma. 
              <br/><br/>
              Avaliamos novos cadastros semanalmente. Entraremos em contato via WhatsApp ou e-mail assim que liberarmos sua região!
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 mt-4 text-sm"
            >
              Voltar para o Início
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400">Nome da Loja</label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  className="w-full bg-neutral-900 text-neutral-100 pl-11 pr-4 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-sm transition-colors"
                  placeholder="Sua Loja"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400">Nome do Responsável</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  className="w-full bg-neutral-900 text-neutral-100 pl-11 pr-4 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-sm transition-colors"
                  placeholder="Seu Nome"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  className="w-full bg-neutral-900 text-neutral-100 pl-11 pr-4 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-sm transition-colors"
                  placeholder="exemplo@loja.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="tel"
                  required
                  className="w-full bg-neutral-900 text-neutral-100 pl-11 pr-4 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-sm transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-400">Senha (para acesso futuro)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  className="w-full bg-neutral-900 text-neutral-100 pl-11 pr-4 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-sm transition-colors"
                  placeholder="Crie uma senha forte"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_4px_25px_rgba(168,85,247,0.3)] disabled:opacity-50 cursor-pointer mt-4"
            >
              {loading ? 'Enviando...' : 'Entrar na Lista de Espera'}
            </button>
          </form>
        )}

        {!isWaitlisted && (
          <div className="text-center mt-6">
            <button 
              onClick={() => router.push('/lojista/login')} 
              className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
            >
              Já foi aprovado? Fazer login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
