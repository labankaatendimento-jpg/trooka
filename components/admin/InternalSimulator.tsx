'use client';

import React, { useState } from 'react';
import { IphoneModel, PriceRule } from '@/lib/mockData';
import { Calculator } from 'lucide-react';

interface InternalSimulatorProps {
  models: IphoneModel[];
  rules: PriceRule[];
}

export default function InternalSimulator({ models, rules }: InternalSimulatorProps) {
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const selectedModel = models.find(m => m.id === selectedModelId);
  const selectedRule = rules.find(r => r.nome.toLowerCase() === selectedState.toLowerCase());

  let basePrice = selectedModel?.preco_medio_usado || 0;
  let finalPrice = basePrice;
  let multiplier = 1;

  if (selectedRule) {
    multiplier = selectedRule.percentual;
    finalPrice = basePrice * multiplier;
  }

  return (
    <div className="glass-card border-neutral-900 rounded-3xl p-6 space-y-6 bg-gradient-to-br from-neutral-900/50 to-neutral-950/80">
      <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
        <div className="bg-orange-500/20 p-2 rounded-xl">
          <Calculator className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Simulador Interno</h3>
          <p className="text-xs text-neutral-500">Teste as regras de precificação antes de publicar</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] text-neutral-500 font-bold uppercase">Modelo do Cliente</label>
          <select
            value={selectedModelId}
            onChange={e => setSelectedModelId(e.target.value)}
            className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors cursor-pointer"
          >
            <option value="">Selecione um modelo...</option>
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.modelo} {m.armazenamento}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] text-neutral-500 font-bold uppercase">Estado do Aparelho (Regra)</label>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors cursor-pointer"
            disabled={!selectedModelId}
          >
            <option value="">Selecione um estado...</option>
            {rules.map(r => (
              <option key={r.id} value={r.nome}>{r.nome} ({(r.percentual * 100).toFixed(0)}%)</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-900 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-500 font-semibold">Valor Base (Mercado Usado)</span>
          <span className="text-neutral-300">R$ {basePrice.toLocaleString('pt-BR')}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-500 font-semibold">Multiplicador da Regra ({selectedState || 'Nenhum'})</span>
          <span className="text-orange-400 font-bold">{multiplier.toFixed(2)}x</span>
        </div>
        <div className="border-t border-neutral-900 pt-3 flex justify-between items-center">
          <span className="text-sm text-neutral-400 font-bold uppercase">Valor Final Estimado</span>
          <span className="text-xl font-extrabold text-white">R$ {finalPrice.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}
