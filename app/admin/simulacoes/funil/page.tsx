'use client';

import React, { useState, useEffect } from 'react';
import { dbService, UpgradeRequest, Offer } from '@/services/dbService';
import { BarChart3, Users, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

export default function AdminAnalyticsFunil() {
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allReqs = await dbService.getAllUpgradeRequests();
        // Em um app real, buscaríamos ofertas de outra forma, aqui estamos pegando tudo do localStorage manual.
        // Como dbService não tem getAllOffers exposto explicitamente, podemos simular cruzando.
        // Na verdade, podemos usar o `requests` para os cálculos básicos do funil
        setRequests(allReqs);
        
        // Emulando pegar offers do localStorage por enquanto (Phase 3 analytics)
        if (typeof window !== 'undefined') {
          const storedOffers = localStorage.getItem('trooka_offers');
          if (storedOffers) {
            setOffers(JSON.parse(storedOffers));
          }
        }
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

  // --- CALCULATE FUNNEL ---
  // Step 1: Visitantes (Mocked estimate for demonstration, 3x simulations)
  const step1_Visitors = requests.length * 3; 
  // Step 2: Início de Simulação (All requests)
  const step2_Simulations = requests.length;
  // Step 3: Receberam Oferta (Status != pending)
  const step3_WithOffers = requests.filter(r => r.status !== 'pending').length;
  // Step 4: Fecharam Negócio (Status == completed)
  const step4_Completed = requests.filter(r => r.status === 'completed').length;

  const funnelData = [
    { label: 'Visitantes Únicos', value: step1_Visitors, icon: Users, color: 'from-neutral-700 to-neutral-800', width: '100%' },
    { label: 'Simulações Iniciadas', value: step2_Simulations, icon: Smartphone, color: 'from-blue-600 to-blue-800', width: '75%' },
    { label: 'Receberam Ofertas', value: step3_WithOffers, icon: BarChart3, color: 'from-orange-500 to-orange-700', width: '50%' },
    { label: 'Negócios Fechados', value: step4_Completed, icon: CheckCircle, color: 'from-emerald-500 to-emerald-700', width: '25%' },
  ];

  // --- CALCULATE UPGRADE MATRIX ---
  // Map current -> desired
  const upgradeMatrix: Record<string, Record<string, number>> = {};
  
  requests.forEach(req => {
    if (!req.modelo_desejado_nome) return; // Only upgrades
    const current = (req.modelo_atual_nome.split(' ')[1] + ' ' + (req.modelo_atual_nome.split(' ')[2] || '')).trim();
    const desired = (req.modelo_desejado_nome.split(' ')[1] + ' ' + (req.modelo_desejado_nome.split(' ')[2] || '')).trim();

    if (!upgradeMatrix[current]) upgradeMatrix[current] = {};
    if (!upgradeMatrix[current][desired]) upgradeMatrix[current][desired] = 0;
    
    upgradeMatrix[current][desired] += 1;
  });

  const sortedCurrents = Object.keys(upgradeMatrix).sort();
  const allDesireds = Array.from(new Set(Object.values(upgradeMatrix).flatMap(d => Object.keys(d)))).sort();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-orange-500" />
          Analytics & Funil
        </h1>
        <p className="text-xs text-neutral-500 font-semibold mt-1">
          Análise de conversão e comportamento de upgrade dos usuários
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FUNIL DE CONVERSÃO */}
        <div className="glass-card border-neutral-900 rounded-3xl p-6 lg:p-8 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Funil de Conversão</h3>
            <p className="text-xs text-neutral-500 mt-1">Desempenho da jornada do usuário</p>
          </div>

          <div className="space-y-4">
            {funnelData.map((step, idx) => {
              const prevValue = idx === 0 ? step.value : funnelData[idx - 1].value;
              const conversion = prevValue > 0 ? Math.round((step.value / prevValue) * 100) : 0;
              const globalConversion = step1_Visitors > 0 ? Math.round((step.value / step1_Visitors) * 100) : 0;
              
              return (
                <div key={idx} className="relative">
                  {idx > 0 && (
                    <div className="absolute -top-3 right-4 text-[9px] font-bold text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded-full border border-neutral-800 z-10">
                      {conversion}% retenção
                    </div>
                  )}
                  <div 
                    className={`bg-gradient-to-r ${step.color} p-4 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden`}
                    style={{ width: idx === 0 ? '100%' : `calc(20% + 80% * (${step.value} / ${funnelData[0].value}))` }}
                  >
                    {/* Gloss effect */}
                    <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                        <step.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white tracking-wide truncate pr-2">{step.label}</span>
                    </div>
                    <span className="text-xl font-black text-white relative z-10">{step.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-neutral-900 flex justify-between items-center">
            <span className="text-xs font-bold text-neutral-500 uppercase">Conversão Global</span>
            <span className="text-2xl font-black text-emerald-400">
              {step1_Visitors > 0 ? Math.round((step4_Completed / step1_Visitors) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* MATRIZ DE UPGRADE */}
        <div className="glass-card border-neutral-900 rounded-3xl p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Matriz de Comportamento</h3>
            <p className="text-xs text-neutral-500 mt-1">O que os usuários têm x O que eles querem</p>
          </div>

          {sortedCurrents.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              Não há dados suficientes de simulações de upgrade.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-[10px] font-bold text-neutral-600 uppercase tracking-wider border-b border-r border-neutral-900 w-32">
                      De \ Para
                    </th>
                    {allDesireds.map(desired => (
                      <th key={desired} className="p-3 text-[10px] font-bold text-orange-500 uppercase tracking-wider border-b border-neutral-900 text-center min-w-[80px]">
                        {desired}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedCurrents.map(current => {
                    const rowTotal = Object.values(upgradeMatrix[current]).reduce((a, b) => a + b, 0);

                    return (
                      <tr key={current} className="group">
                        <td className="p-3 text-xs font-bold text-neutral-300 border-r border-neutral-900 bg-neutral-950/30 group-hover:bg-neutral-900/50 transition-colors">
                          {current}
                        </td>
                        {allDesireds.map(desired => {
                          const count = upgradeMatrix[current][desired] || 0;
                          const percentage = rowTotal > 0 ? Math.round((count / rowTotal) * 100) : 0;
                          
                          // Heatmap color logic
                          let bgColor = 'bg-transparent';
                          let textColor = 'text-neutral-600';
                          
                          if (percentage > 50) { bgColor = 'bg-orange-500/30'; textColor = 'text-orange-300 font-bold'; }
                          else if (percentage > 20) { bgColor = 'bg-orange-500/15'; textColor = 'text-orange-400 font-semibold'; }
                          else if (percentage > 0) { bgColor = 'bg-orange-500/5'; textColor = 'text-neutral-400'; }

                          return (
                            <td key={desired} className={`p-3 text-center transition-colors ${bgColor}`}>
                              {count > 0 ? (
                                <div className="flex flex-col items-center justify-center">
                                  <span className={`text-sm ${textColor}`}>{count}</span>
                                  <span className="text-[9px] text-neutral-500">{percentage}%</span>
                                </div>
                              ) : (
                                <span className="text-neutral-800 text-[10px]">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="pt-2 flex items-center justify-between text-[10px] text-neutral-500 font-medium">
            <span>Linhas = Aparelho atual (Usado)</span>
            <span>Colunas = Aparelho desejado (Novo)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
