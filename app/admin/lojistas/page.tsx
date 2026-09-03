'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { Store } from '@/lib/mockData';
import { Search, CheckCircle, XCircle, Store as StoreIcon, Phone, Mail, MapPin, Coins } from 'lucide-react';

export default function AdminLojistas() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filtered, setFiltered] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, pending, active, suspended

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setIsLoading(true);
    try {
      const allStores = await dbService.getStores();
      setStores(allStores);
      setFiltered(allStores);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = stores;
    
    if (filterType !== 'all') {
      result = result.filter(s => s.status === filterType);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.nome.toLowerCase().includes(lower) ||
        s.cidade.toLowerCase().includes(lower) ||
        s.email.toLowerCase().includes(lower)
      );
    }

    setFiltered(result);
  }, [searchTerm, filterType, stores]);

  const handleUpdateStatus = async (id: string, newStatus: 'active' | 'suspended') => {
    try {
      await dbService.updateStore(id, { status: newStatus });
      // Reload stores to reflect changes
      await loadStores();
    } catch (err) {
      console.error('Failed to update store status', err);
      alert('Erro ao atualizar status do lojista.');
    }
  };

  const handleAddCredits = async (id: string, currentCredits: number) => {
    const amountStr = prompt(`Quantos créditos deseja adicionar à loja? (Saldo atual: ${currentCredits})`);
    if (!amountStr) return;
    
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      return alert('Quantidade inválida. Digite um número maior que zero.');
    }
    
    try {
      await dbService.addCreditsToStore(id, amount);
      await loadStores();
      alert(`Foram adicionados ${amount} créditos com sucesso!`);
    } catch (err) {
      console.error('Failed to add credits', err);
      alert('Erro ao adicionar créditos.');
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Lojistas Parceiros</h1>
          <p className="text-xs text-neutral-500 font-semibold mt-1">Gerencie a lista de espera e os lojistas ativos</p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-900/50 p-1.5 rounded-xl border border-neutral-800/50">
          {['all', 'pending', 'active', 'suspended'].map((type) => {
            const count = type === 'all' ? stores.length : stores.filter(s => s.status === type).length;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all flex items-center gap-2 ${
                  filterType === type 
                    ? 'bg-neutral-800 text-white shadow-sm' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span>{type === 'all' ? 'Todos' : type === 'pending' ? 'Lista de Espera' : type === 'active' ? 'Ativos' : 'Suspensos'}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  filterType === type ? 'bg-neutral-700 text-white' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome, cidade ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900/50 border border-neutral-800/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* Lista de Lojistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(store => (
          <div key={store.id} className="glass-card rounded-2xl p-5 border border-neutral-900/60 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
                  <StoreIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1" title={store.nome}>{store.nome}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{store.cidade} - {store.estado}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                store.status === 'active' ? 'bg-green-500/10 text-green-400' :
                store.status === 'pending' ? 'bg-orange-500/10 text-orange-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {store.status === 'pending' ? 'Espera' : store.status}
              </span>
            </div>

            <div className="space-y-2 mb-6 flex-1">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate" title={store.email}>{store.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Phone className="w-3.5 h-3.5" />
                <span>{store.telefone}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-4 border-t border-neutral-800/50 flex gap-2 mt-auto">
              {store.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(store.id, 'active')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" /> Aprovar
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(store.id, 'suspended')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Rejeitar
                  </button>
                </>
              )}
              {store.status === 'active' && (
                <div className="w-full flex gap-2 flex-col">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(store.id, 'suspended')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" /> Suspender
                    </button>
                    <button 
                      onClick={() => handleAddCredits(store.id, store.creditos || 0)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <Coins className="w-4 h-4" /> + Créditos
                    </button>
                  </div>
                  <div className="text-center text-[10px] text-neutral-500 font-semibold mt-1 bg-neutral-900/50 py-1 rounded-md">
                    Saldo atual: {store.creditos || 0} créditos
                  </div>
                </div>
              )}
              {store.status === 'suspended' && (
                <button 
                  onClick={() => handleUpdateStatus(store.id, 'active')}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Reativar
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-500 text-sm">
            Nenhum lojista encontrado com esses filtros.
          </div>
        )}
      </div>
    </div>
  );
}
