'use client';

import React, { useState, useEffect } from 'react';
import { dbService, UpgradeRequest } from '@/services/dbService';
import Link from 'next/link';
import { Search, Eye, ArrowRight, ArrowDownUp, Download } from 'lucide-react';

export default function AdminSimulacoes() {
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [filtered, setFiltered] = useState<UpgradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const allReqs = await dbService.getAllUpgradeRequests();
        setRequests(allReqs);
        setFiltered(allReqs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let result = requests;
    
    if (filterType === 'venda') {
      result = result.filter(r => !r.modelo_desejado_id);
    } else if (filterType === 'upgrade') {
      result = result.filter(r => !!r.modelo_desejado_id);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(r => 
        r.modelo_atual_nome.toLowerCase().includes(lower) ||
        r.cidade.toLowerCase().includes(lower) ||
        r.id.toLowerCase().includes(lower)
      );
    }

    setFiltered(result);
  }, [searchTerm, filterType, requests]);

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    
    // Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Data,Cidade,Estado,Modelo Atual,Condição,Modelo Desejado,Valor Estimado,Diferença Estimada,Telefone,Status\n";
    
    // Rows
    filtered.forEach(req => {
      const row = [
        req.id,
        new Date(req.created_at).toLocaleDateString('pt-BR'),
        `"${req.cidade}"`,
        req.estado,
        `"${req.modelo_atual_nome}"`,
        req.estado_aparelho,
        req.modelo_desejado_nome ? `"${req.modelo_desejado_nome}"` : 'Venda Direta',
        req.valor_estimado,
        req.diferenca_estimada || 0,
        req.telefone_cliente,
        req.status
      ];
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trooka_simulacoes_${new Date().getTime()}.csv`);
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Todas as Simulações</h1>
          <p className="text-xs text-neutral-500 font-semibold mt-1">Histórico completo de intenções de venda e upgrade</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por ID, modelo ou cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-orange-500 w-full md:w-64"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">Todos os Tipos</option>
            <option value="venda">Somente Venda</option>
            <option value="upgrade">Somente Upgrade</option>
          </select>

          <button 
            onClick={handleExportCSV}
            className="bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-orange-500 text-xs rounded-xl px-4 py-2.5 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      <div className="glass-card border-neutral-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-900 bg-neutral-950/50">
                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Data / ID</th>
                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Cliente (Local)</th>
                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Aparelho do Cliente</th>
                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Operação</th>
                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-[10px] font-bold text-neutral-500 uppercase tracking-wider text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/50">
              {filtered.map(req => {
                const date = new Date(req.created_at);
                const isUpgrade = !!req.modelo_desejado_id;
                
                return (
                  <tr key={req.id} className="hover:bg-neutral-900/20 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-semibold text-neutral-200">{date.toLocaleDateString('pt-BR')}</p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">#{req.id.toUpperCase()}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-neutral-200">{req.cidade}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{req.estado}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-neutral-200">{req.modelo_atual_nome}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 capitalize">Est: {req.estado_aparelho.replace('_', ' ')}</p>
                    </td>
                    <td className="p-4">
                      {isUpgrade ? (
                        <div>
                          <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase mb-1">
                            <ArrowDownUp className="w-3 h-3" /> Upgrade
                          </span>
                          <p className="text-xs text-neutral-300 font-semibold">{req.modelo_desejado_nome}</p>
                        </div>
                      ) : (
                        <span className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          Venda Direta
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                        req.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        req.status === 'offers_available' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/admin/simulacoes/${req.id}`}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-orange-500 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 text-sm">
                    Nenhuma simulação encontrada com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
