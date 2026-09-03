'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, MessageSquare, User, Tag, 
  Coins, Settings, LogOut, CheckCircle, Clock, 
  MapPin, Send, RefreshCw, X, MessageCircle 
} from 'lucide-react';
import { dbService, UpgradeRequest, Offer, CreditTx } from '@/services/dbService';
import { Store, IphoneModel } from '@/lib/mockData';

export default function LojistaDashboard() {
  const router = useRouter();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<{ creditos: number; recebidas: number; enviadas: number; aceitas: number; avaliacao_media: number }>({ creditos: 0, recebidas: 0, enviadas: 0, aceitas: 0, avaliacao_media: 5.0 });
  const [activeTab, setActiveTab] = useState<'requests' | 'my-offers'>('requests');
  const [menuSelection, setMenuSelection] = useState('Dashboard');
  
  // Extra data states
  const [creditHistory, setCreditHistory] = useState<CreditTx[]>([]);
  const [iphoneModels, setIphoneModels] = useState<IphoneModel[]>([]);
  
  // Slide-over states
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(null);
  const [valAparelho, setValAparelho] = useState('');
  const [valNovo, setValNovo] = useState('');
  const [observacao, setObservacao] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/lojista/login');
          return;
        }

        const stores = await dbService.getStores();
        const currentStore = stores.find(s => s.auth_user_id === user.id) || null;
        
        if (!currentStore) {
          router.push('/lojista/login');
          return;
        }

        const id = currentStore.id;
        setStoreId(id);
        setStore(currentStore);

        const activeReqs = await dbService.getActiveRequestsForStore(id);
        setRequests(activeReqs);

        const offers = await dbService.getLojistaOffers(id);
        setMyOffers(offers);

        const currentStats = await dbService.getLojistaStats(id);
        setStats(currentStats);

        const history = await dbService.getLojistaCreditsHistory(id);
        setCreditHistory(history);

        const models = await dbService.getIphoneModels();
        setIphoneModels(models);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/lojista/login');
  };

  const handleOpenProposta = (req: UpgradeRequest) => {
    setSelectedRequest(req);
    // Prefill with base values
    setValAparelho(req.valor_estimado.toString());
    setValNovo((req.valor_estimado + req.diferenca_estimada).toString());
    setObservacao('Valor aproximado sujeito a confirmação técnica presencial.');
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !storeId) return;
    setSubmitting(true);

    const apVal = parseFloat(valAparelho);
    const newVal = parseFloat(valNovo);
    const diff = newVal - apVal;

    try {
      await dbService.createOffer({
        request_id: selectedRequest.id,
        store_id: storeId,
        valor_aparelho: apVal,
        valor_novo: newVal,
        diferenca: diff,
        observacao,
      });

      // Refresh offers and requests
      const offers = await dbService.getLojistaOffers(storeId);
      setMyOffers(offers);
      
      const activeReqs = await dbService.getActiveRequestsForStore(storeId);
      setRequests(activeReqs);

      const currentStats = await dbService.getLojistaStats(storeId);
      setStats(currentStats);

      setSelectedRequest(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar proposta. Verifique se você possui créditos suficientes e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDifference = () => {
    const apVal = parseFloat(valAparelho) || 0;
    const newVal = parseFloat(valNovo) || 0;
    return (newVal - apVal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex relative overflow-hidden select-none">
      
      {/* LEFT MENU (SMALL SIDEBAR) */}
      <aside className="w-16 sm:w-20 border-r border-neutral-900 flex flex-col items-center justify-between py-6 z-10 bg-neutral-950/60 backdrop-blur-md">
        <div className="flex flex-col items-center gap-8 w-full">
          <svg viewBox="0 0 24 24" className="w-8 h-8 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="t-gradient-dash" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
              <linearGradient id="t-highlight-dash" x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fdf4ff" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-gradient-dash)" />
            <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6C22 7.65685 20.6569 9 19 9H15V19C15 20.6569 13.6569 22 12 22C10.3431 22 9 20.6569 9 19V9H5C3.34315 9 2 7.65685 2 6Z" fill="url(#t-highlight-dash)" />
          </svg>
          
          <nav className="flex flex-col gap-5 w-full items-center">
            {[
              { icon: LayoutDashboard, label: 'Dashboard' },
              { icon: MessageSquare, label: 'Solicitações' },
              { icon: User, label: 'Meu Perfil' },
              { icon: Tag, label: 'Tabela de Preços' },
              { icon: Coins, label: 'Créditos' },
              { icon: Settings, label: 'Configurações' },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = menuSelection === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setMenuSelection(item.label)}
                  title={item.label}
                  className={`p-3 rounded-2xl transition-all duration-300 relative group cursor-pointer ${
                    isSelected ? 'text-purple-500 bg-neutral-900 border border-neutral-850' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {/* Tooltip */}
                  <span className="absolute left-16 bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-semibold px-2 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="p-3 rounded-2xl text-neutral-600 hover:text-rose-500 transition-colors cursor-pointer"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 overflow-y-auto px-6 py-8 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-900 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {store?.nome || 'Minha Loja'}
            </h1>
            <p className="text-xs text-neutral-400 font-medium mt-1">
              Painel do Lojista • {store?.cidade} / {store?.estado}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-500 font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
              <Coins className="w-4 h-4" />
              {stats.creditos} créditos
            </span>
          </div>
        </header>

        {/* CONDITIONAL RENDERING BASED ON MENU */}

        {/* --- VIEW: DASHBOARD --- */}
        {menuSelection === 'Dashboard' && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { title: 'Solicitações recebidas', value: stats.recebidas, desc: 'na sua região' },
              { title: 'Ofertas enviadas', value: stats.enviadas, desc: 'propostas totais' },
              { title: 'Créditos disponíveis', value: stats.creditos, desc: 'para fechar leads' },
              { title: 'Avaliação média', value: `${stats.avaliacao_media.toFixed(2)} ★`, desc: 'pontuação da loja' },
            ].map((card, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-neutral-900/60">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{card.title}</p>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">{card.value}</h2>
                <p className="text-[10px] text-neutral-600 font-medium mt-1">{card.desc}</p>
              </div>
            ))}
          </section>
        )}

        {/* --- VIEW: SOLICITAÇÕES --- */}
        {menuSelection === 'Solicitações' && (
          <div className="space-y-6">
            {/* TAB BUTTONS */}
        <div className="flex gap-4 border-b border-neutral-900 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`text-sm font-bold pb-2 transition-all relative cursor-pointer ${
              activeTab === 'requests' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Novas oportunidades ({requests.length})
            {activeTab === 'requests' && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my-offers')}
            className={`text-sm font-bold pb-2 transition-all relative cursor-pointer ${
              activeTab === 'my-offers' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Minhas propostas ({myOffers.length})
            {activeTab === 'my-offers' && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>
        </div>

        {/* TAB VIEW LIST */}
        <section>
          {activeTab === 'requests' && (
            requests.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requests.map(req => {
                  const isSubmitted = myOffers.some(o => o.request_id === req.id);
                  return (
                    <div 
                      key={req.id} 
                      className={`glass-card rounded-2xl p-5 flex flex-col justify-between min-h-[220px] transition-all relative ${
                        isSubmitted ? 'border-purple-500/20' : 'border-neutral-900'
                      }`}
                    >
                      {isSubmitted && (
                        <span className="absolute top-4 right-4 bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[9px] font-bold px-2 py-0.5 rounded-md">
                          PROPOSTA ENVIADA
                        </span>
                      )}
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] text-neutral-500 font-semibold uppercase">Dispositivo do Cliente</p>
                          <h3 className="text-[16px] font-bold text-white mt-0.5">{req.modelo_atual_nome}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase">Upgrade Desejado</p>
                            <p className="text-[12px] font-semibold text-neutral-300">{req.modelo_desejado_nome}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase">Estado Informado</p>
                            <p className="text-[12px] font-semibold text-neutral-300 capitalize">{req.estado_aparelho.replace('_', ' ')}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-2 border-t border-neutral-950">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{req.cidade} / {req.estado}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-950 mt-4">
                        <div className="flex items-center gap-1 text-[10px] text-neutral-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>4 min atrás</span>
                        </div>

                        {!isSubmitted ? (
                          <button
                            onClick={() => handleOpenProposta(req)}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(168,85,247,0.2)] cursor-pointer"
                          >
                            Fazer proposta
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-neutral-900 border border-neutral-850 text-neutral-500 text-xs font-medium px-4 py-2.5 rounded-xl"
                          >
                            Enviado
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-neutral-950/20 rounded-3xl border border-neutral-900 flex flex-col items-center justify-center">
                <Clock className="w-10 h-10 text-neutral-700" />
                <h3 className="text-md font-bold text-neutral-400 mt-4">Nenhuma oportunidade disponível</h3>
                <p className="text-xs text-neutral-500 mt-1.5">Assim que novos clientes fizerem simulações na sua região, eles aparecerão aqui.</p>
              </div>
            )
          )}

          {activeTab === 'my-offers' && (
            myOffers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myOffers.map(off => (
                  <div key={off.id} className="glass-card border-neutral-900 rounded-2xl p-5 flex flex-col justify-between min-h-[220px]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] text-neutral-500 font-semibold uppercase">PROPOSTA #{(off.id).slice(0, 4).toUpperCase()}</span>
                      
                      {off.status === 'accepted' ? (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 animate-pulse">
                          <CheckCircle className="w-3 h-3" /> ACEITO
                        </span>
                      ) : (
                        <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-bold px-2.5 py-1 rounded-md">
                          {off.status === 'pending' ? 'AGUARDANDO CLIENTE' : 'FECHADO'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">Oferecido no usado:</span>
                        <span className="text-white font-bold">R$ {off.valor_aparelho.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-medium">Preço do novo:</span>
                        <span className="text-white font-bold">R$ {off.valor_novo.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="pt-3 border-t border-neutral-900/50 flex justify-between items-center text-sm">
                        <span className="text-neutral-500">Volta do Cliente:</span>
                        <span className="text-purple-400 font-bold">R$ {off.diferenca.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    {off.status === 'accepted' ? (
                      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 text-xs mt-4 space-y-3">
                        <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          O cliente escolheu você!
                        </p>
                        {off.request?.telefone_cliente ? (
                          <a
                            href={`https://wa.me/55${off.request.telefone_cliente}?text=Olá! Sou da ${store?.nome}. Vi que você aceitou nossa proposta na Trooka. Podemos agendar a avaliação presencial?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp do cliente
                          </a>
                        ) : (
                          <p className="text-emerald-400/70">Entre em contato imediatamente para fechar o negócio.</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-[10px] text-neutral-500 font-medium mt-4 pt-3 border-t border-neutral-950 leading-relaxed italic">
                        "{off.observacao}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-neutral-950/20 rounded-3xl border border-neutral-900 flex flex-col items-center justify-center">
                <Send className="w-10 h-10 text-neutral-700" />
                <h3 className="text-md font-bold text-neutral-400 mt-4">Nenhuma proposta enviada</h3>
                <p className="text-xs text-neutral-500 mt-1.5">Faça propostas para os iPhones solicitados e aumente suas vendas.</p>
              </div>
            )
          )}
        </section>
        </div>
        )}

        {/* --- VIEW: MEU PERFIL --- */}
        {menuSelection === 'Meu Perfil' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Meu Perfil</h2>
            <div className="glass-card rounded-2xl p-6 border border-neutral-900/60 max-w-2xl">
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                try {
                  const updatedStore = await dbService.updateStoreProfile(storeId!, {
                    nome: formData.get('nome') as string,
                    cidade: formData.get('cidade') as string,
                    estado: formData.get('estado') as string,
                    telefone: formData.get('telefone') as string,
                    email: formData.get('email') as string,
                  });
                  setStore(updatedStore);
                  alert('Perfil salvo com sucesso!');
                } catch (err) {
                  alert('Erro ao salvar perfil. Certifique-se de que os dados estão corretos.');
                  console.error(err);
                }
              }}>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Nome da Loja</label>
                  <input name="nome" defaultValue={store?.nome} className="w-full bg-neutral-900 text-white px-4 py-3 rounded-xl border border-neutral-800 focus:border-purple-500 outline-none text-sm" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">E-mail de Contato</label>
                    <input name="email" type="email" defaultValue={store?.email} className="w-full bg-neutral-900 text-white px-4 py-3 rounded-xl border border-neutral-800 focus:border-purple-500 outline-none text-sm" placeholder="seu@email.com" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Telefone / WhatsApp</label>
                    <input name="telefone" defaultValue={store?.telefone} className="w-full bg-neutral-900 text-white px-4 py-3 rounded-xl border border-neutral-800 focus:border-purple-500 outline-none text-sm" placeholder="(11) 99999-9999" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Cidade</label>
                    <input name="cidade" defaultValue={store?.cidade} className="w-full bg-neutral-900 text-white px-4 py-3 rounded-xl border border-neutral-800 focus:border-purple-500 outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">Estado (Sigla)</label>
                    <input name="estado" defaultValue={store?.estado} maxLength={2} className="w-full bg-neutral-900 text-white px-4 py-3 rounded-xl border border-neutral-800 focus:border-purple-500 outline-none text-sm uppercase" required />
                  </div>
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl mt-4 w-full">Salvar Alterações</button>
              </form>
            </div>
          </div>
        )}

        {/* --- VIEW: TABELA DE PREÇOS --- */}
        {menuSelection === 'Tabela de Preços' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Tabela de Preços Base (Referência)</h2>
            <div className="glass-card rounded-2xl p-6 border border-neutral-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-neutral-500 text-xs border-b border-neutral-800">
                    <tr>
                      <th className="pb-3 font-semibold uppercase">Modelo</th>
                      <th className="pb-3 font-semibold uppercase">Armazenamento</th>
                      <th className="pb-3 font-semibold uppercase text-right">Valor Usado Base</th>
                      <th className="pb-3 font-semibold uppercase text-right">Valor Novo Base</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-300 divide-y divide-neutral-900">
                    {iphoneModels.map(model => (
                      <tr key={model.id} className="hover:bg-neutral-900/50 transition-colors">
                        <td className="py-4 font-medium text-white">{model.modelo}</td>
                        <td className="py-4">{model.armazenamento}</td>
                        <td className="py-4 text-right">R$ {model.preco_medio_usado.toLocaleString('pt-BR')}</td>
                        <td className="py-4 text-right">R$ {model.preco_medio_novo.toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: CRÉDITOS --- */}
        {menuSelection === 'Créditos' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Meus Créditos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6 border border-purple-500/20 bg-purple-900/10 flex flex-col justify-center items-center text-center">
                <Coins className="w-12 h-12 text-purple-400 mb-4" />
                <p className="text-neutral-400 text-sm font-medium uppercase tracking-wide">Saldo Disponível</p>
                <h3 className="text-5xl font-extrabold text-white my-2">{stats.creditos}</h3>
                <p className="text-xs text-neutral-500 mb-6">Cada crédito permite enviar 1 proposta para um lead.</p>
                
                <div className="bg-neutral-900/80 p-5 rounded-xl border border-neutral-800 w-full text-left">
                  <h4 className="text-sm font-bold text-white mb-3">Comprar Créditos via PIX</h4>
                  <div className="space-y-3 mb-5">
                    <a href="https://wa.me/5511963901079?text=Ol%C3%A1%21%20Gostaria%20de%20comprar%20o%20pacote%20de%205%20cr%C3%A9ditos%20por%20R%2499." target="_blank" rel="noopener noreferrer" className="flex justify-between items-center bg-neutral-950 hover:bg-purple-900/20 border border-neutral-800 hover:border-purple-500/50 p-3 rounded-xl transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">5</div>
                        <span className="font-semibold text-sm text-neutral-200">créditos</span>
                      </div>
                      <span className="font-bold text-emerald-400">R$ 99</span>
                    </a>
                    <a href="https://wa.me/5511963901079?text=Ol%C3%A1%21%20Gostaria%20de%20comprar%20o%20pacote%20de%2025%20cr%C3%A9ditos%20por%20R%24449." target="_blank" rel="noopener noreferrer" className="flex justify-between items-center bg-neutral-950 hover:bg-purple-900/20 border border-neutral-800 hover:border-purple-500/50 p-3 rounded-xl transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">25</div>
                        <span className="font-semibold text-sm text-neutral-200">créditos</span>
                      </div>
                      <span className="font-bold text-emerald-400">R$ 449</span>
                    </a>
                    <a href="https://wa.me/5511963901079?text=Ol%C3%A1%21%20Gostaria%20de%20comprar%20o%20pacote%20de%20100%20cr%C3%A9ditos%20por%20R%241490." target="_blank" rel="noopener noreferrer" className="flex justify-between items-center bg-neutral-950 hover:bg-purple-900/20 border border-neutral-800 hover:border-purple-500/50 p-3 rounded-xl transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">100</div>
                        <span className="font-semibold text-sm text-neutral-200">créditos</span>
                      </div>
                      <span className="font-bold text-emerald-400">R$ 1.490</span>
                    </a>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-xs text-neutral-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10"><Coins className="w-16 h-16" /></div>
                    <p className="font-bold text-purple-400 mb-2 uppercase tracking-wide">Como recarregar?</p>
                    <p className="mb-2 flex items-start gap-2">
                      <span className="bg-purple-500/20 text-purple-400 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                      <span>Faça um PIX para a chave celular: <strong>11963901079</strong></span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="bg-purple-500/20 text-purple-400 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                      <span>Envie o comprovante para o WhatsApp: <a href="https://wa.me/5511963901079" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 hover:underline">11963901079</a></span>
                    </p>
                    <p className="mt-3 text-[10px] text-neutral-500 font-medium">Seus créditos serão liberados pelo administrador assim que o comprovante for validado.</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-neutral-900/60">
                <h3 className="text-sm font-bold text-neutral-300 uppercase mb-4">Histórico de Transações</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {creditHistory.map(tx => (
                    <div key={tx.id} className="flex justify-between items-center p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                      <div>
                        <p className="text-xs font-semibold text-white">{tx.descricao}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{new Date(tx.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                      <span className={`text-sm font-bold ${tx.quantidade > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.quantidade > 0 ? '+' : ''}{tx.quantidade}
                      </span>
                    </div>
                  ))}
                  {creditHistory.length === 0 && (
                    <p className="text-xs text-neutral-500 text-center py-4">Nenhuma transação encontrada.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: CONFIGURAÇÕES --- */}
        {menuSelection === 'Configurações' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Configurações</h2>
            <div className="glass-card rounded-2xl p-6 border border-neutral-900/60 max-w-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-300 mb-3">Notificações</h3>
                <label className="flex items-center gap-3 cursor-pointer mb-2">
                  <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4" />
                  <span className="text-sm text-neutral-400">Receber alertas de novos leads por Email</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4" />
                  <span className="text-sm text-neutral-400">Receber alertas de novos leads no WhatsApp</span>
                </label>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* SLIDE-OVER PANEL FOR MAKING OFFERS */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            {/* Backdrop for Slide-over */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />

            {/* Slide-over panel container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-neutral-950 border-l border-neutral-900 z-50 p-6 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.6)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-6">
                <div>
                  <h3 className="text-md font-bold text-white">Criar Proposta</h3>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Informe seus valores de troca</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-900 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Request Info Box */}
              <div className="bg-neutral-900/50 rounded-2xl p-4 border border-neutral-900 space-y-3 mb-6">
                <div>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase">Dispositivo do Cliente</p>
                  <h4 className="text-[14px] font-bold text-white mt-0.5">{selectedRequest.modelo_atual_nome}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 block">Desejado:</span>
                    <span className="text-neutral-300 font-semibold">{selectedRequest.modelo_desejado_nome}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Estado:</span>
                    <span className="text-neutral-300 font-semibold capitalize">{selectedRequest.estado_aparelho}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-950 text-xs">
                  <span className="text-neutral-500 text-[10px] font-medium block">Diferença a ser paga pelo cliente (Volta)</span>
                  <span className="text-purple-400 font-bold ml-1.5">
                    {formattedDifference()}
                  </span>
                </div>
              </div>

              {/* Offer Form */}
              <form onSubmit={handleSubmitOffer} className="flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-400">
                      Quanto você oferece pelo aparelho usado? (R$)
                    </label>
                    <input
                      type="number"
                      required
                      value={valAparelho}
                      onChange={e => setValAparelho(e.target.value)}
                      className="w-full bg-neutral-900 text-neutral-100 px-4 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-sm transition-colors"
                      placeholder="Ex: 2500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-400">
                      Valor do novo que você venderá (R$)
                    </label>
                    <input
                      type="number"
                      required
                      value={valNovo}
                      onChange={e => setValNovo(e.target.value)}
                      className="w-full bg-neutral-900 text-neutral-100 px-4 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-sm transition-colors"
                      placeholder="Ex: 5990"
                    />
                  </div>

                  {/* Dynamic Difference Display */}
                  <div className="mt-6 flex flex-col items-center justify-center p-4 bg-neutral-900/50 rounded-2xl border border-neutral-800/50">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Volta Estimada do Cliente</span>
                    <span className="text-purple-500 font-extrabold text-lg tracking-tight">
                      {formattedDifference()}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-neutral-400">
                      Observação (Opcional)
                    </label>
                    <textarea
                      value={observacao}
                      onChange={e => setObservacao(e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-900 text-neutral-100 px-4 py-3 rounded-2xl border border-neutral-800 focus:border-orange-500 focus:outline-none text-sm transition-colors resize-none"
                      placeholder="Adicione observações sobre a proposta..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || stats.creditos < 1}
                  className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-0.5 group shadow-[0_4px_25px_rgba(168,85,247,0.3)] mt-6 ${
                    stats.creditos < 1 ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none border border-neutral-700' : 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer disabled:opacity-50'
                  }`}
                >
                  <span>{submitting ? 'Enviando...' : 'Enviar proposta'}</span>
                  {stats.creditos < 1 && !submitting && (
                    <span className="text-[10px] font-medium text-rose-400">Você não possui créditos suficientes</span>
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
