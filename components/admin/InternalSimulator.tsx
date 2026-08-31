'use client';

import React, { useState } from 'react';
import { IphoneModel, PriceRule } from '@/lib/mockData';
import { Calculator } from 'lucide-react';
import { calculateUpgradeEstimate } from '@/utils/calculateEstimate';

interface InternalSimulatorProps {
  models: IphoneModel[];
  rules: PriceRule[];
}

export default function InternalSimulator({ models, rules }: InternalSimulatorProps) {
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const selectedModel = models.find(m => m.id === selectedModelId);

  // For testing, default condition and battery
  const [condition, setCondition] = useState<'excelente' | 'bom' | 'marcas' | 'tela_quebrada'>('excelente');
  const [batteryCondition, setBatteryCondition] = useState<'90-100' | '80-89' | 'below-80'>('90-100');
  const [hasRepaired, setHasRepaired] = useState<'sim' | 'nao'>('nao');

  const estimate = calculateUpgradeEstimate(selectedModel || null, null, condition, hasRepaired, batteryCondition, null, rules);
  
  let basePrice = selectedModel?.valor_base_upgrade || 0;
  let finalPrice = estimate.valorEstimado || 0;

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
          <label className="block text-[10px] text-neutral-500 font-bold uppercase">Estado do Aparelho</label>
          <select
            value={condition}
            onChange={e => setCondition(e.target.value as any)}
            className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors cursor-pointer"
            disabled={!selectedModelId}
          >
            <option value="excelente">Excelente</option>
            <option value="bom">Bom</option>
            <option value="marcas">Usado (Marcas)</option>
            <option value="tela_quebrada">Danificado (Tela Quebrada)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] text-neutral-500 font-bold uppercase">Saúde da Bateria</label>
          <select
            value={batteryCondition}
            onChange={e => setBatteryCondition(e.target.value as any)}
            className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors cursor-pointer"
            disabled={!selectedModelId}
          >
            <option value="90-100">90 - 100%</option>
            <option value="80-89">80 - 89%</option>
            <option value="below-80">Abaixo de 80%</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] text-neutral-500 font-bold uppercase">Já foi reparado?</label>
          <select
            value={hasRepaired}
            onChange={e => setHasRepaired(e.target.value as any)}
            className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors cursor-pointer"
            disabled={!selectedModelId}
          >
            <option value="nao">Não</option>
            <option value="sim">Sim</option>
          </select>
        </div>
      </div>

      <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-900 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-500 font-semibold">Valor Base de Upgrade</span>
          <span className="text-neutral-300">R$ {basePrice.toLocaleString('pt-BR')}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-500 font-semibold">Multiplicador Final</span>
          <span className="text-orange-400 font-bold">{(finalPrice / (basePrice || 1)).toFixed(2)}x</span>
        </div>
        <div className="border-t border-neutral-900 pt-3 flex justify-between items-center">
          <span className="text-sm text-neutral-400 font-bold uppercase">Valor Final Estimado</span>
          <span className="text-xl font-extrabold text-white">R$ {finalPrice.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}
