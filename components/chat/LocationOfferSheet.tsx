'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Search, MapPin, Phone, CheckCircle, ShieldAlert, ExternalLink } from 'lucide-react';
import { dbService } from '@/services/dbService';
import { IphoneModel, Store } from '@/lib/mockData';
import { EstimateResult } from '@/utils/calculateEstimate';

interface LocationOfferSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: IphoneModel | null;
  desiredModel: IphoneModel | null;
  condition: 'excelente' | 'bom' | 'marcas' | 'tela_quebrada' | null;
  reparo: 'sim' | 'nao' | 'nao_sei' | null;
  estimate: EstimateResult | null;
}

export default function LocationOfferSheet({
  isOpen,
  onClose,
  currentModel,
  desiredModel,
  condition,
  reparo,
  estimate,
}: LocationOfferSheetProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: Store check, 3: Success
  const [estado, setEstado] = useState('SP');
  const [cidade, setCidade] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCidade('');
      setWhatsapp('');
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Formatting: (XX) XXXXX-XXXX
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setWhatsapp(value);
  };

  const handleNext = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    
    const rawPhone = whatsapp.replace(/\D/g, '');
    if (rawPhone.length < 10) newErrors.whatsapp = 'Digite um WhatsApp válido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Check stores in this location
      const foundStores = await dbService.getStoresByLocation(cidade, estado);
      setStores(foundStores);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!currentModel || !desiredModel || !estimate) return;
    setLoading(true);

    try {
      const rawPhone = whatsapp.replace(/\D/g, '');
      const createdRequest = await dbService.createUpgradeRequest({
        modelo_atual_id: currentModel.id,
        modelo_desejado_id: desiredModel.id,
        modelo_atual_nome: `${currentModel.modelo} ${currentModel.armazenamento}`,
        modelo_desejado_nome: `${desiredModel.modelo} ${desiredModel.armazenamento}`,
        estado_aparelho: condition || 'bom',
        reparo_historico: reparo || 'nao',
        cidade: cidade.trim(),
        estado: estado.toUpperCase().trim(),
        valor_estimado: estimate.valorEstimado,
        diferenca_estimada: estimate.diferencaMedia,
        telefone_cliente: rawPhone,
      });

      // Simulating a real lojista quote generation in mock mode (Phase 5 will add real updates)
      if (stores.length > 0) {
        setTimeout(async () => {
          // Store 1 makes an offer automatically to make demo fluid
          await dbService.createOffer({
            request_id: createdRequest.id,
            store_id: stores[0].id,
            valor_aparelho: estimate.valorEstimado + 150, // offers R$ 150 more
            valor_novo: desiredModel.preco_medio_novo,
            diferenca: desiredModel.preco_medio_novo - (estimate.valorEstimado + 150),
            observacao: 'Consigo fechar hoje! Aparelho sujeito a avaliação técnica presencial.',
          });
        }, 3000);
      }

      setCreatedRequestId(createdRequest.id);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Bottom Sheet container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-neutral-950 border-t border-neutral-800 rounded-t-3xl z-50 flex flex-col max-h-[90vh] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-900">
              <h3 className="text-md font-semibold text-neutral-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                {step === 1 && 'Onde deseja receber ofertas?'}
                {step === 2 && 'Confirmar solicitação'}
                {step === 3 && 'Tudo pronto!'}
              </h3>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-300 p-1.5 rounded-full hover:bg-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Estado
                    </label>
                    <select
                      value={estado}
                      onChange={e => setEstado(e.target.value)}
                      className="w-full bg-neutral-900 text-neutral-100 px-4 py-3 rounded-2xl border border-neutral-800 focus:border-purple-500 focus:outline-none text-[16px] md:text-sm transition-colors cursor-pointer"
                    >
                      <option value="SP">São Paulo (SP)</option>
                      <option value="RJ">Rio de Janeiro (RJ)</option>
                      <option value="MG">Minas Gerais (MG)</option>
                      <option value="PR">Paraná (PR)</option>
                      <option value="SC">Santa Catarina (SC)</option>
                      <option value="RS">Rio Grande do Sul (RS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Cidade
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Campinas (Tente Campinas)"
                      value={cidade}
                      onChange={e => setCidade(e.target.value)}
                      className={`w-full bg-neutral-900 text-neutral-100 px-4 py-3 rounded-2xl border ${
                        errors.cidade ? 'border-rose-500/50 focus:border-rose-500' : 'border-neutral-800 focus:border-purple-500'
                      } focus:outline-none text-[16px] md:text-sm transition-colors`}
                    />
                    {errors.cidade && <p className="text-xs text-rose-500 mt-1">{errors.cidade}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Seu WhatsApp para propostas
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="(19) 99999-9999"
                        value={whatsapp}
                        onChange={handlePhoneChange}
                        className={`w-full bg-neutral-900 text-neutral-100 pl-11 pr-4 py-3 rounded-2xl border ${
                          errors.whatsapp ? 'border-rose-500/50 focus:border-rose-500' : 'border-neutral-800 focus:border-purple-500'
                        } focus:outline-none text-[16px] md:text-sm transition-colors`}
                      />
                    </div>
                    {errors.whatsapp && <p className="text-xs text-rose-500 mt-1">{errors.whatsapp}</p>}
                    <p className="text-[11px] text-neutral-500 mt-1.5">
                      Você não precisa criar conta. As lojas enviarão as ofertas diretamente e notificaremos seu número.
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_20px_rgba(255,94,0,0.25)] hover:shadow-[0_4px_25px_rgba(255,94,0,0.4)] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Buscando...' : 'Buscar lojas parceiras'}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {stores.length > 0 ? (
                    <div className="text-center py-4 space-y-4">
                      <div className="w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto text-purple-500 border border-purple-500/20">
                        <MapPin className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-neutral-100">
                          Encontramos {stores.length} lojas parceiras
                        </h4>
                        <p className="text-sm text-neutral-400 mt-1">
                          na cidade de {cidade} - {estado}.
                        </p>
                      </div>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        Deseja enviar os dados do seu iPhone para receber propostas personalizadas destas lojas parceiras?
                      </p>

                      <button
                        onClick={handleSubmitRequest}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_4px_20px_rgba(255,94,0,0.25)] cursor-pointer"
                      >
                        {loading ? 'Enviando...' : 'Sim, solicitar ofertas'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4 space-y-4">
                      <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-400 border border-rose-500/20">
                        <ShieldAlert className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-neutral-100">
                          Ainda não temos parceiros ativos
                        </h4>
                        <p className="text-sm text-neutral-400 mt-1">
                          na cidade de {cidade} - {estado}.
                        </p>
                      </div>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        Podemos registrar sua simulação. Assim que houver um lojista parceiro na sua cidade, avisaremos você pelo WhatsApp. Deseja registrar?
                      </p>

                      <button
                        onClick={handleSubmitRequest}
                        disabled={loading}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                      >
                        {loading ? 'Processando...' : 'Registrar e avisar-me'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-neutral-100">Solicitação enviada!</h4>
                    <p className="text-sm text-neutral-400 mt-2 max-w-xs mx-auto">
                      {stores.length > 0
                        ? 'Agora nossos lojistas parceiros estão analisando suas informações para fazer propostas reais.'
                        : 'Sua solicitação foi registrada em nosso banco de dados.'}
                    </p>
                  </div>
                  <div className="bg-neutral-900/50 rounded-2xl p-4 border border-neutral-900 text-xs text-neutral-400 max-w-xs mx-auto">
                    Assim que as propostas forem criadas, enviaremos os detalhes diretamente para seu WhatsApp.
                  </div>

                  {createdRequestId && (
                    <button
                      onClick={() => {
                        onClose();
                        router.push(`/ofertas/${createdRequestId}`);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_20px_rgba(255,94,0,0.25)] cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver minhas propostas ao vivo
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-semibold py-3 rounded-2xl border border-neutral-800 transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
