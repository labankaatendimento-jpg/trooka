'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Smartphone } from 'lucide-react';
import { dbService } from '@/services/dbService';
import { IphoneModel } from '@/lib/mockData';

export default function AdminCatalogo() {
  const [models, setModels] = useState<IphoneModel[]>([]);
  const [showModelForm, setShowModelForm] = useState(false);
  const [modelForm, setModelForm] = useState({
    modelo: '',
    armazenamento: '128GB',
    ano: 2024,
    preco_medio_novo: 0,
    preco_medio_usado: 0,
    valor_base_upgrade: 0,
  });

  const loadData = async () => {
    try {
      const allModels = await dbService.getIphoneModels();
      setModels(allModels);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newModel = await dbService.addIphoneModel({
        marca: 'Apple',
        modelo: modelForm.modelo,
        armazenamento: modelForm.armazenamento,
        ano: Number(modelForm.ano),
        preco_medio_novo: Number(modelForm.preco_medio_novo),
        preco_medio_usado: Number(modelForm.preco_medio_usado),
        valor_base_upgrade: Number(modelForm.valor_base_upgrade),
        status: 'active'
      });

      await dbService.addAdminLog({
        admin_id: 'admin',
        acao: 'Novo Modelo',
        item_alterado: `Catálogo: ${newModel.modelo} ${newModel.armazenamento}`,
        valor_anterior: 'Inexistente',
        novo_valor: `R$ ${newModel.preco_medio_novo} (Novo)`
      });

      await loadData();
      setShowModelForm(false);
      setModelForm({ modelo: '', armazenamento: '128GB', ano: 2024, preco_medio_novo: 0, preco_medio_usado: 0, valor_base_upgrade: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Banco de Modelos</h1>
          <p className="text-xs text-neutral-500 font-semibold mt-1">Cadastro de modelos e preços de mercado</p>
        </div>
        <button
          onClick={() => setShowModelForm(!showModelForm)}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(255,94,0,0.2)] flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Cadastrar Modelo
        </button>
      </div>

      {/* Form Dropdown */}
      {showModelForm && (
        <motion.form 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          onSubmit={handleAddModel} 
          className="glass-card border-neutral-900 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="space-y-1.5">
            <label className="block text-[10px] text-neutral-500 font-bold uppercase">Nome do Modelo</label>
            <input
              type="text"
              required
              value={modelForm.modelo}
              onChange={e => setModelForm({...modelForm, modelo: e.target.value})}
              placeholder="Ex: iPhone 16 Pro Max"
              className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-neutral-500 font-bold uppercase">Capacidade</label>
            <select
              value={modelForm.armazenamento}
              onChange={e => setModelForm({...modelForm, armazenamento: e.target.value})}
              className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors cursor-pointer"
            >
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-neutral-500 font-bold uppercase">Ano de Lançamento</label>
            <input
              type="number"
              required
              value={modelForm.ano}
              onChange={e => setModelForm({...modelForm, ano: Number(e.target.value)})}
              className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-neutral-500 font-bold uppercase">Preço Médio Novo (R$)</label>
            <input
              type="number"
              required
              value={modelForm.preco_medio_novo}
              onChange={e => setModelForm({...modelForm, preco_medio_novo: Number(e.target.value)})}
              className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-neutral-500 font-bold uppercase">Preço Médio Usado (R$)</label>
            <input
              type="number"
              required
              value={modelForm.preco_medio_usado}
              onChange={e => setModelForm({...modelForm, preco_medio_usado: Number(e.target.value)})}
              className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] text-neutral-500 font-bold uppercase">Valor Base Troca (R$)</label>
            <input
              type="number"
              required
              value={modelForm.valor_base_upgrade}
              onChange={e => setModelForm({...modelForm, valor_base_upgrade: Number(e.target.value)})}
              className="w-full bg-neutral-900 text-neutral-100 px-4 py-2.5 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors"
            />
          </div>
          <div className="col-span-1 md:col-span-3 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModelForm(false)}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors border border-neutral-850 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Salvar modelo
            </button>
          </div>
        </motion.form>
      )}

      {/* Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {models.map(model => (
          <div key={model.id} className="glass-card border-neutral-900 rounded-2xl p-4 flex flex-col justify-between min-h-[140px] hover:border-neutral-700 transition-colors">
            <div>
              <span className="text-[9px] text-neutral-500 font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900">{model.ano}</span>
              <h4 className="text-[14px] font-bold text-neutral-200 mt-2">{model.modelo}</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Armazenamento: {model.armazenamento}</p>
            </div>
            <div className="pt-3 border-t border-neutral-950 mt-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase font-bold">Valor Base Troca</span>
                <span className="text-orange-500 font-extrabold">R$ {model.valor_base_upgrade.toLocaleString('pt-BR')}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase font-bold">Médio Usado</span>
                <span className="text-neutral-300 font-semibold">R$ {model.preco_medio_usado.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
