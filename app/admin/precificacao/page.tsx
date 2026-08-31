'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { IphoneModel, PriceRule } from '@/lib/mockData';
import InternalSimulator from '@/components/admin/InternalSimulator';
import { Edit2, Save, X } from 'lucide-react';

export default function AdminPrecificacao() {
  const [models, setModels] = useState<IphoneModel[]>([]);
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    preco_medio_usado: 0,
    preco_medio_novo: 0,
    valor_base_upgrade: 0
  });

  const loadData = async () => {
    try {
      const allModels = await dbService.getIphoneModels();
      setModels(allModels);
      
      const allRules = await dbService.getPriceRules();
      setRules(allRules);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateRuleMultiplier = async (id: string, valueStr: string) => {
    const val = parseFloat(valueStr);
    if (isNaN(val) || val < 0 || val > 2) return;
    try {
      const oldRule = rules.find(r => r.id === id);
      const updatedRule = await dbService.updatePriceRule(id, val);
      if (oldRule) {
        await dbService.addAdminLog({
          admin_id: 'admin',
          acao: 'Atualização de Regra',
          item_alterado: `Regra de Estado: ${oldRule.nome}`,
          valor_anterior: oldRule.percentual.toString(),
          novo_valor: updatedRule.percentual.toString()
        });
      }
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (model: IphoneModel) => {
    setEditingModelId(model.id);
    setEditValues({
      preco_medio_usado: model.preco_medio_usado || 0,
      preco_medio_novo: model.preco_medio_novo || 0,
      valor_base_upgrade: model.valor_base_upgrade || 0
    });
  };

  const handleCancelEdit = () => {
    setEditingModelId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingModelId) return;
    
    // Atualiza otimisticamente
    setModels(prev => prev.map(m => m.id === editingModelId ? { ...m, ...editValues } : m));
    setEditingModelId(null);
    
    try {
      await dbService.updateIphoneModel(editingModelId, editValues);
      await dbService.addAdminLog({
        admin_id: 'admin',
        acao: 'Edição Manual de Preço',
        item_alterado: 'Modelos e Preços',
        valor_anterior: '-',
        novo_valor: `Preços atualizados para o modelo ID: ${editingModelId}`
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar preços.');
      loadData(); // Reverte em caso de erro
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Preços & Regras</h1>
        <p className="text-xs text-neutral-500 font-semibold mt-1">Gestão de precificação, depreciação e simulador interno</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Regras e Tabela */}
        <div className="lg:col-span-2 space-y-8">
          {/* Regras de Estado */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Regras de Depreciação (Estado)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rules.map(rule => (
                <div key={rule.id} className="glass-card border-neutral-900 rounded-2xl p-5 flex items-center justify-between hover:border-neutral-700 transition-colors">
                  <div>
                    <h3 className="text-[15px] font-bold text-neutral-200">{rule.nome}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Multiplicador da estimativa</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="2"
                      value={rule.percentual}
                      onChange={e => handleUpdateRuleMultiplier(rule.id, e.target.value)}
                      className="w-20 bg-neutral-950 text-neutral-100 text-center px-2 py-2 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors font-bold"
                    />
                    <span className="text-xs text-neutral-500 font-bold">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela Resumo de Preços */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Tabela de Preços (Mercado)</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-semibold px-2">Edite os preços diretamente na tabela abaixo</span>
              </div>
            </div>
            <div className="glass-card border-neutral-900 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-900 bg-neutral-950/50">
                      <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Modelo</th>
                      <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Médio Usado</th>
                      <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Médio Novo</th>
                      <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Base Upgrade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900/50">
                    {models.map(model => (
                      <tr key={model.id} className="group hover:bg-neutral-900/20 transition-colors">
                        <td className="p-4">
                          <p className="text-sm font-bold text-neutral-200">{model.modelo}</p>
                          <p className="text-[10px] text-neutral-500">{model.armazenamento} • {model.ano}</p>
                        </td>
                        <td className="p-4 text-sm font-semibold text-neutral-300">
                          {editingModelId === model.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-neutral-500">R$</span>
                              <input
                                type="number"
                                value={editValues.preco_medio_usado}
                                onChange={(e) => setEditValues({...editValues, preco_medio_usado: Number(e.target.value)})}
                                className="w-20 bg-neutral-950 text-neutral-100 px-2 py-1 rounded-lg border border-neutral-800 focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                          ) : (
                            `R$ ${model.preco_medio_usado.toLocaleString('pt-BR')}`
                          )}
                        </td>
                        <td className="p-4 text-sm font-semibold text-neutral-400">
                          {editingModelId === model.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-neutral-500">R$</span>
                              <input
                                type="number"
                                value={editValues.preco_medio_novo}
                                onChange={(e) => setEditValues({...editValues, preco_medio_novo: Number(e.target.value)})}
                                className="w-20 bg-neutral-950 text-neutral-100 px-2 py-1 rounded-lg border border-neutral-800 focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                          ) : (
                            `R$ ${model.preco_medio_novo.toLocaleString('pt-BR')}`
                          )}
                        </td>
                        <td className="p-4 text-sm font-bold text-orange-400">
                          {editingModelId === model.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-neutral-500">R$</span>
                              <input
                                type="number"
                                value={editValues.valor_base_upgrade}
                                onChange={(e) => setEditValues({...editValues, valor_base_upgrade: Number(e.target.value)})}
                                className="w-20 bg-neutral-950 text-orange-400 px-2 py-1 rounded-lg border border-neutral-800 focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span>R$ {model.valor_base_upgrade.toLocaleString('pt-BR')}</span>
                              <button
                                onClick={() => handleEditClick(model)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-md transition-all"
                                title="Editar Preços"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                        {editingModelId === model.id && (
                           <td className="p-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button onClick={handleCancelEdit} className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-md transition-all">
                                 <X className="w-4 h-4" />
                               </button>
                               <button onClick={handleSaveEdit} className="p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-all shadow-sm shadow-orange-500/20">
                                 <Save className="w-4 h-4" />
                               </button>
                             </div>
                           </td>
                        )}
                        {editingModelId !== model.id && editingModelId && (
                           <td className="p-4"></td> // Filler para a coluna de ações quando outra linha estiver sendo editada
                        )}
                        {!editingModelId && <td className="p-0 m-0 w-0"></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Simulador Interno */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <InternalSimulator models={models} rules={rules} />
          </div>
        </div>

      </div>
    </div>
  );
}
