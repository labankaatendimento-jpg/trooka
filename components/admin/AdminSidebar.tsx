'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Smartphone, Scale, 
  Settings, LogOut, Tags, BarChart3, ListOrdered, FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('trooka_admin_session');
    router.push('/admin/login');
  };

  const navGroups = [
    {
      title: 'DASHBOARD',
      items: [
        { label: 'Visão Geral', icon: LayoutDashboard, href: '/admin/dashboard' },
      ]
    },
    {
      title: 'SIMULAÇÕES',
      items: [
        { label: 'Todas as Simulações', icon: ListOrdered, href: '/admin/simulacoes' },
        { label: 'Funil', icon: BarChart3, href: '/admin/simulacoes/funil' },
      ]
    },
    {
      title: 'PRECIFICAÇÃO',
      items: [
        { label: 'Preços & Regras', icon: Scale, href: '/admin/precificacao' },
      ]
    },
    {
      title: 'CATÁLOGO',
      items: [
        { label: 'Modelos de Aparelhos', icon: Smartphone, href: '/admin/catalogo' },
      ]
    },
    {
      title: 'SISTEMA',
      items: [
        { label: 'Alertas', icon: AlertTriangle, href: '/admin/alertas' },
        { label: 'Configurações', icon: Settings, href: '/admin/configuracoes' },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-900/50 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo Area */}
      <div className="p-6 sticky top-0 bg-neutral-950/80 backdrop-blur-md z-10 border-b border-neutral-900/30">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group">
          <span className="text-[1.35rem] font-bold tracking-[0.05em] text-white flex items-baseline leading-none whitespace-nowrap group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0 -mr-1 translate-y-[3px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="t-gradient-admin" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#7e22ce" />
                </linearGradient>
                <linearGradient id="t-highlight-admin" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#fdf4ff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-gradient-admin)" />
              <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-highlight-admin)" />
            </svg>
            ROOKA <span className="text-purple-500 font-normal ml-1">Admin</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-8">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            <h3 className="px-3 text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <nav className="space-y-1">
              {group.items.map((item, iIdx) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={iIdx} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-semibold relative overflow-hidden group ${
                      isActive 
                        ? 'text-white bg-neutral-900/80 border border-neutral-800' 
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40 border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicatorAdmin"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-orange-500 rounded-r-full"
                      />
                    )}
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-neutral-600 group-hover:text-neutral-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-neutral-900/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors font-semibold text-sm cursor-pointer border border-transparent hover:border-rose-500/20"
        >
          <LogOut className="w-4 h-4" />
          Sair do Painel
        </button>
      </div>
    </aside>
  );
}
