'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Smartphone, Scale, Store as StoreIcon, 
  LogOut, Plus, Edit, Trash, Check, X, ShieldAlert 
} from 'lucide-react';
import { dbService } from '@/services/dbService';
import { IphoneModel, Store, PriceRule } from '@/lib/mockData';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'rules' | 'stores'>('overview');
  
  // Dashboard states
  const [stats, setStats] = useState({
    totalSimulations: 0,
    totalStores: 0,
    activeStores: 0,
    pendingStores: 0,
    totalProposals: 0,
    conversionRate: 0,
  });

  const [models, setModels] = useState<IphoneModel[]>([]);
  const [rules, setRules] = useState<PriceRule[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  // Form states
  const [showModelForm, setShowModelForm] = useState(false);
  const [modelForm, setModelForm] = useState({
    modelo: '',
    armazenamento: '128GB',
    ano: 2024,
    preco_medio_novo: 0,
    preco_medio_usado: 0,
    valor_base_upgrade: 0,
  });

  useEffect(() => {
    // Check admin session
    const isLogged = sessionStorage.getItem('trooka_admin_session');
    if (!isLogged) {
      router.push('/admin/login');
      return;
    }

    const loadData = async () => {
      try {
        const adminStats = await dbService.getAdminStats();
        setStats(adminStats);

        const allModels = await dbService.getIphoneModels();
        setModels(allModels);

        const allRules = await dbService.getPriceRules();
        setRules(allRules);

        const allStores = await dbService.getStores();
        setStores(allStores);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('trooka_admin_session');
    router.push('/admin/login');
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dbService.addIphoneModel({
        marca: 'Apple',
        modelo: modelForm.modelo,
        armazenamento: modelForm.armazenamento,
        ano: Number(modelForm.ano),
        preco_medio_novo: Number(modelForm.preco_medio_novo),
        preco_medio_usado: Number(modelForm.preco_medio_usado),
        valor_base_upgrade: Number(modelForm.valor_base_upgrade),
        status: 'active'
      });

      // Reload
      const allModels = await dbService.getIphoneModels();
      setModels(allModels);
      setShowModelForm(false);
      setModelForm({ modelo: '', armazenamento: '128GB', ano: 2024, preco_medio_novo: 0, preco_medio_usado: 0, valor_base_upgrade: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRuleMultiplier = async (id: string, valueStr: string) => {
    const val = parseFloat(valueStr);
    if (isNaN(val) || val < 0 || val > 2) return;
    try {
      await dbService.updatePriceRule(id, val);
      const allRules = await dbService.getPriceRules();
      setRules(allRules);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeStoreStatus = async (storeId: string, newStatus: 'active' | 'suspended') => {
    try {
      await dbService.updateStore(storeId, { status: newStatus });
      const allStores = await dbService.getStores();
      setStores(allStores);

      const adminStats = await dbService.getAdminStats();
      setStats(adminStats);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex relative overflow-hidden select-none">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-neutral-900 flex flex-col justify-between py-8 px-4 bg-neutral-950/60 backdrop-blur-md z-10">
        <div className="space-y-8">
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 px-3">
            <span className="text-orange-500 font-extrabold text-2xl">T</span> TROOKA
            <span className="text-[10px] text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded-md ml-1.5 uppercase">
              Admin
            </span>
          </span>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral' },
              { id: 'models', icon: Smartphone, label: 'Banco de Modelos' },
              { id: 'rules', icon: Scale, label: 'Regras & Multiplicadores' },
              { id: 'stores', icon: StoreIcon, label: 'Lojas Parceiras' },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold cursor-pointer ${
                    isSelected ? 'text-white bg-neutral-900 border border-neutral-850 shadow-[0_0_15px_rgba(255,94,0,0.02)]' : 'text-neutral-500 hover:text-neutral-350'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-600 hover:text-rose-500 transition-colors font-semibold text-sm cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sair do Painel
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto px-8 py-8 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Painel Administrativo</h1>
              <p className="text-xs text-neutral-500 font-semibold mt-1">Status operacional da plataforma</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Simulações totais', value: stats.totalSimulations, desc: 'desde a inauguração' },
                { title: 'Lojas ativas', value: `${stats.activeStores}/${stats.totalStores}`, desc: `${stats.pendingStores} aprovações pendentes` },
                { title: 'Propostas enviadas', value: stats.totalProposals, desc: 'leads totais' },
                { title: 'Taxa de conversão', value: `${stats.conversionRate}%`, desc: 'leads aceitos por clientes' },
              ].map((card, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-5 border border-neutral-900/60">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{card.title}</p>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">{card.value}</h2>
                  <p className="text-[10px] text-neutral-600 font-medium mt-1">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Simulated graph or detail list */}
            <div className="glass-card rounded-3xl p-6 border border-neutral-900/60 space-y-4">
              <h3 className="text-sm font-bold text-neutral-350">Instruções de IA e Configuração</h3>
              <p className="text-xs text-neutral-450 leading-relaxed max-w-2xl">
                O Project Atlas utiliza uma IA de conversação encapsulada (Supabase e local) estruturada exclusivamente para guiar a simulação de upgrade. Os pesos de depreciação de tela quebrada, reparos e estado geral são consumidos diretamente da aba de Regras.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: DATABASE OF MODELS */}
        {activeTab === 'models' && (
          <div className="space-y-6">
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

            {/* Model form drop down */}
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

            {/* Models Table alternative cards view */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {models.map(model => (
                <div key={model.id} className="glass-card border-neutral-900 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
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
        )}

        {/* TAB 3: PRICE RULES */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Regras & Multiplicadores</h1>
              <p className="text-xs text-neutral-500 font-semibold mt-1">Multiplicadores do estado físico do aparelho</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rules.map(rule => (
                <div key={rule.id} className="glass-card border-neutral-900 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-neutral-200">{rule.nome}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Multiplicador da estimativa base</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="2"
                      value={rule.percentual}
                      onChange={e => handleUpdateRuleMultiplier(rule.id, e.target.value)}
                      className="w-20 bg-neutral-900 text-neutral-100 text-center px-2 py-2 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-xs transition-colors font-bold"
                    />
                    <span className="text-xs text-neutral-500 font-bold">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PARTNER STORES */}
        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Lojas Parceiras</h1>
              <p className="text-xs text-neutral-500 font-semibold mt-1">Gerenciamento de credenciados na plataforma</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stores.map(store => (
                <div 
                  key={store.id} 
                  className={`glass-card rounded-2xl p-5 border flex flex-col justify-between min-h-[200px] ${
                    store.status === 'pending' ? 'border-amber-500/20' : 'border-neutral-900'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-bold text-neutral-100">{store.nome}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">{store.cidade} / {store.estado}</p>
                    </div>

                    {store.status === 'active' && (
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        ATIVO
                      </span>
                    )}
                    {store.status === 'suspended' && (
                      <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        SUSPENSO
                      </span>
                    )}
                    {store.status === 'pending' && (
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        PENDENTE
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-neutral-950 mt-4">
                    <div>
                      <span className="text-neutral-500 block text-[9px] uppercase font-bold">WhatsApp</span>
                      <span className="text-neutral-300 font-semibold">{store.whatsapp}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[9px] uppercase font-bold">Créditos</span>
                      <span className="text-neutral-300 font-semibold">{store.creditos}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-neutral-950 mt-4">
                    {store.status !== 'active' ? (
                      <button
                        onClick={() => handleChangeStoreStatus(store.id, 'active')}
                        className="bg-emerald-600/10 border border-emerald-500/25 hover:bg-emerald-600/20 text-emerald-400 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Ativar Loja
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChangeStoreStatus(store.id, 'suspended')}
                        className="bg-rose-600/10 border border-rose-500/25 hover:bg-rose-600/20 text-rose-400 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Suspender Loja
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
