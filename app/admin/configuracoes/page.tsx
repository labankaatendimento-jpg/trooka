'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Bell, Shield, Wallet, Globe } from 'lucide-react';
import { dbService } from '@/services/dbService';

export default function AdminConfiguracoes() {
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    arredondamentoAtivo: true,
    multiploArredondamento: 50,
    margemSegurancaLojista: 10,
    modoManutencao: false,
    permitirLojistasAutomatico: false,
    emailNotificacoes: 'admin@trooka.com'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulating save to dbService
    setTimeout(async () => {
      await dbService.addAdminLog({
        admin_id: 'admin',
        acao: 'Alteração de Configuração',
        item_alterado: 'Configurações Globais do Sistema',
        valor_anterior: 'Anterior',
        novo_valor: 'Novas Regras Aplicadas'
      });
      setIsSaving(false);
      alert('Configurações salvas com sucesso!');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-6 h-6 text-orange-500" />
          Configurações do Sistema
        </h1>
        <p className="text-xs text-neutral-500 font-semibold mt-1">
          Ajustes globais, segurança e regras de negócio da plataforma Trooka
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Comercial & Algoritmo */}
        <div className="glass-card border-neutral-900 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
            <div className="bg-orange-500/20 p-2 rounded-xl">
              <Wallet className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Regras Comerciais</h3>
              <p className="text-xs text-neutral-500">Comportamento matemático da simulação pública</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.arredondamentoAtivo}
                  onChange={(e) => setConfig({...config, arredondamentoAtivo: e.target.checked})}
                  className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                />
                <div>
                  <span className="block text-sm font-bold text-neutral-200">Arredondamento Ativo</span>
                  <span className="block text-[10px] text-neutral-500">Arredondar estimativas de preço para facilitar a leitura</span>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Múltiplo de Arredondamento (R$)
              </label>
              <select 
                disabled={!config.arredondamentoAtivo}
                value={config.multiploArredondamento}
                onChange={(e) => setConfig({...config, multiploArredondamento: Number(e.target.value)})}
                className="w-full bg-neutral-900 text-neutral-100 px-4 py-3 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none disabled:opacity-50"
              >
                <option value={10}>Múltiplos de 10</option>
                <option value={50}>Múltiplos de 50</option>
                <option value={100}>Múltiplos de 100</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Margem de Segurança Padrão (%)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={config.margemSegurancaLojista}
                  onChange={(e) => setConfig({...config, margemSegurancaLojista: Number(e.target.value)})}
                  className="w-full bg-neutral-900 text-neutral-100 px-4 py-3 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none pl-12"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">%</span>
              </div>
              <p className="text-[10px] text-neutral-500">Desconto preventivo adicional aplicado em aparelhos quebrados antes de enviar aos lojistas.</p>
            </div>
          </div>
        </div>

        {/* Segurança e Plataforma */}
        <div className="glass-card border-neutral-900 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
            <div className="bg-purple-500/20 p-2 rounded-xl">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Plataforma e Lojistas</h3>
              <p className="text-xs text-neutral-500">Controles de acesso e manutenção</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.modoManutencao}
                  onChange={(e) => setConfig({...config, modoManutencao: e.target.checked})}
                  className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                />
                <div>
                  <span className="block text-sm font-bold text-neutral-200">Modo Manutenção (Vitrine)</span>
                  <span className="block text-[10px] text-neutral-500">Impede novas simulações de clientes finais (Exibe tela de retorno em breve)</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer pt-4">
                <input 
                  type="checkbox" 
                  checked={config.permitirLojistasAutomatico}
                  onChange={(e) => setConfig({...config, permitirLojistasAutomatico: e.target.checked})}
                  className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                />
                <div>
                  <span className="block text-sm font-bold text-neutral-200">Aprovação Automática (Lojistas)</span>
                  <span className="block text-[10px] text-neutral-500">Novas lojas entram como ativas imediatamente sem revisão manual</span>
                </div>
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                E-mail para Alertas do Sistema
              </label>
              <div className="relative">
                <Bell className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  value={config.emailNotificacoes}
                  onChange={(e) => setConfig({...config, emailNotificacoes: e.target.value})}
                  className="w-full bg-neutral-900 text-neutral-100 px-4 py-3 rounded-xl border border-neutral-800 focus:border-purple-500 focus:outline-none pl-11"
                />
              </div>
              <p className="text-[10px] text-neutral-500">Receberá avisos sobre picos de simulação e novas lojas pendentes.</p>
            </div>

          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-orange-600 hover:bg-orange-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(255,94,0,0.2)] disabled:shadow-none flex items-center gap-2"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Salvar Configurações
          </button>
        </div>

      </form>
    </div>
  );
}
