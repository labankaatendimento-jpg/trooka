'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, MessageCircle, MapPin, Star, Clock, 
  ArrowLeft, Coins, Smartphone, HelpCircle, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { dbService, UpgradeRequest, Offer } from '@/services/dbService';

export default function OfertasCliente() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.request_id as string;

  const [request, setRequest] = useState<UpgradeRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptedOffer, setAcceptedOffer] = useState<Offer | null>(null);

  // Poll for new offers every 3 seconds
  useEffect(() => {
    if (!requestId) return;

    const fetchData = async () => {
      try {
        const req = await dbService.getUpgradeRequest(requestId);
        if (req) {
          setRequest(req);
        }

        const rawOffers = await dbService.getOffersByRequest(requestId);
        setOffers(rawOffers);

        const accepted = rawOffers.find(o => o.status === 'accepted');
        if (accepted) {
          setAcceptedOffer(accepted);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching proposals', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [requestId]);

  const handleAcceptOffer = async (offerId: string) => {
    setAcceptingId(offerId);
    try {
      const accepted = await dbService.acceptOffer(offerId);
      setAcceptedOffer(accepted);
      
      // Update list
      const rawOffers = await dbService.getOffersByRequest(requestId);
      setOffers(rawOffers);
    } catch (err) {
      console.error(err);
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#f5f5f7] flex items-center justify-center">
        <div className="flex gap-2 items-center">
          <span className="text-xs text-neutral-400 font-medium">Buscando propostas...</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col items-center justify-center p-6 text-center">
        <Smartphone className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold">Simulação não encontrada</h2>
        <p className="text-sm text-neutral-500 mt-2">Esta solicitação não existe ou foi expirada.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold cursor-pointer"
        >
          Voltar para Início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Glows */}
      <div className="ambient-glow-orange top-[-10%] left-[-10%] opacity-40" />
      <div className="ambient-glow-orange bottom-[-10%] right-[-10%] opacity-20" />
      <div className="ambient-neon-lines" />

      {/* HEADER */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between border-b border-neutral-900/60 bg-black/40 backdrop-blur-sm">
        <button
          onClick={() => router.push('/')}
          className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <span className="text-md font-bold tracking-tight text-white flex items-center gap-1.5">
          <span className="text-orange-500 font-extrabold text-xl">T</span> TROOKA
        </span>
        <div className="w-12" /> {/* alignment spacer */}
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Upgrade Details */}
        <section className="glass-card rounded-3xl p-6 border-neutral-900/60 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-850 text-neutral-400 text-[10px] font-bold uppercase tracking-wider mb-3">
              Resumo da simulação
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight">
              Upgrade para o {request.modelo_desejado_nome}
            </h2>
            <p className="text-xs text-neutral-500 mt-2">
              Seu iPhone de troca: <span className="text-neutral-300 font-semibold">{request.modelo_atual_nome}</span> • Estado: <span className="text-neutral-300 font-semibold capitalize">{request.estado_aparelho}</span>
            </p>
          </div>
          <div className="flex md:justify-end gap-6 text-xs border-t md:border-t-0 md:border-l border-neutral-900 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase font-bold">Estimativa do usado</span>
              <span className="text-lg font-extrabold text-orange-500">R$ {request.valor_estimado.toLocaleString('pt-BR')}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase font-bold">Diferença estimada</span>
              <span className="text-lg font-extrabold text-neutral-250">R$ {request.diferenca_estimada.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </section>

        {/* Proposals listing header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-bold text-neutral-100 flex items-center gap-2">
              Propostas das Lojas
              {offers.length > 0 && (
                <span className="text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-bold">
                  {offers.length} recebidas
                </span>
              )}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">As ofertas atualizam automaticamente em tempo real.</p>
          </div>
        </div>

        {/* PROPOSALS LIST */}
        <section className="space-y-4">
          <AnimatePresence>
            {acceptedOffer ? (
              /* Success visual card if user accepted a proposal */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_20px_40px_rgba(16,185,129,0.1)]"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-9 h-9 animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white">Parabéns! Upgrade Fechado!</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Você escolheu a melhor proposta para seu upgrade. O contato completo da loja parceira foi liberado abaixo.
                  </p>
                </div>

                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-900 space-y-4 max-w-md mx-auto text-left">
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase font-bold">Loja Escolhida</span>
                    <h4 className="text-md font-bold text-white mt-0.5">{acceptedOffer.store?.nome}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block">Endereço da loja:</span>
                      <span className="text-neutral-350 font-semibold">{acceptedOffer.store?.endereco}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Diferença a pagar:</span>
                      <span className="text-emerald-400 font-bold text-sm">R$ {acceptedOffer.diferenca.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  {acceptedOffer.store?.whatsapp && (
                    <a
                      href={`https://wa.me/${acceptedOffer.store.whatsapp}?text=Olá! Aceitei sua proposta na Trooka para o meu ${request.modelo_atual_nome}. Valor do usado: R$ ${acceptedOffer.valor_aparelho.toLocaleString('pt-BR')}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" /> Conversar no WhatsApp da Loja
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              offers.length > 0 ? (
                offers.map(off => (
                  <motion.div
                    key={off.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="glass-card border-neutral-900 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
                  >
                    {/* Store Meta */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-[15px] font-bold text-white">{off.store?.nome || 'Parceiro Trooka'}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">{off.store ? `${off.store.cidade} / ${off.store.estado}` : 'Local parceiro'}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-medium">
                        <span className="flex items-center gap-1 text-orange-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {off.store?.avaliacao_media?.toFixed(2) || '4.8'}
                        </span>
                        <span className="flex items-center gap-1 text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          responde em {off.store?.tempo_resposta || '12'} min
                        </span>
                      </div>
                    </div>

                    {/* Offer Pricing */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-neutral-500 block text-[9px] uppercase font-bold">Pelo seu usado</span>
                        <span className="text-neutral-200 font-bold">R$ {off.valor_aparelho.toLocaleString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[9px] uppercase font-bold">Diferença</span>
                        <span className="text-orange-500 font-extrabold text-sm">R$ {off.diferenca.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex md:justify-end">
                      <button
                        onClick={() => handleAcceptOffer(off.id)}
                        disabled={acceptingId === off.id}
                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {acceptingId === off.id ? 'Processando...' : 'Aceitar Proposta'}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                /* Loading simulated polling state */
                <div className="text-center py-20 bg-neutral-950/20 rounded-3xl border border-neutral-900 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <Clock className="w-10 h-10 text-neutral-700 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-400">Aguardando ofertas dos lojistas parceiros...</h3>
                  <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                    Sua simulação está disponível no portal dos lojistas de {request.cidade}. Em poucos instantes novas propostas aparecerão aqui.
                  </p>
                </div>
              )
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 border-t border-neutral-900/60 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Trooka. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link href="/privacidade" className="hover:text-neutral-300 transition-colors">Privacidade</Link>
          <Link href="/termos" className="hover:text-neutral-300 transition-colors">Termos de Uso</Link>
        </div>
      </footer>

    </div>
  );
}
