'use client';

import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '@/services/dbService';
import { IphoneModel, PriceRule } from '@/lib/mockData';
import InternalSimulator from '@/components/admin/InternalSimulator';
import { Upload, Download } from 'lucide-react';
import Papa from 'papaparse';

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
      // Remove BOM if present
      const cleanText = text.replace(/^\uFEFF/, '').trim();
      
      Papa.parse(cleanText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase(),
        complete: async (results) => {
          const parsedModels: Partial<IphoneModel>[] = [];
          
          results.data.forEach((row: any) => {
            // Helper para converter "R$ 3.500,00", "3.500,00" ou "3500" para número
            const parseNumber = (val: string) => {
              if (!val) return undefined;
              const match = val.toString().match(/[\d,.]+/);
              if (!match) return undefined;
              let clean = match[0].replace(/\./g, '').replace(',', '.');
              const num = parseFloat(clean);
              return isNaN(num) ? undefined : num;
            };

            const rawModelo = row.modelo?.toString().trim() || row['modelo do aparelho']?.toString().trim() || '';
            // Remove "Apple " do início para evitar duplicação (Apple iPhone XR vs iPhone XR)
            const modelo = rawModelo.replace(/^apple\s+/i, '').trim();

            let armazenamento = row.armazenamento?.toString().trim() || row.capacidade?.toString().trim();
            if (armazenamento && /^\d+$/.test(armazenamento)) {
              armazenamento = `${armazenamento}GB`;
            }

            let valUsado = parseNumber(row.preco_medio_usado) ?? parseNumber(row['valor usado']) ?? parseNumber(row['valor de compra']);
            let valNovo = parseNumber(row.preco_medio_novo) ?? parseNumber(row.valor_venda) ?? parseNumber(row['valor de venda']);
            
            const estado = row.estado?.toString().trim().toUpperCase();
            
            // Se as colunas não forem exatas, tenta usar a coluna de estado para direcionar o valor genérico
            if (estado) {
               let genericVal = parseNumber(row.valor) ?? parseNumber(row.preço) ?? parseNumber(row.preco) ?? parseNumber(row['valor usado']) ?? parseNumber(row['valor_venda']) ?? parseNumber(row['valor de compra']) ?? parseNumber(row['valor de venda']);
               
               if (genericVal !== undefined) {
                   if (estado.includes('SEMI') || estado.includes('NOVO')) {
                       valNovo = genericVal;
                   } else if (estado.includes('USADO')) {
                       valUsado = genericVal;
                   }
               }
            }

            const valBase = parseNumber(row.valor_base_upgrade) ?? valUsado;
            const ano = parseInt(row.ano);
            
            if (modelo && armazenamento) {
              parsedModels.push({
                marca: row.marca || 'Apple',
                modelo: modelo,
                armazenamento: armazenamento,
                ...(ano ? { ano } : {}),
                ...(valUsado !== undefined ? { preco_medio_usado: valUsado } : {}),
                ...(valNovo !== undefined ? { preco_medio_novo: valNovo } : {}),
                ...(valBase !== undefined ? { valor_base_upgrade: valBase } : {})
              });
            }
          });

          if (parsedModels.length > 0) {
            try {
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
            } catch (err) {
              console.error(err);
              alert("Erro ao salvar os dados no banco.");
            }
          } else {
            alert(`Nenhum dado válido encontrado. Colunas detectadas: ${results.meta.fields?.join(' | ')}. Verifique se as colunas estão corretas.`);
          }
          
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        error: (err: any) => {
          console.error(err);
          alert("Erro ao ler o CSV com o PapaParse.");
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      });
      return; // PapaParse is async when we use callback, so we handle state inside.

    } catch (error) {
      console.error(error);
      alert("Erro ao processar planilha.");
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
