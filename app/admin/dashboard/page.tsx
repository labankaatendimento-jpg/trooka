'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalSimulations: 0,
    totalStores: 0,
    activeStores: 0,
    pendingStores: 0,
    totalProposals: 0,
    conversionRate: 0,
    totalValue: 0,
    ticketMedio: 0,
    totalVenda: 0,
    totalUpgrade: 0,
    topCurrentModels: [] as {name: string, count: number}[],
    topDesiredModels: [] as {name: string, count: number}[],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const adminStats = await dbService.getAdminStats();
        setStats(adminStats);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Visão Geral</h1>
        <p className="text-xs text-neutral-500 font-semibold mt-1">Status operacional da plataforma Trooka</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Simulações totais', value: stats.totalSimulations, desc: 'desde a inauguração' },
          { title: 'Simulações de venda', value: stats.totalVenda, desc: 'Apenas venda do usado' },
          { title: 'Simulações de upgrade', value: stats.totalUpgrade, desc: 'Troca por novo aparelho' },
          { title: 'Taxa de upgrade', value: `${stats.totalSimulations > 0 ? Math.round((stats.totalUpgrade / stats.totalSimulations) * 100) : 0}%`, desc: 'Das simulações totais' },
          
          { title: 'Valor em aparelhos', value: `R$ ${(stats.totalValue / 1000).toFixed(1)}k`, desc: 'Valor somado das estimativas' },
          { title: 'Ticket Médio', value: `R$ ${stats.ticketMedio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, desc: 'Valor médio por simulação' },
          { title: 'Propostas enviadas', value: stats.totalProposals, desc: 'Lances de lojistas' },
          { title: 'Taxa de conversão', value: `${stats.conversionRate}%`, desc: 'Leads aceitos por lojas' },
        ].map((card, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 border border-neutral-900/60">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{card.title}</p>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">{card.value}</h2>
            <p className="text-[10px] text-neutral-600 font-medium mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-neutral-900/60 space-y-4">
          <h3 className="text-sm font-bold text-neutral-350">Aparelhos Usados Mais Oferecidos</h3>
          <div className="space-y-3 mt-4">
            {stats.topCurrentModels && stats.topCurrentModels.length > 0 ? (
              stats.topCurrentModels.map((model, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700 transition-colors">
                  <span className="text-sm font-semibold text-neutral-200">{model.name}</span>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">{model.count}x</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500">Ainda não há dados suficientes.</p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-neutral-900/60 space-y-4">
          <h3 className="text-sm font-bold text-neutral-350">Upgrades Mais Desejados</h3>
          <div className="space-y-3 mt-4">
            {stats.topDesiredModels && stats.topDesiredModels.length > 0 ? (
              stats.topDesiredModels.map((model, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700 transition-colors">
                  <span className="text-sm font-semibold text-neutral-200">{model.name}</span>
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md">{model.count}x</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500">Ainda não há dados suficientes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
