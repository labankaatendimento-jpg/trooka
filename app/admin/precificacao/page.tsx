'use client';

import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '@/services/dbService';
import { IphoneModel, PriceRule } from '@/lib/mockData';
import InternalSimulator from '@/components/admin/InternalSimulator';
import { Upload, Download } from 'lucide-react';

export default function AdminPrecificacao() {
  const [models, setModels] = useState<IphoneModel[]>([]);
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim() !== '');
      if (lines.length < 2) throw new Error("Planilha vazia ou inválida.");

      const delimiter = lines[0].includes(';') ? ';' : ',';
      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
      
      const parsedModels: Omit<IphoneModel, 'id' | 'status'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(delimiter).map(r => r.trim());
        const modelData: any = {};
        headers.forEach((h, index) => {
          modelData[h] = row[index];
        });
        
        // Helper para converter "3.500,00" ou "3500" para número
        const parseNumber = (val: string) => {
          if (!val) return NaN;
          // Se tiver vírgula e ponto, assume padrão BR (remove ponto, troca vírgula por ponto)
          let clean = val.replace(/\./g, '').replace(',', '.');
          return parseFloat(clean);
        };

        const precoUsado = parseNumber(modelData.preco_medio_usado);
        const precoNovo = parseNumber(modelData.preco_medio_novo);
        const valorBase = parseNumber(modelData.valor_base_upgrade);
        const ano = parseInt(modelData.ano) || 2024;
        
        
        if (modelData.modelo && modelData.armazenamento && !isNaN(precoUsado) && !isNaN(precoNovo) && !isNaN(valorBase)) {
          parsedModels.push({
            marca: 'Apple',
            modelo: modelData.modelo,
            armazenamento: modelData.armazenamento,
            ano: ano,
            preco_medio_usado: precoUsado,
            preco_medio_novo: precoNovo,
            valor_base_upgrade: valorBase
          });
        }
      }

      if (parsedModels.length > 0) {
        await dbService.bulkUpsertIphoneModels(parsedModels);
        await dbService.addAdminLog({
          admin_id: 'admin',
          acao: 'Importação de Planilha',
          item_alterado: 'Modelos e Preços',
          valor_anterior: '-',
          novo_valor: `${parsedModels.length} modelos importados/atualizados`
        });
        await loadData();
        alert(`${parsedModels.length} modelos processados com sucesso!`);
      } else {
        alert("Nenhum dado válido encontrado na planilha. Verifique o formato.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao processar planilha.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = "modelo;armazenamento;ano;preco_medio_usado;preco_medio_novo;valor_base_upgrade\niPhone 15 Pro Max;256GB;2023;6500;8500;2000\niPhone 14;128GB;2022;3500;4500;1000\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "modelo_precos_trooka.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <button
                  onClick={downloadTemplate}
                  className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Modelo
                </button>
                
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-500 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploading ? 'Processando...' : 'Importar CSV'}
                </button>
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
                      <tr key={model.id} className="hover:bg-neutral-900/20 transition-colors">
                        <td className="p-4">
                          <p className="text-sm font-bold text-neutral-200">{model.modelo}</p>
                          <p className="text-[10px] text-neutral-500">{model.armazenamento} • {model.ano}</p>
                        </td>
                        <td className="p-4 text-sm font-semibold text-neutral-300">
                          R$ {model.preco_medio_usado.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-4 text-sm font-semibold text-neutral-400">
                          R$ {model.preco_medio_novo.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-4 text-sm font-bold text-orange-400">
                          R$ {model.valor_base_upgrade.toLocaleString('pt-BR')}
                        </td>
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
