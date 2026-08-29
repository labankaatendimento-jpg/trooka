'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@trooka.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('trooka_admin_session', 'true');
      router.push('/admin/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting glows */}
      <div className="ambient-glow-purple top-[10%] left-[10%] opacity-40" />
      <div className="ambient-glow-purple bottom-[10%] right-[10%] opacity-30" />
      <div className="ambient-neon-lines" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm glass-card rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="text-center space-y-3 mb-8">
          <span className="text-[1.8rem] font-bold tracking-[0.05em] text-white flex items-baseline justify-center leading-none whitespace-nowrap mb-2">
            <svg viewBox="0 0 24 24" className="w-10 h-10 shrink-0 -mr-1 translate-y-[5px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="t-gradient-login" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#7e22ce" />
                </linearGradient>
                <linearGradient id="t-highlight-login" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#fdf4ff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-gradient-login)" />
              <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-highlight-login)" />
            </svg>
            ROOKA
          </span>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
            Administrador
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-400">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-neutral-900 text-neutral-100 pl-11 pr-4 py-3 rounded-2xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-sm transition-colors"
                placeholder="admin@trooka.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-400">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-neutral-900 text-neutral-100 pl-11 pr-4 py-3 rounded-2xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_4px_25px_rgba(255,94,0,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
