'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dbService, UpgradeRequest } from '@/services/dbService';
import { ArrowLeft, Smartphone, Calculator, AlertCircle, ArrowDownUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminSimulacaoDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [request, setRequest] = useState<UpgradeRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dbService.getUpgradeRequest(id);
        setRequest(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.back()} className="text-neutral-500 hover:text-white flex items-center gap-2 text-sm font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="glass-card rounded-2xl p-8 border-rose-500/20 bg-rose-500/5 text-center">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Simulação não encontrada</h2>
          <p className="text-xs text-neutral-400 mt-1">O ID #{id} não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  const isUpgrade = !!request.modelo_desejado_id;
  const date = new Date(request.created_at);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-orange-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Simulação <span className="text-orange-500">#{request.id.toUpperCase()}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
              request.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              request.status === 'offers_available' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-neutral-800 text-neutral-400 border-neutral-700'
            }`}>
              {request.status.replace('_', ' ')}
            </span>
          </h1>
          <p className="text-xs text-neutral-500 font-semibold mt-1">
            Realizada em {date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Aparelho do Cliente */}
        <div className="glass-card border-neutral-900 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
            <div className="bg-purple-500/20 p-2 rounded-xl">
              <Smartphone className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Aparelho do Cliente</h3>
              <p className="text-xs text-neutral-500">O que o usuário deseja vender/entregar</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[10px] text-neutral-500 font-bold uppercase mb-1">Modelo Selecionado</span>
              <p className="text-sm font-semibold text-neutral-200">{request.modelo_atual_nome}</p>
            </div>
            <div>
              <span className="block text-[10px] text-neutral-500 font-bold uppercase mb-1">Localidade</span>
              <p className="text-sm font-semibold text-neutral-200">{request.cidade} / {request.estado}</p>
            </div>
            <div>
              <span className="block text-[10px] text-neutral-500 font-bold uppercase mb-1">Estado Físico</span>
              <p className="text-sm font-semibold text-neutral-200 capitalize">{request.estado_aparelho.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="block text-[10px] text-neutral-500 font-bold uppercase mb-1">Telefone (Lead)</span>
              <p className="text-sm font-semibold text-neutral-200">{request.telefone_cliente}</p>
            </div>
            {(request.utm_source || request.utm_medium || request.utm_campaign) && (
              <div className="col-span-2 mt-2 pt-4 border-t border-neutral-900/50">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase mb-2">Tracking de Origem (UTM)</span>
                <div className="flex gap-4">
                  {request.utm_source && (
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase">Source</span>
                      <p className="text-xs font-mono text-purple-400">{request.utm_source}</p>
                    </div>
                  )}
                  {request.utm_medium && (
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase">Medium</span>
                      <p className="text-xs font-mono text-purple-400">{request.utm_medium}</p>
                    </div>
                  )}
                  {request.utm_campaign && (
                    <div>
                      <span className="text-[9px] text-neutral-500 uppercase">Campaign</span>
                      <p className="text-xs font-mono text-purple-400">{request.utm_campaign}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Memória de Cálculo */}
        <div className="glass-card border-neutral-900 rounded-3xl p-6 space-y-6 bg-gradient-to-br from-neutral-900/30 to-neutral-950/80">
          <div className="flex items-center gap-3 border-b border-neutral-900 pb-4">
            <div className="bg-orange-500/20 p-2 rounded-xl">
              <Calculator className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Memória de Cálculo</h3>
              <p className="text-xs text-neutral-500">Regras aplicadas exatamente no momento da simulação</p>
            </div>
          </div>

          <div className="space-y-4">
            {request.snapshot ? (
              <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-900/80 space-y-3">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-900/50">
                  <span className="text-neutral-500 font-semibold">Valor Base (Mercado Usado)</span>
                  <span className="text-neutral-300">R$ {request.snapshot.valor_base_upgrade?.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-900/50">
                  <span className="text-neutral-500 font-semibold flex items-center gap-2">
                    Multiplicador da Regra 
                    <span className="bg-neutral-900 text-[9px] px-1.5 py-0.5 rounded text-neutral-400 capitalize">{request.snapshot.regra_estado_nome?.replace('_', ' ')}</span>
                  </span>
                  <span className="text-rose-400 font-bold">x {request.snapshot.regra_estado_multiplicador?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-900/50">
                  <span className="text-neutral-500 font-semibold">Ajuste de Arredondamento (Múltiplos de 50)</span>
                  <span className="text-neutral-400">Automático</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-sm text-neutral-400 font-bold uppercase">Valor Final Estimado</span>
                  <span className="text-xl font-extrabold text-emerald-400">R$ {request.valor_estimado?.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-900/80 text-center text-neutral-500 text-sm">
                Esta simulação é antiga e não possui snapshot de memória de cálculo salvo. O valor final estimado foi de <strong className="text-emerald-400">R$ {request.valor_estimado?.toLocaleString('pt-BR')}</strong>.
              </div>
            )}
          </div>
        </div>
      </div>

      {isUpgrade && (
        <div className="glass-card border-neutral-900 rounded-3xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 border-b border-neutral-900 pb-4 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <ArrowDownUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Operação de Upgrade</h3>
              <p className="text-xs text-neutral-500">Troca por um novo aparelho</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-center">
              <span className="block text-[10px] text-neutral-500 font-bold uppercase mb-2">Aparelho Atual</span>
              <p className="text-sm font-semibold text-neutral-300">{request.modelo_atual_nome}</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">Entra por: R$ {request.valor_estimado?.toLocaleString('pt-BR')}</p>
            </div>
            
            <div className="px-4 text-neutral-700">
              <ArrowRight className="w-6 h-6" />
            </div>

            <div className="text-center">
              <span className="block text-[10px] text-neutral-500 font-bold uppercase mb-2">Aparelho Desejado</span>
              <p className="text-sm font-semibold text-orange-400">{request.modelo_desejado_nome}</p>
              {request.snapshot && (
                <p className="text-xs font-bold text-neutral-400 mt-1">Preço Novo: R$ {request.snapshot.preco_mercado_novo?.toLocaleString('pt-BR')}</p>
              )}
            </div>
          </div>

          <div className="mt-8 bg-neutral-950 p-4 rounded-2xl border border-neutral-900 flex justify-between items-center">
            <span className="text-sm text-neutral-400 font-bold uppercase">Diferença Estimada a Pagar</span>
            <span className="text-2xl font-extrabold text-white">R$ {request.diferenca_estimada?.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      )}

    </div>
  );
}
