'use client';

import React, { useState, useEffect } from 'react';
import { dbService, AdminLog } from '@/services/dbService';
import { AlertTriangle, Clock, History, Activity } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await dbService.getAdminLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Activity className="w-6 h-6 text-orange-500" />
          Logs de Atividade
        </h1>
        <p className="text-xs text-neutral-500 font-semibold mt-1">Histórico de alterações de regras, preços e catálogos do painel</p>
      </div>

      <div className="glass-card border-neutral-900 rounded-2xl overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <History className="w-12 h-12 text-neutral-800 mb-4" />
            <h3 className="text-lg font-bold text-neutral-400">Nenhum log registrado</h3>
            <p className="text-sm text-neutral-600 mt-2">As alterações feitas no painel administrativo aparecerão aqui.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-900/50">
            {logs.map((log) => {
              const date = new Date(log.created_at);
              return (
                <div key={log.id} className="p-5 hover:bg-neutral-900/20 transition-colors flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800">
                    <Clock className="w-4 h-4 text-neutral-500" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">{log.acao}</span>
                      <span className="text-[10px] text-neutral-600">ID: {log.id}</span>
                    </div>
                    <p className="text-sm text-neutral-300 font-semibold mb-1">
                      O item <strong className="text-white">{log.item_alterado}</strong> foi modificado.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono bg-neutral-950 p-2 rounded-lg border border-neutral-900 inline-flex mt-1">
                      <span className="text-rose-400 line-through">{log.valor_anterior}</span>
                      <span className="text-neutral-500">→</span>
                      <span className="text-emerald-400 font-bold">{log.novo_valor}</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end shrink-0">
                    <span className="text-sm font-bold text-neutral-400">{date.toLocaleDateString('pt-BR')}</span>
                    <span className="text-xs text-neutral-600">{date.toLocaleTimeString('pt-BR')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
